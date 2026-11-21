import { LoopTiles, LoopTrace } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.06",
  problem: (
    <>
      <p>
        You want to draw a row of twenty floor tiles, or count down from 10 to launch, or add up the points
        from every wave. Writing the same line twenty times would work, but it is slow, easy to get wrong and
        impossible to change when you want thirty tiles instead.
      </p>
      <p>
        A loop tells the computer to repeat a block of code, and to stop at exactly the right moment.
      </p>
    </>
  ),
  comesFrom: {
    "1.05":
      "if runs a block only when its condition is true, else if chains are checked from the top, and only the first true branch runs. && and || combine conditions.",
  },
  idea: (
    <>
      <p>
        A <code>while</code> loop is an <code>if</code> that keeps coming back. It checks its condition, and if
        it is true, runs the block, then checks again, and so on, until the condition is false:
      </p>
      <p>
        <code>while (countdown &gt; 0) {"{"} countdown = countdown - 1; {"}"}</code>
      </p>
      <p>
        Something inside the loop must eventually make the condition false. If nothing does, the loop never
        ends and the page freezes.
      </p>
      <p>
        A <code>for</code> loop packs the three parts of a counting loop into one line:
      </p>
      <p>
        <code>for (let i = 0; i &lt; 5; i++) {"{"} ... {"}"}</code>
      </p>
      <ol>
        <li>
          <strong>Start</strong>: <code>let i = 0</code> runs once, before anything else.
        </li>
        <li>
          <strong>Check</strong>: <code>i &lt; 5</code> is tested before every pass. If it is false, the loop ends.
        </li>
        <li>
          <strong>Body</strong>: the code in the braces runs.
        </li>
        <li>
          <strong>Step</strong>: <code>i++</code>, short for <code>i = i + 1</code>, runs after every pass. Then
          back to the check.
        </li>
      </ol>
      <p>
        Starting at 0 and checking <code>&lt; 5</code> gives exactly five passes, with <code>i</code> taking the
        values 0, 1, 2, 3 and 4. This start-at-zero habit will matter a great deal when you meet arrays.
      </p>
      <p>
        Two extra controls: <code>break</code> leaves the loop immediately, and <code>continue</code> skips the
        rest of this pass and moves on to the step.
      </p>
    </>
  ),
  play: {
    diagrams: [<LoopTrace key="trace" />, <LoopTiles key="tiles" />],
    prompts: [
      "In the first diagram, notice that the header line is visited four times, but the body only three.",
      "With the tiles, set start to 0 and end to 6, then switch between i < end and i <= end. Count the tiles.",
      "Find settings where the loop runs zero times. What is true about start and end then?",
    ],
  },
  example: {
    intro: "A launch countdown with a while loop, then finding the first empty slot with a for loop.",
    code: [
      "let countdown = 3;",
      "while (countdown > 0) {",
      "  console.log(countdown);",
      "  countdown--;",
      "}",
      'console.log("Launch");',
      "for (let slot = 0; slot < 10; slot++) {",
      "  if (slot % 3 === 0) {",
      "    continue;",
      "  }",
      '  console.log("Empty slot:", slot);',
      "  break;",
      "}",
    ].join("\n"),
    predict: "How many numbers does the countdown print? And which slot does the second loop report?",
    steps: [
      { lines: [0, 1], text: "countdown is 3, and 3 > 0 is true, so the body runs." },
      { lines: [2, 3], text: "It prints 3, then countdown-- makes it 2. Back to the check." },
      { lines: [1], text: "The same happens for 2 and 1. When countdown reaches 0, 0 > 0 is false and the loop ends." },
      { lines: [5], text: "The line after the loop runs once." },
      { lines: [6, 7, 8], text: "slot 0: 0 % 3 is 0, so continue skips the rest of this pass and moves to slot 1." },
      { lines: [10, 11], text: "slot 1: 1 % 3 is 1, so the message is printed, then break ends the loop for good." },
    ],
    output: ["3", "2", "1", "Launch", "Empty slot: 1"],
  },
  honest: (
    <>
      <p>
        <strong>Off by one is the most common loop bug in the world.</strong> <code>&lt;</code> versus{" "}
        <code>&lt;=</code>, or starting at 0 versus 1, changes the count by one. When you write a loop, say out loud
        the first and last values it should take, then check both.
      </p>
      <p>
        <strong>A loop that never ends freezes the page.</strong> Frame&apos;s editor will stop runaway loops for
        you, but a real browser will simply hang. The usual cause is forgetting the step, or a step that moves
        away from the stopping point.
      </p>
      <p>
        <strong>A game does not loop like this.</strong> A while loop that runs your whole game would never let
        the screen redraw. Games repeat through a special kind of loop that the browser drives, once per frame.
        That is the game loop, a few lessons from now.
      </p>
    </>
  ),
  build:
    "Practice will ask you to trace loops in variable tables, predict how many times a body runs, fix loops that run once too often or never stop, and write loops that draw rows and grids of tiles in the live preview.",
};
