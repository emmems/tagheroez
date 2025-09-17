import { ServiceImplementation } from "@/lib/service.implementation";
import { tryCatch } from "@/lib/try.catch";
import { create } from "@bufbuild/protobuf";
import {
  EmptySchema,
  Timestamp,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";
import { clerkClient } from "@clerk/nextjs/server";
import { Code, ConnectError, HandlerContext } from "@connectrpc/connect";
import { and, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import {
  employeesTable,
  parentChildRelationshipTable,
  siteUsersTable,
} from "../db/schema/schema";
import {
  CreateUserResponseSchema,
  EmployeeRole,
  EmployeeStatus,
  GetEmployeesResponseSchema,
  GetUserResponseSchema,
  GetUsersResponseSchema,
  UserDetailsSchema,
  UserRole,
  UserService,
  type CreateUserRequest,
  type DeleteUserRequest,
  type GetEmployeesRequest,
  type GetUserRequest,
  type GetUsersRequest,
  type InviteEmployeeRequest,
  type UpdateEmployeeRequest,
  type UpdateUserRequest,
} from "./gen/dashboard/v1/users_pb";
import { RoleHelper } from "./role.helper";
import { getCtx } from "./tools/auth";

export const userService: ServiceImplementation<typeof UserService> = {
  async inviteEmployee(req: InviteEmployeeRequest, context: HandlerContext) {
    console.log("TODO: send invitation to new employeee");

    return create(EmptySchema, {});
  },

  // async getEmployee(id: string, context: HandlerContext) {
  //   const ctx = getCtx(context);

  //   const [employee, error] = await tryCatch(
  //     ctx.db
  //       .select({
  //         id: employeesTable.id,
  //         externalUserID: employeesTable.externalUserID,
  //         lastLoginAt: employeesTable.lastLoginAt,
  //         status: employeesTable.status,
  //         role: employeesTable.role,
  //       })
  //       .from(employeesTable)
  //       .where(eq(employeesTable.id, id)),
  //   );

  //   if (error) {
  //     throw new ConnectError(Code.INTERNAL, error.message);
  //   }

  //   if (!employee) {
  //     throw new ConnectError(Code.NOT_FOUND, "Employee not found");
  //   }

  //   return {
  //     id: employee.id,
  //     externalUserID: employee.externalUserID,
  //     lastLoginAt: employee.lastLoginAt,
  //     status: employee.status,
  //     role: employee.role,
  //   };
  // },

  async getEmployees(req: GetEmployeesRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    const [list, error] = await tryCatch(
      ctx.db
        .select({
          id: employeesTable.id,
          externalUserID: employeesTable.externalUserID,
          lastLoginAt: employeesTable.lastLoginAt,
          status: employeesTable.status,
          role: employeesTable.role,
        })
        .from(employeesTable),
    );

    const userIds = list?.map((employee) => employee.externalUserID) ?? [];

    let userEmails: { [key: string]: string | undefined } = {};

    if (userIds.length > 0) {
      const clerk = await clerkClient();
      const clerkUsers = await clerk.users.getUserList({
        externalId: userIds,
        limit: 1000,
      });

      clerkUsers.data.forEach((user) => {
        userEmails[user.id] =
          user.primaryEmailAddress?.emailAddress ?? undefined;
      });
    }

    if (error) {
      throw new ConnectError("Failed to fetch employees", Code.Internal);
    }

    return create(GetEmployeesResponseSchema, {
      employees: list.map((employee) => ({
        id: `${employee.id}`,
        email: userEmails[employee.externalUserID],
        status: convertEmployeeStatus(employee.status),
        role: convertEmployeeRole(employee.role),
        lastActiveAt: optionalDateToTimestamp(employee.lastLoginAt),
      })),
    });
  },

  async updateEmployee(req: UpdateEmployeeRequest, context: HandlerContext) {
    const ctx = getCtx(context);
    await RoleHelper.checkUserPermissions(
      ctx.db,
      "UpdateEmployee",
      ctx.user.userID,
    );

    // Check if employee exists
    const [existingEmployee, fetchError] = await tryCatch(
      ctx.db
        .select()
        .from(employeesTable)
        .where(eq(employeesTable.id, parseInt(req.id)))
        .limit(1),
    );

    if (fetchError) {
      throw new ConnectError("Failed to fetch employee", Code.Internal);
    }

    if (!existingEmployee || existingEmployee.length === 0) {
      throw new ConnectError("Employee not found", Code.NotFound);
    }

    // Build update object with only defined fields
    const updateData: Partial<{
      email: string;
      status: "active" | "inactive";
      role: "admin" | "super_admin";
    }> = {};

    if (req.email !== undefined) {
      updateData.email = req.email;
    }

    if (req.status !== undefined) {
      updateData.status =
        req.status === EmployeeStatus.ACTIVE ? "active" : "inactive";
    }

    if (req.role !== undefined) {
      updateData.role =
        req.role === EmployeeRole.ADMIN ? "admin" : "super_admin";
    }

    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return create(EmptySchema, {});
    }

    // Update employee in transaction
    const [, updateError] = await tryCatch(
      ctx.db.transaction(async (tx) => {
        await tx
          .update(employeesTable)
          .set(updateData)
          .where(eq(employeesTable.id, parseInt(req.id)));
      }),
    );

    if (updateError) {
      throw new ConnectError("Failed to update employee", Code.Internal);
    }

    return create(EmptySchema, {});
  },

  async createUser(req: CreateUserRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    // Insert new user into siteUsersTable;
    const [insertResult, insertError] = await tryCatch(
      ctx.db
        .insert(siteUsersTable)
        .values({
          name: req.name,
          email: req.email,
          role: req.role === UserRole.PARENT ? "parent" : "player",
          passwordHash: undefined, // TODO later.
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: undefined, // TODO later.
        })
        .returning({ id: siteUsersTable.id }),
    );

    if (insertError) {
      throw new ConnectError("Failed to create user", Code.Internal);
    }

    if (!insertResult || insertResult.length === 0) {
      throw new ConnectError("Failed to create user", Code.Internal);
    }

    const userId = insertResult[0].id;

    if (req.parentsId) {
      const [_, error] = await tryCatch(
        ctx.db.transaction(async (tx) => {
          req.parentsId.forEach((el) => {
            ctx.db.insert(parentChildRelationshipTable).values({
              parentId: Number(el),
              childId: userId,
            });
          });
        }),
      );

      if (error) {
        throw new ConnectError(
          "Failed to set parents: " + error.message,
          Code.Internal,
        );
      }
    }

    // TODO: Mock method for sending invitation email
    // await sendInvitationEmail(req.email || "", req.name, userId);

    return create(CreateUserResponseSchema, {
      id: userId.toString(),
    });
  },

  async updateUser(req: UpdateUserRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    if (!req.updateUser) {
      throw new ConnectError("No update data provided", Code.InvalidArgument);
    }

    // Check if user exists
    const [existingUser, fetchError] = await tryCatch(
      ctx.db
        .select()
        .from(siteUsersTable)
        .where(eq(siteUsersTable.id, parseInt(req.id)))
        .limit(1),
    );

    if (fetchError) {
      throw new ConnectError("Failed to fetch user", Code.Internal);
    }

    if (!existingUser || existingUser.length === 0) {
      throw new ConnectError("User not found", Code.NotFound);
    }

    // Build update object with only defined fields
    const updateData: Partial<{
      name: string;
      email: string;
      role: "parent" | "player";
      details: unknown;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    if (req.updateUser.name !== undefined) {
      updateData.name = req.updateUser.name;
    }

    if (req.updateUser.email !== undefined) {
      updateData.email = req.updateUser.email;
    }

    if (req.updateUser.role !== undefined) {
      updateData.role =
        req.updateUser.role === UserRole.PARENT ? "parent" : "player";
    }

    if (req.updateUser.details != null) {
      updateData.details = req.updateUser.details;
    }

    const [, updateError] = await tryCatch(
      ctx.db.transaction(async (tx) => {
        // Update user data
        await tx
          .update(siteUsersTable)
          .set(updateData)
          .where(eq(siteUsersTable.id, parseInt(req.id)));

        // Handle parents - remove all existing relationships first
        await tx
          .delete(parentChildRelationshipTable)
          .where(eq(parentChildRelationshipTable.childId, parseInt(req.id)));

        // Add new parent relationships if provided
        if (req.updateUser!.parentsId && req.updateUser!.parentsId.length > 0) {
          for (const parentId of req.updateUser!.parentsId) {
            await tx.insert(parentChildRelationshipTable).values({
              parentId: parseInt(parentId),
              childId: parseInt(req.id),
            });
          }
        }
      }),
    );

    if (updateError) {
      throw new ConnectError("Failed to update user", Code.Internal);
    }

    return create(EmptySchema, {});
  },

  async deleteUser(req: DeleteUserRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    // Check if user exists
    const [existingUser, fetchError] = await tryCatch(
      ctx.db
        .select()
        .from(siteUsersTable)
        .where(eq(siteUsersTable.id, parseInt(req.id)))
        .limit(1),
    );

    if (fetchError) {
      throw new ConnectError("Failed to fetch user", Code.Internal);
    }

    if (!existingUser || existingUser.length === 0) {
      throw new ConnectError("User not found", Code.NotFound);
    }

    // Delete user and all parent-child relationships in transaction
    const [, deleteError] = await tryCatch(
      ctx.db.transaction(async (tx) => {
        // Remove all parent-child relationships where this user is the child
        await tx
          .delete(parentChildRelationshipTable)
          .where(eq(parentChildRelationshipTable.childId, parseInt(req.id)));

        // Remove all parent-child relationships where this user is the parent
        await tx
          .delete(parentChildRelationshipTable)
          .where(eq(parentChildRelationshipTable.parentId, parseInt(req.id)));

        // Delete the user
        await tx
          .delete(siteUsersTable)
          .where(eq(siteUsersTable.id, parseInt(req.id)));
      }),
    );

    if (deleteError) {
      throw new ConnectError("Failed to delete user", Code.Internal);
    }

    return create(EmptySchema, {});
  },

  async getUsers(req: GetUsersRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    // Build the base query
    const roleFilter = req.role === UserRole.PARENT ? "parent" : "player";
    let statements: (SQL<unknown> | undefined)[] = [
      eq(siteUsersTable.role, roleFilter),
    ];

    // Apply search filter if provided
    if (req.search !== undefined && req.search.trim() !== "") {
      const searchTerm = `%${req.search.trim()}%`;
      statements.push(
        or(
          ilike(siteUsersTable.name, searchTerm),
          ilike(siteUsersTable.email, searchTerm),
        ),
      );
    }

    const [users, error] = await tryCatch(
      ctx.db
        .select({
          id: siteUsersTable.id,
          name: siteUsersTable.name,
          email: siteUsersTable.email,
          role: siteUsersTable.role,
          lastLoginAt: siteUsersTable.lastLoginAt,
        })
        .from(siteUsersTable)
        .leftJoin(
          parentChildRelationshipTable,
          eq(siteUsersTable.id, parentChildRelationshipTable.childId),
        )
        .where(and(...statements))
        .groupBy(siteUsersTable.id),
    );

    if (error) {
      throw new ConnectError("Failed to fetch users", Code.Internal);
    }

    // Fetch parent-child relationships for all users
    const [relationships, relationError] = await tryCatch(
      ctx.db
        .select()
        .from(parentChildRelationshipTable)
        .where(
          inArray(
            parentChildRelationshipTable.childId,
            users.map((user) => user.id),
          ),
        ),
    );

    if (relationError) {
      throw new ConnectError(
        "Failed to fetch user relationships",
        Code.Internal,
      );
    }

    // Group parent IDs by child ID
    const parentsByChild: { [childId: number]: string[] } = {};
    relationships?.forEach((rel) => {
      if (!parentsByChild[rel.childId]) {
        parentsByChild[rel.childId] = [];
      }
      parentsByChild[rel.childId].push(rel.parentId.toString());
    });

    return create(GetUsersResponseSchema, {
      users: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email || undefined,
        role: user.role === "parent" ? UserRole.PARENT : UserRole.PLAYER,
        parentsId: parentsByChild[user.id] || [],
        details: undefined, // when getting list of users we will not return details. Please use the getUser endpoint to get details.
        lastActiveAt: optionalDateToTimestamp(user.lastLoginAt || undefined),
      })),
    });
  },

  async getUser(req: GetUserRequest, context: HandlerContext) {
    const ctx = getCtx(context);

    // Fetch the user from the database
    const [user, error] = await tryCatch(
      ctx.db
        .select({
          id: siteUsersTable.id,
          name: siteUsersTable.name,
          email: siteUsersTable.email,
          details: siteUsersTable.details,
          role: siteUsersTable.role,
          lastLoginAt: siteUsersTable.lastLoginAt,
        })
        .from(siteUsersTable)
        .where(eq(siteUsersTable.id, parseInt(req.id)))
        .limit(1),
    );

    if (error) {
      throw new ConnectError("Failed to fetch user", Code.Internal);
    }

    if (!user || user.length === 0) {
      throw new ConnectError("User not found", Code.NotFound);
    }

    const userData = user[0];

    // Fetch parent-child relationships for this user
    const [relationships, relationError] = await tryCatch(
      ctx.db
        .select()
        .from(parentChildRelationshipTable)
        .where(eq(parentChildRelationshipTable.childId, userData.id)),
    );

    if (relationError) {
      throw new ConnectError(
        "Failed to fetch user relationships",
        Code.Internal,
      );
    }

    const parentIds =
      relationships?.map((rel) => rel.parentId.toString()) || [];

    return create(GetUserResponseSchema, {
      user: {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email || undefined,
        role: userData.role === "parent" ? UserRole.PARENT : UserRole.PLAYER,
        parentsId: parentIds,
        // @ts-ignore
        details: create(UserDetailsSchema, userData.details),
        lastActiveAt: optionalDateToTimestamp(
          userData.lastLoginAt || undefined,
        ),
      },
    });
  },
};

function optionalDateToTimestamp(date?: Date): Timestamp | undefined {
  if (!date) return undefined;

  const seconds = BigInt(Math.floor(date.getTime() / 1000));
  const nanos = (date.getTime() % 1000) * 1000000;

  return create(TimestampSchema, { seconds, nanos });
}

function optionalTimestampToDate(timestamp?: Timestamp): Date | undefined {
  if (!timestamp) return undefined;

  const seconds = Number(timestamp.seconds);
  const nanos = Number(timestamp.nanos);

  const milliseconds = seconds * 1000 + Math.floor(nanos / 1000000);
  return new Date(milliseconds);
}

function dateToTimestamp(date: Date): Timestamp {
  return create(TimestampSchema, {
    seconds: BigInt(Math.floor(date.getTime() / 1000)),
    nanos: (date.getTime() % 1000) * 1000000,
  });
}

function timestampToDate(timestamp: Timestamp): Date {
  const seconds = Number(timestamp.seconds);
  const nanos = Number(timestamp.nanos);

  const milliseconds = seconds * 1000 + Math.floor(nanos / 1000000);
  return new Date(milliseconds);
}

function convertEmployeeStatus(status: string): EmployeeStatus {
  switch (status) {
    case "active":
      return EmployeeStatus.ACTIVE;
    case "inactive":
      return EmployeeStatus.INACTIVE;
    default:
      throw new Error(`Invalid employee status: ${status}`);
  }
}

function convertEmployeeRole(role: string): EmployeeRole {
  switch (role) {
    case "admin":
      return EmployeeRole.ADMIN;
    case "super_admin":
      return EmployeeRole.SUPER_ADMIN;
    default:
      throw new Error(`Invalid employee role: ${role}`);
  }
}
