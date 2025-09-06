import { Code, ConnectError } from "@connectrpc/connect";
import { eq } from "drizzle-orm";
import { Database } from "../db/database";
import { employeesTable, type EmployeeRole } from "../db/schema/schema";

export namespace RoleHelper {
  export async function checkUserPermissions(
    db: Database,
    method: Method,
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

    throw new ConnectError("Permission denied", Code.PermissionDenied);
  }

  export function checkPermissions(method: Method, role: EmployeeRole) {
    if (role === "super_admin") {
      return;
    }

    switch (method) {
      case "UpdateEmployee":
        throw new ConnectError("Permission denied", Code.PermissionDenied);
      default:
        return;
    }
  }
}
export type Method =
  | "GetEmployees"
  | "UpdateEmployee"
  | "CreateUser"
  | "UpdateUser"
  | "DeleteUser"
  | "GetUsers"
  | "GetUser";
