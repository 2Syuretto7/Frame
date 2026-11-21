"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { formatValue, runTrace, type TraceLine } from "@/lessons/trace";
import { DiagramFrame } from "./DiagramFrame";
import { Stepper } from "./controls";

export interface TraceViewProps {
  title: string;
  description: string;
  lines: TraceLine[];
  /** Shown before the first step, to ask for a prediction. */
  prompt?: string;
  /** Hide the variables panel for programs that have none. */
  showVariables?: boolean;
}

/**
 * Runs a program one line at a time. The line about to finish is marked, the
 * variables show what the computer is holding, and the output fills as it is printed.
 */
export function TraceView({ title, description, lines, prompt, showVariables = true }: TraceViewProps) {
  const steps = useMemo(() => runTrace(lines), [lines]);
  const [step, setStep] = useState(0);
  const current = step > 0 ? steps[step - 1] : null;
  const previous = step > 1 ? steps[step - 2] : null;
  const vars = current?.vars ?? {};
  const output = current?.output ?? [];
  const names = Object.keys(vars);
  const go = (next: number) => setStep(Math.max(0, Math.min(steps.length, next)));

  return (
    <DiagramFrame
      title={title}
      description={description}
      controls={<Stepper step={step} total={steps.length} onStep={go} />}
    >
      <div className="flex flex-col gap-4">
        <CodeBlock code={lines.map((l) => l.code)} active={current ? [current.line] : []} />
        <p className="small m-0 min-h-10 text-ink-secondary" aria-live="polite">
          {current?.note ?? (step === 0 ? (prompt ?? "Press Next to run the first line.") : "")}
          {step === steps.length && step > 0 ? " The program has finished." : ""}
        </p>
        <div className={showVariables ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
          {showVariables ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow text-diagram-ink">VARIABLES</span>
              {names.length === 0 ? (
                <span className="caption text-ink-faint">None yet.</span>
              ) : (
                <table className="w-full border-collapse" style={{ font: "var(--text-code)" }}>
                  <tbody>
                    {names.map((name) => {
                      const changed = !previous || previous.vars[name] !== vars[name];
                      return (
                        <tr key={name} className="border-t border-diagram-line first:border-t-0">
                          <td className="py-2 pr-3 text-ink-secondary">{name}</td>
                          <td className="py-2 text-right" style={{ color: changed ? "var(--accent)" : "var(--text-primary)" }}>
                            {formatValue(vars[name])}
                            {changed ? <span className="sr-only"> (just changed)</span> : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-diagram-ink">OUTPUT</span>
            <pre
              className="m-0 min-h-16 overflow-x-auto rounded-control border p-3"
              style={{
                background: "var(--code-background)",
                borderColor: "var(--code-border)",
                color: "var(--code-text)",
                font: "var(--text-code)",
              }}
              aria-live="polite"
            >
              {output.length === 0 ? <span style={{ color: "var(--code-muted)" }}>Nothing printed yet</span> : output.join("\n")}
            </pre>
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
