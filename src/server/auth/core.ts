/**
 * Authentication logic, written against a database handle so it can be tested
 * with an in-memory Postgres. Nothing here reads cookies or headers.
 */
import { and, count, desc, eq, gt, gte, lt, min, ne } from "drizzle-orm";
import { authSession, loginAttempt, user } from "@/db/schema";
import type { Db } from "@/db/types";
import { deviceLabelFor } from "./device";
import { hashPassphrase, newSessionToken, sha256, verifyPassphrase } from "./crypto";

export const SESSION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
export const SESSION_TTL_MS = SESSION_DAYS * DAY_MS;
/** A session's expiry is pushed forward at most once an hour, to keep writes rare. */
const RENEW_AFTER_MS = 60 * 60 * 1000;

export type AttemptKind = "signin" | "setup" | "reset";

export const RATE_LIMIT = {
  /** Failures from one address within this window before it must wait. */
  perAddressWindowMs: 15 * 60 * 1000,
  perAddressFree: 5,
  /** The wait doubles with each further failure, up to this cap. */
  perAddressMaxWaitMs: 60 * 60 * 1000,
  /** Failures from all addresses together within an hour before sign-in pauses for everyone. */
  globalWindowMs: 60 * 60 * 1000,
  globalMax: 20,
};

export async function userExists(db: Db): Promise<boolean> {
  const rows = await db.select({ id: user.id }).from(user).limit(1);
  return rows.length > 0;
}

/** Creates the one account. Returns false if it already exists. */
export async function createUser(db: Db, passphrase: string): Promise<boolean> {
  const passphraseHash = await hashPassphrase(passphrase);
  const inserted = await db
    .insert(user)
    .values({ id: 1, passphraseHash })
    .onConflictDoNothing()
    .returning({ id: user.id });
  return inserted.length === 1;
}

export async function checkPassphrase(db: Db, passphrase: string): Promise<boolean> {
  const rows = await db.select({ hash: user.passphraseHash }).from(user).where(eq(user.id, 1)).limit(1);
  if (rows.length === 0) return false;
  return verifyPassphrase(rows[0].hash, passphrase);
}

export async function changePassphrase(db: Db, passphrase: string): Promise<void> {
  const passphraseHash = await hashPassphrase(passphrase);
  await db.update(user).set({ passphraseHash, updatedAt: new Date() }).where(eq(user.id, 1));
}

export interface NewSession {
  token: string;
  expiresAt: Date;
}

export async function createSession(db: Db, userAgent: string, now = new Date()): Promise<NewSession> {
  const token = newSessionToken();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await db.insert(authSession).values({
    tokenHash: sha256(token),
    userId: 1,
    deviceLabel: deviceLabelFor(userAgent),
    userAgent: userAgent.slice(0, 512),
    createdAt: now,
    lastSeenAt: now,
    expiresAt,
  });
  return { token, expiresAt };
}

export interface ValidSession {
  tokenHash: string;
  expiresAt: Date;
}

/**
 * Looks up a session by its token. Expired sessions are deleted. A session in
 * use is renewed so that it lasts 90 days from your last visit.
 */
export async function validateSession(db: Db, token: string, now = new Date()): Promise<ValidSession | null> {
  if (!token) return null;
  const tokenHash = sha256(token);
  const rows = await db
    .select({ expiresAt: authSession.expiresAt, lastSeenAt: authSession.lastSeenAt })
    .from(authSession)
    .where(eq(authSession.tokenHash, tokenHash))
    .limit(1);
  if (rows.length === 0) return null;
  const row = rows[0];
  if (row.expiresAt.getTime() <= now.getTime()) {
    await db.delete(authSession).where(eq(authSession.tokenHash, tokenHash));
    return null;
  }
  if (now.getTime() - row.lastSeenAt.getTime() > RENEW_AFTER_MS) {
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
    await db
      .update(authSession)
      .set({ lastSeenAt: now, expiresAt })
      .where(eq(authSession.tokenHash, tokenHash));
    return { tokenHash, expiresAt };
  }
  return { tokenHash, expiresAt: row.expiresAt };
}

export async function deleteSession(db: Db, tokenHash: string): Promise<void> {
  await db.delete(authSession).where(eq(authSession.tokenHash, tokenHash));
}

export async function deleteOtherSessions(db: Db, keepTokenHash: string): Promise<void> {
  await db.delete(authSession).where(ne(authSession.tokenHash, keepTokenHash));
}

export async function deleteAllSessions(db: Db): Promise<void> {
  await db.delete(authSession);
}

export interface SessionSummary {
  tokenHash: string;
  deviceLabel: string;
  createdAt: Date;
  lastSeenAt: Date;
}

export async function listSessions(db: Db, now = new Date()): Promise<SessionSummary[]> {
  return db
    .select({
      tokenHash: authSession.tokenHash,
      deviceLabel: authSession.deviceLabel,
      createdAt: authSession.createdAt,
      lastSeenAt: authSession.lastSeenAt,
    })
    .from(authSession)
    .where(gt(authSession.expiresAt, now))
    .orderBy(desc(authSession.lastSeenAt));
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterMs: number };

/** Decides whether an attempt from this address may go ahead, based on recent failures. */
export async function checkRateLimit(
  db: Db,
  kind: AttemptKind,
  ipHash: string,
  now = new Date(),
): Promise<RateLimitResult> {
  const t = now.getTime();

  const globalSince = new Date(t - RATE_LIMIT.globalWindowMs);
  const [globalFailures] = await db
    .select({ n: count(), oldest: min(loginAttempt.createdAt) })
    .from(loginAttempt)
    .where(
      and(eq(loginAttempt.kind, kind), eq(loginAttempt.success, false), gte(loginAttempt.createdAt, globalSince)),
    );
  if (globalFailures.n >= RATE_LIMIT.globalMax) {
    const oldest = globalFailures.oldest ? new Date(globalFailures.oldest).getTime() : t;
    return { allowed: false, retryAfterMs: oldest + RATE_LIMIT.globalWindowMs - t };
  }

  const since = new Date(t - RATE_LIMIT.perAddressWindowMs);
  const recent = await db
    .select({ createdAt: loginAttempt.createdAt })
    .from(loginAttempt)
    .where(
      and(
        eq(loginAttempt.kind, kind),
        eq(loginAttempt.ipHash, ipHash),
        eq(loginAttempt.success, false),
        gte(loginAttempt.createdAt, since),
      ),
    )
    .orderBy(desc(loginAttempt.createdAt));
  if (recent.length >= RATE_LIMIT.perAddressFree) {
    const extra = recent.length - RATE_LIMIT.perAddressFree;
    const wait = Math.min(60_000 * 2 ** extra, RATE_LIMIT.perAddressMaxWaitMs);
    const until = recent[0].createdAt.getTime() + wait;
    if (until > t) return { allowed: false, retryAfterMs: until - t };
  }
  return { allowed: true };
}

export async function recordAttempt(
  db: Db,
  kind: AttemptKind,
  ipHash: string,
  success: boolean,
  now = new Date(),
): Promise<void> {
  await db.insert(loginAttempt).values({ kind, ipHash, success, createdAt: now });
  // Keep the table small: attempts older than a week no longer matter.
  await db.delete(loginAttempt).where(lt(loginAttempt.createdAt, new Date(now.getTime() - 7 * DAY_MS)));
}

/** "about 3 minutes", for rate-limit messages. */
export function describeWait(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  return minutes === 1 ? "about a minute" : `about ${minutes} minutes`;
}
