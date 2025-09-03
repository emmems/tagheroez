import { RpcServerHandler } from "@/src/api/tools/router";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  return RpcServerHandler.handler(req);
}
