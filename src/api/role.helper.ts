import { checkPermissions as cp, type APIMethod } from "@/lib/role.definition";
import { Code, ConnectError } from "@connectrpc/connect";
import { eq } from "drizzle-orm";
import { Database } from "../db/database";
import { employeesTable, type EmployeeRole } from "../db/schema/schema";

export namespace RoleHelper {
  export async function checkUserPermissions(
    db: Database,
    method: APIMethod,
    userID: string,
  ) {
    const usersList = await db
      .select({
        role: employeesTable.role,
      })
      .from(employeesTable)
      .where(eq(employeesTable.externalUserID, userID))
      .limit(1);

    if (usersList.length == 0) {
      throw new ConnectError("User not found", Code.NotFound);
    }

    checkPermissions(method, usersList[0].role);
  }

  export async function getUserRole(db: Database, userID?: string) {
    if (userID == null) {
      return undefined;
    }

    const usersList = await db
      .select({
        role: employeesTable.role,
      })
      .from(employeesTable)
      .where(eq(employeesTable.externalUserID, userID))
      .limit(1);

    if (usersList.length == 0) {
      return undefined;
    }

    return usersList[0].role;
  }

  export function checkPermissions(method: APIMethod, role: EmployeeRole) {
    try {
      cp(method, role);
    } catch (error) {
      throw new ConnectError("Permission denied", Code.PermissionDenied);
    }
  }
}
