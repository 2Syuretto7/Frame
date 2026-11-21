import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { validateSession, type NewSession, type ValidSession } from "./core";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "./cookie";

export async function readSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/** The current session, or null. Every read of your data goes through this. */
export async function getCurrentSession(): Promise<ValidSession | null> {
  if (!isDatabaseConfigured()) return null;
  const token = await readSessionToken();
  if (!token) return null;
  return validateSession(getDb(), token);
}

/** The current session, or a redirect to sign in. */
export async function requireSession(): Promise<ValidSession> {
  const session = await getCurrentSession();
  if (!session) redirect("/signin");
  return session;
}

export async function setSessionCookie(session: NewSession): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, session.token, {
    ...SESSION_COOKIE_OPTIONS,
    expires: session.expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
