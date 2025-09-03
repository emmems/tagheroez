import { Database, dbKey } from "@/src/db/database";
import { getAuth } from "@clerk/nextjs/server";
import { createContextKey, HandlerContext } from "@connectrpc/connect";
import { NextRequest } from "next/server";
import { User } from "./universal.server.handler";

export const userKey = createContextKey<User>({
  sessionID: "",
  userID: "",
});

export async function authenticate(req: NextRequest) {
  try {
    const authResponse = getAuth(req, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const returnValue = {
      sessionID: authResponse.sessionId ?? undefined,
      userID: authResponse.userId ?? undefined,
    };

    return returnValue;
  } catch (e) {
    return undefined;
  }
}

export function getCtx(ctx: HandlerContext): { db: Database; user: User } {
  return {
    user: ctx.values.get(userKey),
    db: ctx.values.get(dbKey),
  };
}
