import { EvaluationOrder, RemainderWheel } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.04",
  problem: (
    <>
      <p>
        A sword does 10 damage, doubled on a critical hit, and armour removes 4. You write{" "}
        <code>10 * 2 - 4</code> and get 16, as you hoped. Then you change it to <code>10 - 4 * 2</code>, meaning
        &quot;armour first, then double&quot;, and get 2. The numbers are the same, but the order the computer
        used was not the order you had in mind.
      </p>
      <p>
        Games are full of small calculations like this: damage, wrapping a ship around the screen edge,
        deciding whose turn it is. You need to know exactly how the computer reads them.
      </p>
    </>
  ),
  comesFrom: {
    "1.03":
      "A variable is a named box holding one value. = works out the right-hand side first, then stores it, which is why score = score + 10 adds to the old value.",
  },
  idea: (
    <>
      <p>
        An <strong>expression</strong> is anything that works out to a value, such as <code>2 + 3</code>,{" "}
        <code>score * 2</code> or <code>lives &gt; 0</code>. When an expression has several operators, the
        computer follows fixed rules of <strong>precedence</strong>, the same ones you may know from school
        maths:
      </p>
      <ul>
        <li>Brackets first.</li>
        <li>
          Then <code>*</code>, <code>/</code> and <code>%</code>, from left to right.
        </li>
        <li>
          Then <code>+</code> and <code>-</code>, from left to right.
        </li>
        <li>
          Then comparisons such as <code>&lt;</code>, <code>&gt;=</code> and <code>===</code>, which give a boolean.
        </li>
      </ul>
      <p>
        The new operator is <code>%</code>, the <strong>remainder</strong>. <code>a % b</code> is what is left
        over after dividing <code>a</code> into as many whole groups of <code>b</code> as possible.{" "}
        <code>10 % 4</code> is 2, because two groups of 4 make 8 and 2 are left. Picture walking round a clock
        face with <code>b</code> positions: after <code>a</code> steps you land on <code>a % b</code>. That
        makes it perfect for things that cycle, such as animation frames, turns between players and wrapping
        round the edge of the screen.
      </p>
      <p>
        Its partner is whole-number division: <code>Math.floor(a / b)</code> counts the full groups, or full
        turns round the clock. Together they always satisfy <code>a = Math.floor(a / b) * b + a % b</code> for
        positive numbers.
      </p>
      <p>
        When in doubt, add brackets. <code>(10 - 4) * 2</code> says exactly what you mean, and anyone reading it
        later will thank you.
      </p>
    </>
  ),
  play: {
    diagrams: [<EvaluationOrder key="order" />, <RemainderWheel key="wheel" />],
    prompts: [
      "In the first diagram, predict the final value before stepping. 10 - 4 - 3 catches many people out.",
      "On the wheel, keep d at 4 and move n from 0 to 12. Watch the slot repeat every four steps.",
      "Find a value of n where n % d is 0. What do those values have in common?",
    ],
  },
  example: {
    intro: "Three small game calculations: damage, a cycling animation frame and whose turn it is.",
    code: [
      "const damage = 10 * 2 - 4;",
      "const armoured = (10 - 4) * 2;",
      "console.log(damage, armoured);",
      "const tick = 14;",
      "const frame = tick % 4;",
      "const loops = Math.floor(tick / 4);",
      "console.log(frame, loops);",
      "const turn = 7;",
      "console.log(turn % 2 === 0);",
    ].join("\n"),
    predict: "What do the three console.log lines print? The last one prints a boolean.",
    steps: [
      { lines: [0], text: "Multiplication first: 10 * 2 is 20, then 20 - 4 is 16." },
      { lines: [1, 2], text: "The brackets force the subtraction first: 6 * 2 is 12." },
      {
        lines: [3, 4, 5],
        text: "A four-frame animation on tick 14: 14 % 4 is 2, so frame 2 is shown, after 3 full loops.",
      },
      { lines: [6], text: "The two numbers are printed on one line." },
      {
        lines: [7, 8],
        text: "Even turns belong to player one. 7 % 2 is 1, and 1 === 0 is false. % comes before ===.",
      },
    ],
    output: ["16 12", "2 3", "false"],
  },
  honest: (
    <>
      <p>
        <strong>Remainders of negative numbers keep the sign of the left side.</strong> <code>-1 % 4</code> is{" "}
        <code>-1</code>, not 3. When you wrap a position that can go below zero, the usual fix is{" "}
        <code>((n % b) + b) % b</code>. You will need this when ships fly off the left edge of the screen.
      </p>
      <p>
        <strong>/ gives decimals.</strong> <code>7 / 2</code> is <code>3.5</code>, not 3. Use{" "}
        <code>Math.floor</code> when you want whole groups.
      </p>
      <p>
        <strong>== and === are different.</strong> <code>==</code> converts types before comparing, so{" "}
        <code>&quot;5&quot; == 5</code> is <code>true</code>. That conversion hides bugs. Frame always uses{" "}
        <code>===</code>, and you should too.
      </p>
    </>
  ),
  build:
    "Practice will ask you to evaluate expressions by hand, step by step, work out remainders for wrapping and cycling, spot a missing bracket in a damage formula, and write expressions that decide whose turn it is.",
};
