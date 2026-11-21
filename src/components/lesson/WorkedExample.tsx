"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { cx } from "@/components/midnight/cx";
import type { WorkedStep } from "@/lessons/types";
import { CodeBlock } from "./CodeBlock";

/**
 * The worked example: commit to a prediction, reveal the real output, then walk
 * through the reasoning one step at a time with the relevant lines marked.
 */
export function WorkedExample({
  code,
  predict,
  steps,
  output,
}: {
  code: string;
  predict: string;
  steps: WorkedStep[];
  output: string[];
}) {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <CodeBlock code={code} title="example.ts" active={revealed ? steps[active].lines : []} />

      <div className="flex flex-col gap-3 rounded-card border border-line p-4">
        <span className="eyebrow text-ink-faint">PREDICT FIRST</span>
        <p className="body m-0 text-ink">{predict}</p>
        {revealed ? (
          <pre
            className="m-0 overflow-x-auto rounded-control border p-3"
            style={{ background: "var(--code-background)", borderColor: "var(--code-border)", color: "var(--code-text)", font: "var(--text-code)" }}
          >
            {output.join("\n")}
          </pre>
        ) : (
          <div>
            <button type="button" className="mds-btn mds-btn-secondary" onClick={() => setRevealed(true)}>
              <Eye size={16} strokeWidth={1.5} aria-hidden="true" />
              I have my prediction, show the output
            </button>
          </div>
        )}
      </div>

      {revealed ? (
        <ol className="m-0 flex list-none flex-col p-0">
          {steps.map((step, i) => (
            <li key={i} className="border-t border-line first:border-t-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cx(
                  "flex w-full items-start gap-4 bg-transparent py-3 text-left",
                  active === i ? "text-ink" : "text-ink-secondary hover:text-ink",
                )}
              >
                <span
                  className="eyebrow mt-1 w-20 flex-none"
                  style={{ color: active === i ? "var(--accent)" : "var(--text-faint)" }}
                >
                  {`LINE${step.lines.length > 1 ? "S" : ""} ${step.lines.map((l) => l + 1).join(",")}`}
                </span>
                <span className="body">{step.text}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
