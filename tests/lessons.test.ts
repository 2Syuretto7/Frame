import { describe, expect, it } from "vitest";
import { GRAPH } from "@/curriculum/graph";
import { LESSON_IDS, LESSONS } from "@/lessons";
import { EVALUATIONS } from "@/lessons/evaluations";
import { PROGRAM_LOOP, PROGRAM_OUTPUT, PROGRAM_STATE } from "@/lessons/programs";
import { runTrace, sourceOf, type TraceLine } from "@/lessons/trace";

/** Runs plain JavaScript and returns what it printed, exactly as console.log would format it. */
function run(source: string): string[] {
  const out: string[] = [];
  const fakeConsole = {
    log: (...values: unknown[]) =>
      out.push(values.map((v) => (typeof v === "string" ? v : String(v))).join(" ")),
  };
  new Function("console", source)(fakeConsole);
  return out;
}

describe("lessons", () => {
  it("cover nodes that exist, in teaching order", () => {
    const orders = LESSON_IDS.map((id) => GRAPH.byId.get(id)?.order ?? -1);
    expect(orders.every((o) => o >= 0)).toBe(true);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    expect(LESSON_IDS).toEqual(["1.01", "1.02", "1.03", "1.04", "1.05", "1.06"]);
  });

  it("recap exactly the prerequisites of their node", () => {
    for (const lesson of Object.values(LESSONS)) {
      const node = GRAPH.byId.get(lesson.id)!;
      expect(Object.keys(lesson.comesFrom).sort(), lesson.id).toEqual([...node.prereqs].sort());
    }
  });

  it("state worked example outputs that the real code produces", () => {
    for (const lesson of Object.values(LESSONS)) {
      expect(run(lesson.example.code), lesson.id).toEqual(lesson.example.output);
    }
  });

  it("point worked example steps at real lines", () => {
    for (const lesson of Object.values(LESSONS)) {
      const count = lesson.example.code.split("\n").length;
      for (const step of lesson.example.steps) {
        for (const line of step.lines) expect(line, lesson.id).toBeLessThan(count);
      }
    }
  });
});

describe("traced programs", () => {
  const programs: [string, TraceLine[]][] = [
    ["output", PROGRAM_OUTPUT],
    ["state", PROGRAM_STATE],
    ["loop", PROGRAM_LOOP],
  ];

  it.each(programs)("%s prints the same as the real code", (_, lines) => {
    const steps = runTrace(lines);
    expect(steps[steps.length - 1].output).toEqual(run(sourceOf(lines)));
  });

  it("tracks state and loop scope step by step", () => {
    const state = runTrace(PROGRAM_STATE);
    expect(state[state.length - 1].vars).toEqual({ score: 5, lives: 2, best: 20 });
    const loop = runTrace(PROGRAM_LOOP);
    // let total, then three passes of header, body, log and brace, the final check, and the last log.
    expect(loop).toHaveLength(1 + 3 * 4 + 1 + 1);
    expect(loop[loop.length - 1].vars).toEqual({ total: 60 });
  });
});

describe("expression reductions", () => {
  it.each(EVALUATIONS.map((e) => [e.expression, e] as const))("%s keeps its value at every step", (_, e) => {
    const value = (src: string) => new Function(`return (${src});`)();
    const expected = value(e.expression);
    let current = e.expression;
    for (const step of e.steps) {
      expect(current.includes(step.part), `${current} contains ${step.part}`).toBe(true);
      expect(value(step.result)).toEqual(expected);
      current = step.result;
    }
    expect(String(expected)).toBe(e.steps[e.steps.length - 1].result);
  });
});
