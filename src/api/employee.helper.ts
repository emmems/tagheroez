import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Database } from "../db/database";
import { employeesTable } from "../db/schema/schema";

export namespace EmployeeHelper {
  export async function checkEmployeeIfActive(
    db: Database,
    args: {
      userID: string;
      clerk: typeof clerkClient;
    },
  ) {
    const list = await db
      .select({
        status: employeesTable.status,
      })
      .from(employeesTable)
      .where(eq(employeesTable.externalUserID, args.userID))
      .limit(1);

    if (list.length > 0) {
      if (list[0].status === "inactive") {
        return false;
      }
      return true;
    }

    const user = await (await args.clerk()).users.getUser(args.userID);

    await db.insert(employeesTable).values({
      externalUserID: args.userID,
      name: user.fullName ?? "no-name",
      role: "admin",
      status: "inactive",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    });
    return false;
  }

  export async function markEmployeeActive(
    db: Database,
    args: {
      userID: string;
    },
  ) {
    await db
      .update(employeesTable)
      .set({
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(employeesTable.externalUserID, args.userID));
    return true;
  }
}
