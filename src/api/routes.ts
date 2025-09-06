import { ConnectRouter } from "@connectrpc/connect";
import { dashboardService } from "./dashboard.service";
import { DashboardService } from "./gen/dashboard/v1/dashboard_pb";
import { UserService } from "./gen/dashboard/v1/users_pb";
import { userService } from "./user.service";

export function getServices() {
  return (router: ConnectRouter) => {
    router.service(DashboardService, dashboardService);
    router.service(UserService, userService);
  };
}
