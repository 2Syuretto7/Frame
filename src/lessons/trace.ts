/**
 * A tiny step-by-step machine for lesson diagrams. Each line of a program carries
 * the code you see and a small function that does what that line does, so the
 * diagram can show the variables and the output after every step. A unit test runs
 * the real code for every traced program and checks the output matches.
 */
export type Value = number | string | boolean | undefined;
export type Vars = Record<string, Value>;

export interface TraceLine {
  code: string;
  /**
   * Runs the line. Return the index of the next line to jump to, or nothing to
   * move to the next line. Lines without `run` (such as a closing brace) are skipped.
   */
  run?: (vars: Vars, out: string[]) => number | void;
  /** Explains what just happened, shown beside the step. */
  note?: (vars: Vars) => string;
}

export interface TraceStep {
  line: number;
  vars: Vars;
  output: string[];
  note: string | null;
}

export function formatValue(value: Value): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === undefined) return "undefined";
  return String(value);
}

/** What console.log prints for its arguments: strings without quotes, joined by spaces. */
export function logLine(...values: Value[]): string {
  return values.map((v) => (typeof v === "string" ? v : formatValue(v))).join(" ");
}

export function runTrace(lines: TraceLine[], maxSteps = 200): TraceStep[] {
  const vars: Vars = {};
  const output: string[] = [];
  const steps: TraceStep[] = [];
  let pc = 0;
  while (pc < lines.length) {
    const line = lines[pc];
    if (!line.run) {
      pc += 1;
      continue;
    }
    if (steps.length >= maxSteps) throw new Error("The traced program ran for too many steps");
    const jump = line.run(vars, output);
    steps.push({ line: pc, vars: { ...vars }, output: [...output], note: line.note ? line.note(vars) : null });
    pc = typeof jump === "number" ? jump : pc + 1;
  }
  return steps;
}

/** The program as plain source text, for running it for real in tests and the sandbox. */
export function sourceOf(lines: TraceLine[]): string {
  return lines.map((l) => l.code).join("\n");
}
