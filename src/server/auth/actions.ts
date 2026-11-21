"use server";

import { redirect } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { assessPassphrase } from "@/lib/passphrase";
import {
  changePassphrase,
  checkPassphrase,
  checkRateLimit,
  createSession,
  createUser,
  deleteAllSessions,
  deleteOtherSessions,
  deleteSession,
  describeWait,
  recordAttempt,
  userExists,
  type AttemptKind,
} from "./core";
import { secretsMatch } from "./crypto";
import { clientAddressHash, clientUserAgent } from "./request";
import { clearSessionCookie, getCurrentSession, requireSession, setSessionCookie } from "./session";

export interface FormState {
  error?: string;
  field?: string;
}

const NOT_CONNECTED: FormState = {
  error: "Frame's database is not connected yet. Finish Task C in the plan, then try again.",
};

/** Only same-site paths are allowed as a destination after signing in. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
}

async function limited(kind: AttemptKind, ipHash: string): Promise<FormState | null> {
  const verdict = await checkRateLimit(getDb(), kind, ipHash);
  if (verdict.allowed) return null;
  return { error: `Too many attempts. Please wait ${describeWait(verdict.retryAfterMs)} and try again.` };
}

async function startSession(): Promise<void> {
  const session = await createSession(getDb(), await clientUserAgent());
  await setSessionCookie(session);
}

export async function setupAccount(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDatabaseConfigured()) return NOT_CONNECTED;
  const expected = process.env.SETUP_TOKEN;
  if (!expected) return { error: "Add SETUP_TOKEN in Vercel's environment variables first (Task C)." };

  const db = getDb();
  if (await userExists(db)) return { error: "Frame already has its account. Sign in instead." };

  const ipHash = await clientAddressHash();
  const blocked = await limited("setup", ipHash);
  if (blocked) return blocked;

  const code = String(form.get("setupCode") ?? "");
  if (!secretsMatch(code.trim(), expected.trim())) {
    await recordAttempt(db, "setup", ipHash, false);
    return { error: "That setup code does not match the one in Vercel.", field: "setupCode" };
  }

  const passphrase = String(form.get("passphrase") ?? "");
  const strength = assessPassphrase(passphrase);
  if (!strength.ok) return { error: strength.message, field: "passphrase" };
  if (form.get("savedIt") !== "on") {
    return { error: "Please confirm you have saved the passphrase somewhere safe.", field: "savedIt" };
  }

  const created = await createUser(db, passphrase);
  if (!created) return { error: "Frame already has its account. Sign in instead." };
  await recordAttempt(db, "setup", ipHash, true);
  await startSession();
  redirect("/");
}

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDatabaseConfigured()) return NOT_CONNECTED;
  const db = getDb();
  if (!(await userExists(db))) return { error: "There is no account yet. Set up Frame first." };

  const ipHash = await clientAddressHash();
  const blocked = await limited("signin", ipHash);
  if (blocked) return blocked;

  const passphrase = String(form.get("passphrase") ?? "");
  const ok = passphrase.length > 0 && passphrase.length <= 256 && (await checkPassphrase(db, passphrase));
  await recordAttempt(db, "signin", ipHash, ok);
  if (!ok) return { error: "That passphrase did not match.", field: "passphrase" };

  await startSession();
  redirect(safeNext(form.get("next")));
}

export async function resetPassphrase(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDatabaseConfigured()) return NOT_CONNECTED;
  const expected = process.env.RESET_TOKEN;
  if (!expected) return { error: "Resetting is switched off. Add RESET_TOKEN in Vercel to switch it on." };

  const db = getDb();
  const ipHash = await clientAddressHash();
  const blocked = await limited("reset", ipHash);
  if (blocked) return blocked;

  const code = String(form.get("resetCode") ?? "");
  if (!secretsMatch(code.trim(), expected.trim())) {
    await recordAttempt(db, "reset", ipHash, false);
    return { error: "That reset code does not match the one in Vercel.", field: "resetCode" };
  }

  const passphrase = String(form.get("passphrase") ?? "");
  const strength = assessPassphrase(passphrase);
  if (!strength.ok) return { error: strength.message, field: "passphrase" };
  if (form.get("savedIt") !== "on") {
    return { error: "Please confirm you have saved the new passphrase somewhere safe.", field: "savedIt" };
  }

  await changePassphrase(db, passphrase);
  await deleteAllSessions(db);
  await recordAttempt(db, "reset", ipHash, true);
  await startSession();
  redirect("/");
}

export async function signOut(): Promise<void> {
  const session = await getCurrentSession();
  if (session) await deleteSession(getDb(), session.tokenHash);
  await clearSessionCookie();
  redirect("/signin");
}

export async function signOutDevice(form: FormData): Promise<void> {
  const current = await requireSession();
  const target = String(form.get("tokenHash") ?? "");
  if (!/^[0-9a-f]{64}$/.test(target)) redirect("/settings");
  await deleteSession(getDb(), target);
  if (target === current.tokenHash) {
    await clearSessionCookie();
    redirect("/signin");
  }
  redirect("/settings");
}

export async function signOutOtherDevices(): Promise<void> {
  const current = await requireSession();
  await deleteOtherSessions(getDb(), current.tokenHash);
  redirect("/settings");
}

export async function signOutEverywhere(): Promise<void> {
  await requireSession();
  await deleteAllSessions(getDb());
  await clearSessionCookie();
  redirect("/signin");
}
