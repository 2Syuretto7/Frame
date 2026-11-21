import "server-only";
import { headers } from "next/headers";
import { sha256 } from "./crypto";

/** A hash of the caller's network address. The address itself is never stored. */
export async function clientAddressHash(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || h.get("x-real-ip") || "unknown";
  return sha256(`frame:${address}`);
}

export async function clientUserAgent(): Promise<string> {
  return (await headers()).get("user-agent") ?? "";
}
