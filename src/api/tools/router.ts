import { dbKey } from "@/src/db/database";
import { createContextValues } from "@connectrpc/connect";
import { NextRequest } from "next/server";
import { getServices } from "../routes";
import { authenticate, userKey } from "./auth";
import { createUniversalRequestHandler } from "./universal.server.handler";

export namespace RpcServerHandler {
  export const handler: (req: NextRequest) => Promise<Response> = async (
    request,
  ) => {
    const adapter = createUniversalRequestHandler({
      routes: getServices(),
      requestPathPrefix: "/api/rpc",

      contextValues: async (req: NextRequest) => {
        const values = createContextValues();
        values.set(userKey, await authenticate(req));
        values.set(dbKey, undefined);

        return values;
      },
    });

    return await adapter.fetch(request);
  };
}
