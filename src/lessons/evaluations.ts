/**
 * Expressions for the 1.04 diagram, reduced one operation at a time. `part` is the
 * piece of the current expression worked out next and `result` is the whole
 * expression afterwards. A unit test checks every result has the same value.
 */
export interface Reduction {
  part: string;
  result: string;
  why: string;
}

export interface Evaluation {
  expression: string;
  steps: Reduction[];
}

export const EVALUATIONS: Evaluation[] = [
  {
    expression: "2 + 3 * 4",
    steps: [
      { part: "3 * 4", result: "2 + 12", why: "Multiplication comes before addition, so 3 * 4 is worked out first." },
      { part: "2 + 12", result: "14", why: "Only the addition is left." },
    ],
  },
  {
    expression: "(2 + 3) * 4",
    steps: [
      { part: "(2 + 3)", result: "5 * 4", why: "Brackets are worked out before anything else." },
      { part: "5 * 4", result: "20", why: "Then the multiplication." },
    ],
  },
  {
    expression: "10 - 4 - 3",
    steps: [
      { part: "10 - 4", result: "6 - 3", why: "Subtraction has equal precedence with itself, so it goes left to right: 10 - 4 first." },
      { part: "6 - 3", result: "3", why: "Then the remaining subtraction. Right to left would have given 10 - 1, which is 9." },
    ],
  },
  {
    expression: "7 + 10 % 4 * 2",
    steps: [
      { part: "10 % 4", result: "7 + 2 * 2", why: "% has the same precedence as * and /, and it is further left, so it goes first. 10 % 4 is 2." },
      { part: "2 * 2", result: "7 + 4", why: "Next the multiplication." },
      { part: "7 + 4", result: "11", why: "Addition comes last." },
    ],
  },
  {
    expression: "5 + 3 > 2 * 4",
    steps: [
      { part: "5 + 3", result: "8 > 2 * 4", why: "Arithmetic comes before comparison. Left to right, 5 + 3 first." },
      { part: "2 * 4", result: "8 > 8", why: "Then 2 * 4." },
      { part: "8 > 8", result: "false", why: "Finally the comparison. 8 is not greater than 8, so the result is the boolean false." },
    ],
  },
];
