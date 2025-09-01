import {
  createConnectRouter,
  type ConnectRouter,
  type ConnectRouterOptions,
  type ContextValues,
} from "@connectrpc/connect";
import {
  UniversalServerRequest,
  universalServerRequestFromFetch,
  universalServerResponseToFetch,
  type UniversalHandler,
} from "@connectrpc/connect/protocol";

interface UniversalRequestHandlerOptions extends ConnectRouterOptions {
  routes: (router: ConnectRouter) => void;

  requestPathPrefix?: string;

  contextValues?: (req: Request) => Promise<ContextValues>;

  notFound?: (req: Request) => Promise<Response>;
}

export function createUniversalRequestHandler(
  options: UniversalRequestHandlerOptions,
) {
  const router = createConnectRouter({
    interceptors: options.interceptors ?? [],
  });
  options.routes(router);
  const paths = new Map<string, UniversalHandler>();
  for (const uHandler of router.handlers) {
    paths.set(uHandler.requestPath, uHandler);
  }

  return {
    async fetch(req: Request) {
      const url = new URL(req.url);
      let pathname = url.pathname;
      if (options.requestPathPrefix) {
        pathname = pathname.replace(options.requestPathPrefix, "");
      }

      const handler = paths.get(pathname);
      if (handler === undefined) {
        return (
          (await options.notFound?.(req)) ??
          new Response("Not found", { status: 404 })
        );
      }
      let uReq: UniversalServerRequest = {
        ...universalServerRequestFromFetch(req, {}),
        // @ts-ignore
        contextValues: {
          ...(await options.contextValues?.(req)),
        },
        req: req,
        resHeaders: req.headers,
      };

      const uRes = await handler(uReq);
      return universalServerResponseToFetch(uRes);
    },
  };
}
