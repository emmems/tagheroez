export type APIMethod =
  | "GetEmployees"
  | "UpdateEmployee"
  | "CreateUser"
  | "UpdateUser"
  | "DeleteUser"
  | "GetUsers"
  | "GetUser";

export function checkPermissions(method: APIMethod, role: string) {
  if (role != "admin" && role != "super_admin") {
    throw new Error("Permission denied");
  }
  if (role === "super_admin") {
    return;
  }

  switch (method) {
    case "UpdateEmployee":
      throw new Error("Permission denied");
    default:
      return;
  }
}
