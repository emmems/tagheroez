import { Database, dbKey } from "@/src/db/database";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import {
  Code,
  ConnectError,
  createContextKey,
  HandlerContext,
} from "@connectrpc/connect";
import { NextRequest } from "next/server";
import { EmployeeHelper } from "../employee.helper";
import { User } from "./universal.server.handler";

export const userKey = createContextKey<User>({
  sessionID: "",
  userID: "",
});

export async function authenticate(req: NextRequest, db: Database) {
  try {
    const authResponse = getAuth(req, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const returnValue = {
      sessionID: authResponse.sessionId ?? undefined,
      userID: authResponse.userId ?? undefined,
    };

    if (returnValue.userID != null) {
      const isActive = await EmployeeHelper.checkEmployeeIfActive(db, {
        userID: returnValue.userID,
        clerk: clerkClient,
      });
      if (isActive == false) {
        throw new ConnectError("Employee is not active", Code.Unauthenticated);
      }
    }

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
