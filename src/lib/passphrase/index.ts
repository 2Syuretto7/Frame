import wordlist from "./eff-large-wordlist.json";

/** The EFF long word list: 7,776 words, so each random word adds about 12.9 bits. */
export const WORDS: readonly string[] = wordlist;
export const BITS_PER_WORD = Math.log2(WORDS.length);
export const DEFAULT_WORD_COUNT = 7;
export const MIN_BITS = 64;
export const MIN_LENGTH = 20;
export const MAX_LENGTH = 256;

const WORD_SET = new Set(WORDS);

/**
 * Picks a uniformly random index below `limit` using the platform's cryptographic
 * random generator, rejecting values that would bias the result.
 */
function randomIndex(limit: number, random: (buf: Uint32Array) => Uint32Array): number {
  const ceiling = Math.floor(0x1_0000_0000 / limit) * limit;
  const buf = new Uint32Array(1);
  for (;;) {
    random(buf);
    if (buf[0] < ceiling) return buf[0] % limit;
  }
}

/** A diceware-style passphrase, such as `orbit-velvet-candle-harbor-mango-tundra-quill`. */
export function generatePassphrase(
  wordCount = DEFAULT_WORD_COUNT,
  random: (buf: Uint32Array) => Uint32Array = (buf) => crypto.getRandomValues(buf),
): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) words.push(WORDS[randomIndex(WORDS.length, random)]);
  return words.join("-");
}

/**
 * The form a passphrase is compared in. Phones like to capitalise the first letter
 * and add stray spaces, and hyphens are awkward to type on a phone keyboard, so case
 * is ignored and any run of spaces or hyphens between words counts as one hyphen.
 */
export function normalisePassphrase(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Strength {
  ok: boolean;
  bits: number;
  message: string;
}

/**
 * Estimates the strength of a passphrase. A phrase made only of list words is
 * scored by word count; anything else by a conservative character-based estimate.
 */
export function assessPassphrase(input: string): Strength {
  const phrase = normalisePassphrase(input);
  if (phrase.length > MAX_LENGTH) {
    return { ok: false, bits: 0, message: `Keep it under ${MAX_LENGTH} characters.` };
  }
  const parts = phrase.split(/[\s\-_.,]+/).filter(Boolean);
  const allListWords = parts.length > 0 && parts.every((p) => WORD_SET.has(p));
  let bits: number;
  if (allListWords) {
    bits = parts.length * BITS_PER_WORD;
  } else {
    let pool = 0;
    if (/[a-z]/.test(phrase)) pool += 26;
    if (/[0-9]/.test(phrase)) pool += 10;
    if (/[^a-z0-9]/.test(phrase)) pool += 33;
    // Human-chosen text is far less random than its alphabet suggests, so count half.
    bits = (phrase.length * Math.log2(Math.max(pool, 2))) / 2;
  }
  bits = Math.round(bits);
  if (phrase.length < MIN_LENGTH || bits < MIN_BITS) {
    return {
      ok: false,
      bits,
      message: "Too easy to guess. Use at least five random words, or let Frame generate one.",
    };
  }
  return { ok: true, bits, message: `About ${bits} bits of strength.` };
}
