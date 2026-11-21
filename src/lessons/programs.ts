import { logLine, type TraceLine } from "./trace";

/**
 * The traced programs used by lesson diagrams. Each line's `code` is what you see;
 * its `run` does the same thing to the diagram's variables. A unit test runs the
 * real code for each program and checks the printed output is identical.
 */

/** 1.01: what console.log prints, line by line. */
export const PROGRAM_OUTPUT: TraceLine[] = [
  {
    code: 'console.log("Rainfall");',
    run: (_, out) => {
      out.push(logLine("Rainfall"));
    },
    note: () => "Text in quotes is printed exactly as written, without the quotes.",
  },
  {
    code: 'console.log("Score:", 0);',
    run: (_, out) => {
      out.push(logLine("Score:", 0));
    },
    note: () => "Two values in one call are printed on one line, with a space between them.",
  },
  { code: '// console.log("Debug mode");' },
  {
    code: "console.log(2 + 3);",
    run: (_, out) => {
      out.push(logLine(2 + 3));
    },
    note: () => "The commented-out line was skipped. Here 2 + 3 is worked out first, so 5 is printed.",
  },
  {
    code: 'console.log("2 + 3");',
    run: (_, out) => {
      out.push(logLine("2 + 3"));
    },
    note: () => "In quotes, 2 + 3 is just text, so it is printed as it is.",
  },
];

/** 1.03: variables as named boxes, and what copying a value does. */
export const PROGRAM_STATE: TraceLine[] = [
  {
    code: "let score = 0;",
    run: (v) => {
      v.score = 0;
    },
    note: () => "A new box called score is made, holding 0.",
  },
  {
    code: "let lives = 3;",
    run: (v) => {
      v.lives = 3;
    },
    note: () => "A second box, lives, holding 3.",
  },
  {
    code: "score = score + 10;",
    run: (v) => {
      v.score = (v.score as number) + 10;
    },
    note: (v) => `The right side is worked out first, using the old score: 0 + 10. Then ${v.score} is stored.`,
  },
  {
    code: "lives = lives - 1;",
    run: (v) => {
      v.lives = (v.lives as number) - 1;
    },
    note: (v) => `3 - 1 is ${v.lives}, which replaces the old value.`,
  },
  {
    code: "score = score * 2;",
    run: (v) => {
      v.score = (v.score as number) * 2;
    },
    note: (v) => `10 * 2 is ${v.score}.`,
  },
  {
    code: "let best = score;",
    run: (v) => {
      v.best = v.score;
    },
    note: (v) => `best gets a copy of the value in score right now: ${v.best}.`,
  },
  {
    code: "score = 5;",
    run: (v) => {
      v.score = 5;
    },
    note: () => "score changes to 5. best keeps its own copy, so it does not change.",
  },
  {
    code: "console.log(score, lives, best);",
    run: (v, out) => {
      out.push(logLine(v.score, v.lives, v.best));
    },
    note: () => "The three values are printed in order.",
  },
];

/** 1.06: a for loop, step by step. */
export const PROGRAM_LOOP: TraceLine[] = [
  {
    code: "let total = 0;",
    run: (v) => {
      v.total = 0;
    },
    note: () => "total starts at 0. It will collect points as the loop runs.",
  },
  {
    code: "for (let wave = 1; wave <= 3; wave++) {",
    run: (v) => {
      v.wave = v.wave === undefined ? 1 : (v.wave as number) + 1;
      if ((v.wave as number) <= 3) return;
      delete v.wave;
      return 5;
    },
    note: (v) =>
      v.wave === undefined
        ? "wave is now 4, so wave <= 3 is false. The loop ends, and wave no longer exists outside it."
        : v.wave === 1
          ? "The loop starts: wave is set to 1, then the condition wave <= 3 is checked. It is true."
          : `wave++ adds one, making ${v.wave}. The condition wave <= 3 is checked again. It is true.`,
  },
  {
    code: "  total = total + wave * 10;",
    run: (v) => {
      v.total = (v.total as number) + (v.wave as number) * 10;
    },
    note: (v) => `Wave ${v.wave} is worth ${(v.wave as number) * 10} points, so total becomes ${v.total}.`,
  },
  {
    code: '  console.log("Wave", wave, "total", total);',
    run: (v, out) => {
      out.push(logLine("Wave", v.wave, "total", v.total));
    },
  },
  {
    code: "}",
    run: () => 1,
    note: () => "The end of the loop body. Back to the top for the step and the check.",
  },
  {
    code: 'console.log("Done:", total);',
    run: (v, out) => {
      out.push(logLine("Done:", v.total));
    },
    note: () => "The line after the loop runs once, after the loop has finished.",
  },
];
