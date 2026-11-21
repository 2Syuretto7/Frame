import { describe, expect, it } from "vitest";
import { WORDS, assessPassphrase, generatePassphrase, normalisePassphrase } from "@/lib/passphrase";

describe("passphrases", () => {
  it("uses the full EFF long list", () => {
    expect(WORDS).toHaveLength(7776);
    expect(new Set(WORDS).size).toBe(7776);
  });

  it("generates seven list words joined by hyphens", () => {
    const phrase = generatePassphrase();
    const words = phrase.split("-");
    expect(words.length).toBeGreaterThanOrEqual(7);
    expect(assessPassphrase(phrase).ok).toBe(true);
    expect(assessPassphrase(phrase).bits).toBeGreaterThanOrEqual(90);
  });

  it("does not repeat itself", () => {
    const seen = new Set(Array.from({ length: 200 }, () => generatePassphrase()));
    expect(seen.size).toBe(200);
  });

  it("ignores case and stray whitespace from phone keyboards", () => {
    expect(normalisePassphrase("  Orbit-velvet  candle ")).toBe("orbit-velvet-candle");
    expect(normalisePassphrase("Orbit Velvet - candle")).toBe(normalisePassphrase("orbit-velvet-candle"));
  });

  it("refuses weak passphrases", () => {
    expect(assessPassphrase("password").ok).toBe(false);
    expect(assessPassphrase("orbit-velvet-candle").ok).toBe(false);
    expect(assessPassphrase("correcthorse").ok).toBe(false);
  });

  it("accepts five or more list words", () => {
    expect(assessPassphrase("orbit velvet candle harbor mango").ok).toBe(true);
  });
});
