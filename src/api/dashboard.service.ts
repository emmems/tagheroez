import { ServiceImplementation } from "@/lib/service.implementation";
import { create } from "@bufbuild/protobuf";
import { clerkClient } from "@clerk/nextjs/server";
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

      const client = await clerkClient();
      const user = await client.users.getUser(ctx.user.userID);

      return create(TestResponseSchema, {
        message: user.fullName ?? "-",
      });
    },
  };
