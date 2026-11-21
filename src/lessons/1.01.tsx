import { OutputTrace } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.01",
  problem: (
    <>
      <p>
        Every game you have ever played is, underneath, a list of instructions. When a score ticks up or a
        title appears, some line of code asked for it. Right now you cannot ask a computer for anything,
        and you cannot tell what a line of code will do before it runs.
      </p>
      <p>
        By the end of this lesson you will be able to read a short program, say exactly what it will print
        before you run it, and then check yourself.
      </p>
    </>
  ),
  comesFrom: {},
  idea: (
    <>
      <p>
        A <strong>program</strong> is a list of statements. The computer runs them one at a time, from the top
        down, and finishes each one before starting the next. It does not read ahead, guess what you meant or
        skip lines it finds dull.
      </p>
      <p>
        Think of a recipe followed by someone who is very fast and completely literal. They do step one, then
        step two, exactly as written. If step three says to add salt twice, they add salt twice.
      </p>
      <p>
        The first instruction you will use is <code>console.log</code>. It prints whatever you put between its
        brackets to the output, and each call starts a new line. What goes inside matters:
      </p>
      <ul>
        <li>
          Text inside quotes, such as <code>&quot;Rainfall&quot;</code>, is a <strong>string</strong>. It is
          printed exactly as written, without the quotes.
        </li>
        <li>
          Anything outside quotes, such as <code>2 + 3</code>, is worked out first, and the result is printed.
        </li>
        <li>
          Several values separated by commas are printed on one line with a space between each.
        </li>
        <li>
          A line starting with <code>{"//"}</code> is a <strong>comment</strong>: a note for people. The computer
          skips it completely.
        </li>
      </ul>
      <p>
        The precise version: a JavaScript program is a sequence of statements, usually one per line and ended by
        a semicolon, executed in order. <code>console.log(a, b)</code> converts each value to text, joins them
        with single spaces and writes the result as one line of output.
      </p>
    </>
  ),
  play: {
    diagrams: [<OutputTrace key="trace" />],
    prompts: [
      "Before each Next, commit to what will appear. The surprise, if there is one, is where you learn.",
      "Notice which line produces no output at all, and why.",
      "Compare the last two lines. They differ only by a pair of quotes.",
    ],
  },
  example: {
    intro: "A title screen that prints a few lines. Read it top to bottom as the computer would.",
    code: [
      'console.log("RAINFALL");',
      'console.log("Dodge the drops");',
      "// The best score so far is 40",
      'console.log("Best:", 40);',
      'console.log("Lives:", 1 + 2);',
      'console.log("1 + 2");',
    ].join("\n"),
    predict: "Write down the output, line by line, before you reveal it. How many lines will there be?",
    steps: [
      { lines: [0, 1], text: "The first two lines print their strings exactly, each on its own line." },
      { lines: [2], text: "This is a comment. It is skipped, so it prints nothing, even though it mentions a score." },
      { lines: [3], text: "Two values: a string and a number. They are printed on one line, joined by a space." },
      { lines: [4], text: "1 + 2 is outside quotes, so it is worked out first. The line prints Lives: 3." },
      { lines: [5], text: "The same characters inside quotes are just text, so they are printed unchanged." },
    ],
    output: ["RAINFALL", "Dodge the drops", "Best: 40", "Lives: 3", "1 + 2"],
  },
  honest: (
    <>
      <p>
        <strong>Top to bottom is true for now.</strong> Very soon you will meet code that jumps: conditions
        that skip lines and loops that repeat them. Even then, the computer only ever does one thing at a
        time, and knowing which line it is on is the key to understanding any program.
      </p>
      <p>
        <strong>Where you see output varies.</strong> In Frame, output appears in a panel beside your code. In a
        web browser it goes to the developer console, which you open with a keyboard shortcut. The idea is the
        same.
      </p>
      <p>
        <strong>Small details matter.</strong> Forgetting a closing quote or bracket stops the whole program
        before it starts. That feels harsh at first. Reading those error messages calmly is a skill of its own,
        and it has its own lesson soon.
      </p>
    </>
  ),
  build:
    "Practice will ask you to predict the output of short programs, put scrambled lines in the right order to produce a given output, and write a few lines of your own that print a game's title screen.",
};
