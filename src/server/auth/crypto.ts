import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { normalisePassphrase } from "@/lib/passphrase";

/** Argon2id with 64 MiB of memory, three passes and one lane. */
const ARGON2_OPTIONS = { algorithm: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 } as const;

export function hashPassphrase(passphrase: string): Promise<string> {
  return hash(normalisePassphrase(passphrase), ARGON2_OPTIONS);
}

export async function verifyPassphrase(storedHash: string, passphrase: string): Promise<boolean> {
  try {
    return await verify(storedHash, normalisePassphrase(passphrase));
  } catch {
    return false;
  }
}

/** A random 256-bit session token, safe to put in a cookie. */
export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Compares two secrets in constant time, whatever their lengths. */
export function secretsMatch(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
