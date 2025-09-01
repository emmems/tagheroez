"use client";

import { rpcProvider, useQuery } from "../api/rpc.provider";

export function Test() {
  const { data: test } = useQuery(rpcProvider.dashboardRouter.test);

  return <div>{test?.message ?? "Loading..."}</div>;
}
