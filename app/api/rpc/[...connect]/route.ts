import { RpcServerHandler } from "@/src/api/tools/router";

export async function POST(req: Request): Promise<Response> {
  return RpcServerHandler.handler(req);
}
