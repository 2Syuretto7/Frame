"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button, TextField } from "@/components/ui";
import { assessPassphrase, generatePassphrase } from "@/lib/passphrase";

type Mode = "none" | "generated" | "own";

/**
 * Lets you generate a diceware passphrase in the browser, or type your own.
 * Whatever is chosen is submitted in a field named `passphrase`.
 */
export function PassphraseChooser({ error, label = "Passphrase" }: { error?: string; label?: string }) {
  const [mode, setMode] = useState<Mode>("none");
  const [generated, setGenerated] = useState("");
  const [own, setOwn] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setGenerated(generatePassphrase());
    setMode("generated");
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const strength = own ? assessPassphrase(own) : null;

  return (
    <div className="flex flex-col gap-4">
      <span className="small text-ink">{label}</span>

      {mode === "none" ? (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={generate}>
            Generate a passphrase
          </Button>
          <Button variant="ghost" onClick={() => setMode("own")}>
            Use my own
          </Button>
        </div>
      ) : null}

      {mode === "generated" ? (
        <div className="flex flex-col gap-3">
          <output
            className="block rounded-card border border-line bg-raised px-4 py-3 font-mono text-[16px] leading-6 break-words text-ink select-all"
            aria-live="polite"
          >
            {generated}
          </output>
          <input type="hidden" name="passphrase" value={generated} />
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={generate}>
              <RefreshCw size={16} strokeWidth={1.5} aria-hidden="true" />
              Generate another
            </Button>
            <Button variant="ghost" onClick={copy}>
              <Copy size={16} strokeWidth={1.5} aria-hidden="true" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="ghost" onClick={() => setMode("own")}>
              Use my own instead
            </Button>
          </div>
          <span className="caption text-ink-faint">
            Seven random words from the EFF list, about 90 bits of strength. When you sign in, capital letters are
            ignored and you can type spaces instead of hyphens.
          </span>
        </div>
      ) : null}

      {mode === "own" ? (
        <div className="flex flex-col gap-3">
          <TextField
            label="Your passphrase"
            name="passphrase"
            type="text"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={own}
            onChange={(e) => setOwn(e.target.value)}
            hint={strength ? strength.message : "At least five random words."}
            error={strength && !strength.ok && own.length >= 12 ? strength.message : undefined}
            className="max-w-none"
          />
          <div>
            <Button variant="ghost" onClick={generate}>
              Generate one instead
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <span className="hint text-error">{error}</span> : null}
    </div>
  );
}
