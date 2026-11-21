import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import type { Db } from "@/db/types";
import {
  RATE_LIMIT,
  SESSION_TTL_MS,
  changePassphrase,
  checkPassphrase,
  checkRateLimit,
  createSession,
  createUser,
  deleteOtherSessions,
  listSessions,
  recordAttempt,
  userExists,
  validateSession,
} from "@/server/auth/core";
import { secretsMatch } from "@/server/auth/crypto";
import { deviceLabelFor } from "@/server/auth/device";
import { testDb } from "./helpers";

const PHRASE = "orbit-velvet-candle-harbor-mango-tundra-quill";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

let db: Db;
beforeEach(async () => {
  db = await testDb();
});

describe("the single account", () => {
  it("can be created exactly once", async () => {
    expect(await userExists(db)).toBe(false);
    expect(await createUser(db, PHRASE)).toBe(true);
    expect(await userExists(db)).toBe(true);
    expect(await createUser(db, "another-phrase-entirely-different-words")).toBe(false);
    expect(await checkPassphrase(db, PHRASE)).toBe(true);
  });

  it("is protected by a database constraint as well", async () => {
    await createUser(db, PHRASE);
    await expect(
      db.execute(sql`insert into "user" (id, passphrase_hash) values (2, 'x')`),
    ).rejects.toThrow();
  });

  it("stores only an Argon2id hash", async () => {
    await createUser(db, PHRASE);
    const rows = await db.execute(sql`select passphrase_hash from "user"`);
    const stored = (rows as unknown as { rows: Array<{ passphrase_hash: string }> }).rows[0].passphrase_hash;
    expect(stored.startsWith("$argon2id$v=19$m=65536,t=3,p=1$")).toBe(true);
    expect(stored).not.toContain("orbit");
  });

  it("accepts the passphrase with different capitals and spacing", async () => {
    await createUser(db, PHRASE);
    expect(await checkPassphrase(db, "  Orbit-Velvet-Candle-Harbor-Mango-Tundra-Quill ")).toBe(true);
    expect(await checkPassphrase(db, "orbit-velvet-candle")).toBe(false);
  });

  it("can change its passphrase", async () => {
    await createUser(db, PHRASE);
    await changePassphrase(db, "lantern-quarry-meadow-pixel-harbor-tundra");
    expect(await checkPassphrase(db, PHRASE)).toBe(false);
    expect(await checkPassphrase(db, "lantern-quarry-meadow-pixel-harbor-tundra")).toBe(true);
  });
});

describe("sessions", () => {
  beforeEach(async () => {
    await createUser(db, PHRASE);
  });

  it("validates a fresh session and stores only the token's hash", async () => {
    const { token } = await createSession(db, IPHONE);
    expect(await validateSession(db, token)).not.toBeNull();
    expect(await validateSession(db, token + "x")).toBeNull();
    const rows = await db.execute(sql`select token_hash from auth_session`);
    const stored = (rows as unknown as { rows: Array<{ token_hash: string }> }).rows[0].token_hash;
    expect(stored).not.toBe(token);
    expect(stored).toMatch(/^[0-9a-f]{64}$/);
  });

  it("expires after 90 days without use, and renews with use", async () => {
    const start = new Date("2026-01-01T00:00:00Z");
    const { token } = await createSession(db, IPHONE, start);
    const day80 = new Date(start.getTime() + 80 * 86_400_000);
    const renewed = await validateSession(db, token, day80);
    expect(renewed?.expiresAt.getTime()).toBe(day80.getTime() + SESSION_TTL_MS);
    const day160 = new Date(start.getTime() + 160 * 86_400_000);
    expect(await validateSession(db, token, day160)).not.toBeNull();
    const muchLater = new Date(day160.getTime() + SESSION_TTL_MS + 1000);
    expect(await validateSession(db, token, muchLater)).toBeNull();
  });

  it("lists devices and signs out the others", async () => {
    const a = await createSession(db, IPHONE);
    await createSession(db, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/140.0 Safari/537.36");
    const sessions = await listSessions(db);
    expect(sessions.map((s) => s.deviceLabel).sort()).toEqual(["Chrome on Mac", "Safari on iPhone"]);
    const current = await validateSession(db, a.token);
    await deleteOtherSessions(db, current!.tokenHash);
    expect(await listSessions(db)).toHaveLength(1);
  });
});

describe("rate limiting", () => {
  const ip = "a".repeat(64);
  const now = new Date("2026-03-01T10:00:00Z");

  it("allows five failures, then makes the address wait", async () => {
    for (let i = 0; i < RATE_LIMIT.perAddressFree; i++) {
      expect((await checkRateLimit(db, "signin", ip, now)).allowed).toBe(true);
      await recordAttempt(db, "signin", ip, false, now);
    }
    const verdict = await checkRateLimit(db, "signin", ip, now);
    expect(verdict.allowed).toBe(false);
    const later = new Date(now.getTime() + 61_000);
    expect((await checkRateLimit(db, "signin", ip, later)).allowed).toBe(true);
  });

  it("does not let one address lock out another", async () => {
    for (let i = 0; i < 6; i++) await recordAttempt(db, "signin", ip, false, now);
    expect((await checkRateLimit(db, "signin", "b".repeat(64), now)).allowed).toBe(true);
  });

  it("pauses everyone after too many failures in an hour", async () => {
    for (let i = 0; i < RATE_LIMIT.globalMax; i++) {
      await recordAttempt(db, "signin", `${i}`.padStart(64, "0"), false, now);
    }
    expect((await checkRateLimit(db, "signin", "c".repeat(64), now)).allowed).toBe(false);
    const nextHour = new Date(now.getTime() + RATE_LIMIT.globalWindowMs + 1000);
    expect((await checkRateLimit(db, "signin", "c".repeat(64), nextHour)).allowed).toBe(true);
  });
});

describe("helpers", () => {
  it("compares secrets correctly", () => {
    expect(secretsMatch("abc", "abc")).toBe(true);
    expect(secretsMatch("abc", "abd")).toBe(false);
    expect(secretsMatch("", "abc")).toBe(false);
  });

  it("labels common devices", () => {
    expect(deviceLabelFor(IPHONE)).toBe("Safari on iPhone");
    expect(deviceLabelFor("Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140.0 Mobile Safari/537.36")).toBe(
      "Chrome on Android phone",
    );
  });
});
