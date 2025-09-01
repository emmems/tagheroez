import { getServices } from "../routes";
import { createUniversalRequestHandler } from "./universal.server.handler";

export namespace RpcServerHandler {
  export const handler: (req: Request) => Promise<Response> = async (
    request,
  ) => {
    const adapter = createUniversalRequestHandler({
      routes: getServices(),
      requestPathPrefix: "/api/rpc",

      // @ts-ignore
      contextValues: async (req) => ({
        user: undefined,
      }),
    });

    return await adapter.fetch(request);
  };
}
