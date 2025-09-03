import { createContextKey } from "@connectrpc/connect";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL ?? "");

export type Database = typeof db;

export const dbKey = createContextKey<Database>(db);
