import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import type { Db } from "./types";

let cached: Db | null = null;

/** True once the Neon database has been connected in Vercel (Task C). */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Neon's HTTP driver suits serverless functions; a plain Postgres (local development) uses node-postgres. */
export function isNeonUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

/** The shared database client. Throws if DATABASE_URL is missing; check isDatabaseConfigured first. */
export function getDb(): Db {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  cached = isNeonUrl(url)
    ? (drizzleNeon(neon(url), { schema }) as unknown as Db)
    : (drizzlePg(new Pool({ connectionString: url, max: 5 }), { schema }) as unknown as Db);
  return cached;
}
