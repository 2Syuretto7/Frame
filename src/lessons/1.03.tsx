import { StateTrace } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.03",
  problem: (
    <>
      <p>
        A game has to remember things: the score, the lives left, where the player stands. These change all
        the time. So far your programs could only print values that were written into the code. They had no
        memory at all.
      </p>
      <p>
        In this lesson you give your program memory, and learn to follow exactly what it holds after every
        line. That skill, tracing state, is how you will understand every game you write.
      </p>
    </>
  ),
  comesFrom: {
    "1.02":
      "Every value has a type: number, string or boolean. + adds numbers but joins strings, and === is true only when type and value are both the same.",
  },
  idea: (
    <>
      <p>
        A <strong>variable</strong> is a named box that holds one value at a time. You make one with{" "}
        <code>let</code>, give it a name and put a value in: <code>let score = 0;</code>. After that, writing{" "}
        <code>score</code> anywhere means &quot;whatever is in the box right now&quot;.
      </p>
      <p>
        The <code>=</code> sign does not mean &quot;is equal to&quot; as it does in maths. It is an instruction:
        work out the right-hand side, then put the result in the box on the left. That is why{" "}
        <code>score = score + 10;</code> makes sense. The computer reads the old score, adds 10, and stores the
        answer back in the same box. <code>score += 10;</code> is a shorter way to write the same thing.
      </p>
      <p>
        Writing <code>let best = score;</code> copies the value that is in <code>score</code> at that moment into a
        new box. The two boxes are not connected. If <code>score</code> changes later, <code>best</code> does not.
      </p>
      <p>
        Use <code>const</code> instead of <code>let</code> for a box that should never be refilled, such as{" "}
        <code>const maxLives = 3;</code>. Trying to assign to it again is an error, which protects you from
        changing it by accident.
      </p>
      <p>
        The collection of all values held at one moment is the program&apos;s <strong>state</strong>. A game is
        mostly a machine for changing its state a little at a time and showing it.
      </p>
    </>
  ),
  play: {
    diagrams: [<StateTrace key="state" />],
    prompts: [
      "At line 3, notice that the right-hand side uses the old value of score before the new one is stored.",
      "Watch best after line 7. It holds a copy, so it keeps 20 when score changes.",
    ],
  },
  example: {
    intro: "A small round of a game: points are scored, a life is lost, and the high score is recorded.",
    code: [
      "const maxLives = 3;",
      "let lives = maxLives;",
      "let score = 0;",
      "score += 50;",
      "lives = lives - 1;",
      "score = score * 2;",
      "let highScore = score;",
      "score = 0;",
      'console.log("Lives:", lives, "of", maxLives);',
      'console.log("Score:", score, "Best:", highScore);',
    ].join("\n"),
    predict: "What are lives, score and highScore just before the last two lines run?",
    steps: [
      { lines: [0, 1], text: "maxLives is a const, 3. lives starts as a copy of it, also 3." },
      { lines: [2, 3], text: "score starts at 0. score += 50 reads 0, adds 50 and stores 50." },
      { lines: [4], text: "lives becomes 3 - 1, which is 2. maxLives is untouched." },
      { lines: [5], text: "score is doubled: 50 * 2 is 100." },
      { lines: [6, 7], text: "highScore copies 100. Then score is reset to 0, and highScore still holds 100." },
      { lines: [8, 9], text: "The two lines print the final state." },
    ],
    output: ["Lives: 2 of 3", "Score: 0 Best: 100"],
  },
  honest: (
    <>
      <p>
        <strong>The box picture is right for numbers, strings and booleans.</strong> When you meet arrays and
        objects, copying works differently: two names can end up sharing one thing. The lesson on arrays shows
        exactly when, and why.
      </p>
      <p>
        <strong>const is about the box, not the contents.</strong> For the simple values here, it means the
        value never changes. For arrays and objects it only means the box always holds the same one, which can
        still be changed inside.
      </p>
      <p>
        <strong>You may see var in older code.</strong> It is an older way of making variables, with
        surprising rules about where the name is visible. Use <code>let</code> and <code>const</code>.
      </p>
    </>
  ),
  build:
    "Practice will ask you to fill in tables of variables line by line, predict the final state of short programs, find the line that makes a score wrong, and write the lines that update a player's health after a hit and a heal.",
};
