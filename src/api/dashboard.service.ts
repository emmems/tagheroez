import { ServiceImplementation } from "@/lib/service.implementation";
import { type HandlerContext } from "@connectrpc/connect";
import { DashboardService, TestRequest } from "./gen/dashboard/v1/dashboard_pb";

export const dashboardService: ServiceImplementation<typeof DashboardService> =
  {
    async test(req: TestRequest, context: HandlerContext) {
      return {
        message: "Hello!",
      };
    },
  };
