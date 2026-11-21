import { BranchExplorer } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.05",
  problem: (
    <>
      <p>
        When the player runs out of lives, the game should end. When they reach 1,000 points, a new level
        should start. Every program so far has done the same thing every time, line after line. A game has to
        make decisions.
      </p>
      <p>
        This lesson teaches your code to choose: to run some lines only when something is true, and to pick
        one of several paths.
      </p>
    </>
  ),
  comesFrom: {
    "1.04":
      "Expressions work out to values, following precedence: brackets, then * / %, then + -, then comparisons. Comparisons such as lives > 0 give a boolean.",
  },
  idea: (
    <>
      <p>
        An <code>if</code> statement runs a block of code only when its condition is <code>true</code>:
      </p>
      <p>
        <code>if (lives === 0) {"{"} gameOver = true; {"}"}</code>
      </p>
      <p>
        The condition goes in round brackets and the block in curly braces. Add <code>else</code> for what should
        happen otherwise. For several cases, chain them with <code>else if</code>. The computer checks each
        condition from the top, runs the <strong>first</strong> block whose condition is true, and skips all the
        rest, even if later conditions would also be true.
      </p>
      <p>
        Think of a series of doors, each with a test written on it. You try them in order and walk through the
        first one whose test you pass. The final <code>else</code> is the door with no test, for anyone left.
      </p>
      <p>Conditions can be combined:</p>
      <ul>
        <li>
          <code>a &amp;&amp; b</code>, read &quot;and&quot;, is true only when both are true.
        </li>
        <li>
          <code>a || b</code>, read &quot;or&quot;, is true when at least one is true.
        </li>
        <li>
          <code>!a</code>, read &quot;not&quot;, flips true to false and false to true.
        </li>
      </ul>
      <p>
        A condition is just a boolean expression, so you can store it in a well-named variable:{" "}
        <code>const canJump = onGround &amp;&amp; !paused;</code>. Code that reads like a sentence is easier to get
        right.
      </p>
    </>
  ),
  play: {
    diagrams: [<BranchExplorer key="branches" />],
    prompts: [
      "Set score to 95. Three conditions are true, but notice how many blocks run.",
      "Switch to lowest first and try 95 again. Explain to yourself why the result changes.",
      "Find the exact scores where the medal changes. Is 90 gold or silver?",
    ],
  },
  example: {
    intro: "Deciding what happens to a player who has just been hit.",
    code: [
      "let lives = 1;",
      "let shield = false;",
      "const paused = false;",
      "if (!paused && !shield) {",
      "  lives = lives - 1;",
      "}",
      "if (lives === 0) {",
      '  console.log("Game over");',
      "} else if (lives === 1) {",
      '  console.log("Last life");',
      "} else {",
      '  console.log("Keep going");',
      "}",
      "console.log(lives > 0 || shield);",
    ].join("\n"),
    predict: "Does the player lose a life? Which of the three messages is printed?",
    steps: [
      { lines: [0, 1, 2], text: "One life, no shield, not paused." },
      {
        lines: [3],
        text: "!paused is true and !shield is true, so true && true is true. The block runs.",
      },
      { lines: [4], text: "lives becomes 0." },
      { lines: [6, 7], text: "lives === 0 is now true, so Game over is printed." },
      { lines: [8, 10], text: "The rest of the chain is skipped completely. Its conditions are never checked." },
      { lines: [13], text: "lives > 0 is false and shield is false, so false || false is false." },
    ],
    output: ["Game over", "false"],
  },
  honest: (
    <>
      <p>
        <strong>Boundaries are where bugs live.</strong> Is a score of exactly 90 gold? With{" "}
        <code>&gt;=</code> it is; with <code>&gt;</code> it is not. When you write a condition, test the value
        right on the boundary as well as values either side.
      </p>
      <p>
        <strong>English does not translate directly.</strong> &quot;If x is more than 0 and less than 10&quot;
        must be written <code>x &gt; 0 &amp;&amp; x &lt; 10</code>. Writing <code>x &gt; 0 &amp;&amp; &lt; 10</code>{" "}
        is an error, because each side of <code>&amp;&amp;</code> must be a complete condition.
      </p>
      <p>
        <strong>One = in a condition is a mistake.</strong> <code>if (lives = 0)</code> stores 0 rather than
        comparing. TypeScript usually catches it, but it is worth knowing the shape of the bug.
      </p>
      <p>
        <strong>&amp;&amp; and || stop early.</strong> If the left side of <code>&amp;&amp;</code> is false, the right
        side is never even looked at. This rarely matters now, but it will when the right side does something.
      </p>
    </>
  ),
  build:
    "Practice will ask you to trace which branch runs for given values, find boundary bugs in grading and medal code, rewrite tangled conditions more clearly, and write the rules for a door that needs a key or a lever.",
};
