import * as dashboardRouter from "./gen/dashboard/v1/dashboard-DashboardService_connectquery";
import * as userRouter from "./gen/dashboard/v1/users-UserService_connectquery";

import { useMutation as um, useQuery as uq } from "@connectrpc/connect-query";

export const useQuery = uq;
export const useMutation = um;

export const rpcProvider = {
  dashboardRouter: dashboardRouter,
  userRouter: userRouter,
};
