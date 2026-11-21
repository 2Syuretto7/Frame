import { TypeMixer } from "@/components/diagram/lessons";
import type { Lesson } from "./types";

export const lesson: Lesson = {
  id: "1.02",
  problem: (
    <>
      <p>
        A game shows <code>Coins: 5</code> on screen. You pick up three more coins and add 3 to the total, but
        the screen now says <code>Coins: 53</code>. Nothing crashed, and yet the game is plainly wrong.
      </p>
      <p>
        The cause is that the computer was holding the coins as text, not as a number. To avoid bugs like this
        you need to know what kinds of value exist and what happens when two of them meet.
      </p>
    </>
  ),
  comesFrom: {
    "1.01":
      "A program runs one statement at a time, top to bottom, and console.log prints values. Text in quotes is printed as written; anything outside quotes is worked out first.",
  },
  idea: (
    <>
      <p>
        Every value has a <strong>type</strong>, which says what kind of thing it is and what you can do with
        it. Three types cover most of what you will need for now:
      </p>
      <ul>
        <li>
          <strong>number</strong>: <code>5</code>, <code>-12</code>, <code>2.5</code>. Whole numbers and
          decimals are the same type.
        </li>
        <li>
          <strong>string</strong>: text in quotes, such as <code>&quot;Rain&quot;</code> or{" "}
          <code>&quot;5&quot;</code>. The quotes make it a string, even if what is inside looks like a number.
        </li>
        <li>
          <strong>boolean</strong>: exactly two values, <code>true</code> and <code>false</code>, written without
          quotes. They answer yes-or-no questions such as &quot;is the game paused?&quot;.
        </li>
      </ul>
      <p>
        Types matter most when values combine. The <code>+</code> sign does two different jobs. With two
        numbers it adds. If either side is a string, it <strong>joins</strong> the two as text, turning the
        other side into text first. So <code>5 + 3</code> is <code>8</code>, but{" "}
        <code>&quot;5&quot; + 3</code> is <code>&quot;53&quot;</code>.
      </p>
      <p>
        An analogy: a number is an amount of something, while a string is a label with writing on it. Adding
        two amounts gives a bigger amount. Putting a label next to anything just gives a longer label.
      </p>
      <p>
        You can ask any value for its type with <code>typeof</code>. <code>typeof 5</code> is{" "}
        <code>&quot;number&quot;</code> and <code>typeof &quot;5&quot;</code> is <code>&quot;string&quot;</code>.
        To compare two values strictly, use <code>===</code>: it is <code>true</code> only when both the type
        and the value are the same.
      </p>
    </>
  ),
  play: {
    diagrams: [<TypeMixer key="mixer" />],
    prompts: [
      'Try 5 + "3" and then 5 + 3. Notice that one quote mark changes the type of the whole answer.',
      "Try true + 3. Then try true === 1. One converts and the other never does.",
      '"5" === 5 looks as if it should be true. Check it, then explain the result to yourself in one sentence.',
    ],
  },
  example: {
    intro: "A score readout that goes wrong, then right. Predict each line before revealing.",
    code: [
      'console.log("Coins: " + 5);',
      'console.log("5" + 3);',
      "console.log(5 + 3);",
      'console.log(typeof "5", typeof 5);',
      'console.log(1 + 2 + "3");',
      'console.log("1" + 2 + 3);',
      "console.log(0.1 + 0.2);",
    ].join("\n"),
    predict: "Lines 5 and 6 use the same three values in a different order. Do they print the same thing?",
    steps: [
      { lines: [0], text: "A string joined with a number gives a string. This is how you label a value on screen." },
      { lines: [1, 2], text: '"5" + 3 joins to "53". Only 5 + 3, with no quotes, adds to 8.' },
      { lines: [3], text: "typeof gives the type's name as a string. console.log prints both names on one line." },
      {
        lines: [4],
        text: "+ works left to right. 1 + 2 is 3, a number. Then 3 + \"3\" meets a string, so it joins: \"33\".",
      },
      {
        lines: [5],
        text: '"1" + 2 is already a string, "12". From then on every + joins, giving "123".',
      },
      {
        lines: [6],
        text: "Computers store most decimals as close approximations, so 0.1 + 0.2 is very slightly more than 0.3.",
      },
    ],
    output: ["Coins: 5", "53", "8", "string number", "33", "123", "0.30000000000000004"],
  },
  honest: (
    <>
      <p>
        <strong>JavaScript converts types quietly.</strong> Many languages would refuse to add a string to a
        number. JavaScript makes a guess instead, which is convenient for labels and a common source of bugs.
        TypeScript, which you meet in a few weeks, catches many of these mistakes before the code runs.
      </p>
      <p>
        <strong>Decimal maths is not exact.</strong> <code>0.1 + 0.2</code> really is{" "}
        <code>0.30000000000000004</code>. This is true in almost every programming language, not just
        JavaScript. For games it rarely matters, but it means you should avoid checking decimals with{" "}
        <code>===</code>.
      </p>
      <p>
        <strong>There are more types.</strong> You will meet <code>undefined</code>, arrays and objects soon.
        The three here are the building blocks the others are made from.
      </p>
    </>
  ),
  build:
    "Practice will ask you to predict what combinations of values produce and what type they have, find the bug in a broken score display, and complete a line that builds a label such as Level 3 of 10 from numbers.",
};
