import { ServiceImplementation } from "@/lib/service.implementation";
import { create } from "@bufbuild/protobuf";
import { HandlerContext } from "@connectrpc/connect";
import {
  DashboardService,
  TestRequest,
  TestResponseSchema,
} from "./gen/dashboard/v1/dashboard_pb";
import { getCtx } from "./tools/auth";

export const dashboardService: ServiceImplementation<typeof DashboardService> =
  {
    async test(req: TestRequest, context: HandlerContext) {
      const ctx = getCtx(context);

      return create(TestResponseSchema, {
        message: "Hello!",
      });
    },
  };
