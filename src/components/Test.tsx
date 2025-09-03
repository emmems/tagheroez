"use client";

import { rpcProvider, useQuery } from "../api/rpc.provider";

export function Test() {
  const { data: test } = useQuery(rpcProvider.dashboardRouter.test);

  return (
    <p>{`Welcome back, ${test?.message ?? "Loading..."}! Here's an overview of Tag Heroez activity.`}</p>
  );
}
