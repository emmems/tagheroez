import { ConnectRouter } from "@connectrpc/connect";
import { dashboardService } from "./dashboard.service";
import { DashboardService } from "./gen/dashboard/v1/dashboard_pb";

export function getServices() {
  return (router: ConnectRouter) => {
    router.service(DashboardService, dashboardService);
  };
}
