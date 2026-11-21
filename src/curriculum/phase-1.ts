import type { NodeSource } from "./types";

/** Phase 1: Programming and the game loop (weeks 1 to 9). */
export const PHASE_1_NODES: NodeSource[] = [
  {
    id: "1.01",
    title: "Programs and output",
    track: "programming",
    kind: "concept",
    goal: "Read a short program and predict what it prints",
    sessions: 2,
    prereqs: [],
    links: [
      { to: "1.08", note: "Predicting output first is how you will later notice that a program is wrong." },
    ],
    brief: {
      keyIdeas: [
        "A program is a list of statements run from top to bottom, one at a time",
        "console.log prints a value, and each call starts a new line of output",
        "Text in quotes is printed as written; code outside quotes is worked out first",
        "Comments are ignored when the program runs",
      ],
      misconceptions: [
        "Thinking the computer reads the whole program at once rather than line by line",
        "Expecting console.log(\"2 + 3\") to print 5",
        "Believing a commented-out line still runs",
      ],
      itemTypes: ["predict", "order", "find-bug", "write"],
      variationAxes: {
        context: ["a score readout", "a level title", "a countdown", "a player greeting", "a high-score table"],
        twist: ["text versus calculation", "line order", "a commented-out line", "several values in one call"],
        size: ["two lines", "four lines", "six lines"],
      },
    },
  },
  {
    id: "1.02",
    title: "Values and types",
    track: "programming",
    kind: "concept",
    goal: "Tell numbers, strings and booleans apart and predict how they combine",
    sessions: 2,
    prereqs: ["1.01"],
    links: [
      { to: "1.11", note: "TypeScript's types are a written-down version of the value kinds you meet here." },
    ],
    brief: {
      keyIdeas: [
        "Every value has a type: number, string or boolean for now",
        "Plus adds numbers but joins strings, and a string on either side wins",
        "typeof tells you the type of a value at run time",
        "true and false are values, not the strings \"true\" and \"false\"",
      ],
      misconceptions: [
        "Expecting \"5\" + 3 to give 8",
        "Treating \"false\" as the boolean false",
        "Thinking 0.1 + 0.2 is exactly 0.3",
      ],
      itemTypes: ["predict", "choice", "find-bug", "complete"],
      variationAxes: {
        context: ["a health bar label", "coins collected", "a paused flag", "a player name", "a level number"],
        operation: ["joining strings", "adding numbers", "mixing a string and a number", "typeof"],
        twist: ["a number stored as text", "a boolean in quotes", "decimal rounding"],
      },
    },
  },
  {
    id: "1.03",
    title: "Variables and state",
    track: "programming",
    kind: "concept",
    goal: "Store and change values, and trace how state changes line by line",
    sessions: 3,
    prereqs: ["1.02"],
    links: [
      { to: "1.13", note: "A game loop is a machine for changing state a little on every frame." },
    ],
    brief: {
      keyIdeas: [
        "A variable is a named box that holds one value at a time",
        "let can be reassigned and const cannot",
        "Assignment works out the right-hand side first, then stores it",
        "x = x + 1 and x += 1 both read the old value and store the new one",
      ],
      misconceptions: [
        "Reading = as a statement of equality rather than an instruction to store",
        "Thinking b = a links the two variables so that later changes to a affect b",
        "Believing const means the value can never change in any way",
      ],
      itemTypes: ["trace", "predict", "find-bug", "complete"],
      variationAxes: {
        context: ["a score", "lives left", "a timer", "an x position", "ammunition"],
        pattern: ["accumulate", "swap two values", "count down", "copy then change"],
        twist: ["reassigning a const", "using a variable before it is set", "shadowing a name"],
      },
    },
  },
  {
    id: "1.04",
    title: "Expressions and operators",
    track: "maths",
    kind: "concept",
    goal: "Evaluate arithmetic, comparison and remainder expressions, including precedence",
    sessions: 2,
    prereqs: ["1.03"],
    links: [
      { to: "2.01", note: "Vector arithmetic is ordinary arithmetic done once for x and once for y." },
    ],
    brief: {
      keyIdeas: [
        "Multiplication and division happen before addition and subtraction",
        "Brackets change the order of evaluation",
        "The remainder operator % gives what is left after division, useful for wrapping and cycles",
        "Comparisons produce booleans, and === compares without converting types",
      ],
      misconceptions: [
        "Working left to right and ignoring precedence",
        "Thinking 7 % 3 is a percentage",
        "Expecting a negative number % n to always be positive",
      ],
      itemTypes: ["numeric", "predict", "trace", "write"],
      variationAxes: {
        context: ["wrapping around the screen edge", "animation frame cycles", "damage after armour", "even and odd turns"],
        operator: ["precedence", "remainder", "comparison", "integer division with Math.floor"],
        twist: ["negative numbers", "a missing bracket", "== versus ==="],
      },
    },
  },
  {
    id: "1.05",
    title: "Conditionals and logic",
    track: "programming",
    kind: "concept",
    goal: "Branch with if and else and combine conditions with and, or, not",
    sessions: 3,
    prereqs: ["1.04"],
    links: [
      { to: "3.01", note: "A state machine is a disciplined way of organising many if statements." },
    ],
    brief: {
      keyIdeas: [
        "if runs a block only when its condition is true, and else covers the other case",
        "else if chains are checked in order and only the first true branch runs",
        "&& needs both sides true, || needs either, ! flips a boolean",
        "Conditions can be stored in well-named boolean variables",
      ],
      misconceptions: [
        "Expecting several branches of an else if chain to run",
        "Writing x > 0 && < 10 as if English and code read the same way",
        "Confusing = with === inside a condition",
      ],
      itemTypes: ["predict", "trace", "find-bug", "write"],
      variationAxes: {
        context: ["game over checks", "power-up rules", "grade boundaries for a score", "door and key logic"],
        structure: ["single if", "else if chain", "nested if", "combined condition"],
        twist: ["order of branches matters", "boundary values", "De Morgan's laws"],
      },
    },
  },
  {
    id: "1.06",
    title: "Loops",
    track: "programming",
    kind: "concept",
    goal: "Repeat work with for and while loops and know when a loop stops",
    sessions: 3,
    prereqs: ["1.05"],
    links: [
      { to: "1.13", note: "The game loop is a loop that never ends, paced by the screen." },
    ],
    brief: {
      keyIdeas: [
        "A for loop has a start, a condition checked before each pass, and a step",
        "A while loop repeats as long as its condition stays true",
        "Every loop needs something that eventually makes the condition false",
        "break leaves a loop early and continue skips to the next pass",
      ],
      misconceptions: [
        "Off-by-one errors with < versus <=",
        "Thinking the condition is checked only once",
        "Forgetting to change the loop variable, so the loop never ends",
      ],
      itemTypes: ["trace", "predict", "find-bug", "write"],
      variationAxes: {
        context: ["drawing a row of tiles", "counting down a launch", "summing points", "finding the first empty slot"],
        loop: ["for counting up", "for counting down", "while with a flag", "nested loops"],
        twist: ["off by one", "a step other than one", "break part way", "a loop that never runs"],
      },
    },
  },
  {
    id: "1.07",
    title: "Functions",
    track: "programming",
    kind: "concept",
    goal: "Write functions with parameters and return values, and understand scope",
    sessions: 3,
    prereqs: ["1.06"],
    links: [
      { to: "2.13", note: "Modules and classes are ways of grouping functions that belong together." },
    ],
    brief: {
      keyIdeas: [
        "A function packages steps under a name so they can be reused",
        "Parameters are local variables filled in by the arguments of each call",
        "return hands a value back and ends the function immediately",
        "Variables declared inside a function are not visible outside it",
      ],
      misconceptions: [
        "Confusing printing a value with returning it",
        "Expecting code after return to run",
        "Thinking changing a parameter changes the caller's variable",
      ],
      itemTypes: ["predict", "trace", "write", "complete", "find-bug"],
      variationAxes: {
        context: ["clamping a value", "scoring a hit", "converting seconds to a clock", "checking a win"],
        shape: ["no parameters", "one parameter", "several parameters", "a function calling another"],
        twist: ["missing return", "early return", "scope", "default parameter"],
      },
    },
  },
  {
    id: "1.08",
    title: "Reading errors and debugging",
    track: "programming",
    kind: "skill",
    goal: "Read an error message, find the line, form a guess and test it",
    sessions: 2,
    prereqs: ["1.07"],
    links: [
      { to: "6.04", note: "Tests are debugging done in advance, by writing down what should happen." },
      { to: "6.07", note: "Reading errors calmly is the first step in solving problems without a guide." },
    ],
    brief: {
      keyIdeas: [
        "An error message names a kind of problem, a description and a line number",
        "The reported line is where the problem was noticed, not always where it began",
        "Debugging is a loop: observe, guess, test the guess, repeat",
        "console.log of intermediate values shows what the program really holds",
      ],
      misconceptions: [
        "Changing code at random until the error disappears",
        "Assuming the line in the message is always the faulty line",
        "Ignoring the message text and reading only that something went wrong",
      ],
      itemTypes: ["find-bug", "fix", "explain", "choice"],
      variationAxes: {
        error: ["ReferenceError", "TypeError on undefined", "SyntaxError", "a wrong result with no error"],
        context: ["a score that never rises", "a shape that never moves", "a loop that never ends", "a misspelt name"],
        clue: ["the message alone", "the message and a log", "only the wrong output"],
      },
    },
  },
  {
    id: "1.09",
    title: "Arrays",
    track: "programming",
    kind: "concept",
    goal: "Hold lists of things, loop over them and change them",
    sessions: 3,
    prereqs: ["1.06"],
    links: [
      { to: "2.12", note: "Many entities is arrays of game objects, added and removed while the game runs." },
      { to: "3.06", note: "A tilemap is an array laid out as rows and columns." },
    ],
    brief: {
      keyIdeas: [
        "An array holds values in order, indexed from 0 to length minus 1",
        "push adds to the end; reading past the end gives undefined",
        "for and for...of loop over every element",
        "Arrays are shared by reference, so two names can point at one array",
      ],
      misconceptions: [
        "Expecting the first element at index 1",
        "Thinking arr[arr.length] is the last element",
        "Expecting const arrays to be unchangeable",
      ],
      itemTypes: ["trace", "predict", "write", "find-bug"],
      variationAxes: {
        context: ["an inventory", "high scores", "enemy positions", "a deck of cards"],
        operation: ["read by index", "sum or count", "find the largest", "filter into a new array"],
        twist: ["off by one", "shared reference", "empty array"],
      },
    },
  },
  {
    id: "1.10",
    title: "Objects",
    track: "programming",
    kind: "concept",
    goal: "Group related data, and model a game entity as an object",
    sessions: 2,
    prereqs: ["1.09"],
    links: [
      { to: "5.13", note: "Saving a game means turning its objects into text and back again." },
    ],
    brief: {
      keyIdeas: [
        "An object groups named properties that belong together",
        "Dot notation reads and writes a property",
        "Objects can hold arrays and arrays can hold objects",
        "Like arrays, objects are shared by reference",
      ],
      misconceptions: [
        "Expecting a missing property to cause an error rather than give undefined",
        "Thinking copying a variable copies the object",
        "Confusing the property name with the variable holding the value",
      ],
      itemTypes: ["predict", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["a player", "an enemy", "a pickup", "a level", "settings"],
        shape: ["flat object", "object with an array", "array of objects"],
        twist: ["shared reference", "misspelt property", "nested property"],
      },
    },
  },
  {
    id: "1.11",
    title: "TypeScript types",
    track: "programming",
    kind: "concept",
    goal: "Describe data with types and interfaces, and read type errors",
    sessions: 2,
    prereqs: ["1.10"],
    links: [
      { to: "3.01", note: "Union types let you list a state machine's states so a typo becomes an error." },
    ],
    brief: {
      keyIdeas: [
        "A type annotation says what kind of value a variable or parameter holds",
        "An interface describes the shape of an object",
        "Union types list the allowed values, such as \"idle\" | \"running\"",
        "Type errors are found before the code runs, and read like sentences",
      ],
      misconceptions: [
        "Thinking types change how the code behaves at run time",
        "Reading a type error as a crash rather than a warning about a mismatch",
        "Using any to silence errors instead of fixing the shape",
      ],
      itemTypes: ["choice", "find-bug", "fix", "write"],
      variationAxes: {
        context: ["a player interface", "a function signature", "game states", "a list of enemies"],
        feature: ["annotation", "interface", "union of literals", "optional property"],
        twist: ["missing property", "wrong type passed", "possibly undefined"],
      },
    },
  },
  {
    id: "1.12",
    title: "Canvas and coordinates",
    track: "systems",
    kind: "concept",
    goal: "Draw shapes and colours, knowing that y grows downwards",
    sessions: 2,
    prereqs: ["1.04"],
    links: [
      { to: "2.02", note: "Screen coordinates become one of several coordinate systems in a game." },
    ],
    brief: {
      keyIdeas: [
        "The canvas is a grid of pixels with (0, 0) at the top left",
        "x grows to the right and y grows downwards",
        "fillRect, arc and fillStyle draw shapes in a chosen colour",
        "Later drawing covers earlier drawing",
      ],
      misconceptions: [
        "Expecting y to grow upwards as in school graphs",
        "Thinking a rectangle's x and y are its centre",
        "Expecting a shape to move by itself after it is drawn",
      ],
      itemTypes: ["predict", "preview", "numeric", "find-bug"],
      variationAxes: {
        context: ["a flag", "a simple house", "a target", "a grid of tiles", "a ground strip"],
        skill: ["placing by corner", "centring", "layer order", "positions computed in a loop"],
        twist: ["y downwards", "canvas size changes", "negative positions"],
      },
    },
  },
  {
    id: "1.13",
    title: "The game loop",
    track: "systems",
    kind: "concept",
    goal: "Run update then draw every frame with requestAnimationFrame",
    sessions: 3,
    prereqs: ["1.07", "1.12"],
    links: [
      { to: "2.08", note: "A fixed timestep separates how often you simulate from how often you draw." },
      { to: "5.08", note: "Profiling asks how long each part of one loop pass takes." },
    ],
    brief: {
      keyIdeas: [
        "A game redraws the whole screen many times a second",
        "Each frame: update the state, clear the canvas, then draw the state",
        "requestAnimationFrame calls your function before the next screen refresh",
        "State lives outside the loop so it survives between frames",
      ],
      misconceptions: [
        "Forgetting to clear, so moving shapes leave trails",
        "Declaring state inside the frame function, so it resets every frame",
        "Using a while loop that freezes the page instead of scheduling frames",
      ],
      itemTypes: ["predict", "preview", "find-bug", "order"],
      variationAxes: {
        context: ["a bouncing ball", "a moving cloud", "a blinking light", "a growing circle"],
        part: ["update", "draw", "clearing", "scheduling the next frame"],
        twist: ["state reset each frame", "no clear", "two loops started"],
      },
    },
  },
  {
    id: "1.14",
    title: "Time and delta time",
    track: "systems",
    kind: "concept",
    goal: "Make movement the same speed on fast and slow devices",
    sessions: 2,
    prereqs: ["1.13"],
    links: [
      { to: "2.05", note: "Velocity times delta time is the first step of a physics simulation." },
    ],
    brief: {
      keyIdeas: [
        "Frame rates differ between devices, from 30 to 120 frames a second or more",
        "Delta time is the time since the last frame, usually in seconds",
        "Speed in pixels per second times delta time gives the distance this frame",
        "Long pauses, such as a hidden tab, need delta time to be capped",
      ],
      misconceptions: [
        "Moving a fixed number of pixels per frame and expecting the same speed everywhere",
        "Mixing milliseconds and seconds",
        "Not capping delta time, so objects jump after a pause",
      ],
      itemTypes: ["numeric", "predict", "fix", "preview"],
      variationAxes: {
        context: ["a falling raindrop", "a scrolling background", "a countdown timer", "a rotating fan"],
        frameRate: ["30 frames a second", "60 frames a second", "120 frames a second", "a stutter"],
        twist: ["milliseconds versus seconds", "a long pause", "speed per frame"],
      },
    },
  },
  {
    id: "1.15",
    title: "Keyboard input",
    track: "systems",
    kind: "concept",
    goal: "Track which keys are held and move a shape with them",
    sessions: 2,
    prereqs: ["1.10", "1.13"],
    links: [
      { to: "2.10", note: "Input as actions puts keys, mouse and touch behind one set of names." },
    ],
    brief: {
      keyIdeas: [
        "keydown and keyup events fire when a key changes state",
        "Store held keys in an object or set, and read it during update",
        "Movement belongs in update, not in the event handler",
        "event.key and event.code name keys differently",
      ],
      misconceptions: [
        "Moving the player inside keydown, which repeats slowly and unevenly",
        "Forgetting keyup, so the player never stops",
        "Expecting two opposite keys to cancel out without code to do it",
      ],
      itemTypes: ["predict", "find-bug", "preview", "complete"],
      variationAxes: {
        context: ["a paddle", "a car", "a cursor on a grid", "a spaceship"],
        keys: ["arrow keys", "WASD", "a single action key"],
        twist: ["no keyup", "movement in the handler", "opposite keys at once"],
      },
    },
  },
  {
    id: "1.16",
    title: "Randomness basics",
    track: "maths",
    kind: "concept",
    goal: "Produce random numbers and integers in a chosen range",
    sessions: 2,
    prereqs: ["1.04"],
    links: [
      { to: "4.10", note: "Probability explains what happens when random choices pile up." },
    ],
    brief: {
      keyIdeas: [
        "Math.random gives a number from 0 up to but not including 1",
        "Scale and shift to get a range: min + Math.random() * (max - min)",
        "Math.floor turns it into a whole number in a chosen range",
        "Random picks from an array use a random index",
      ],
      misconceptions: [
        "Thinking Math.random can return exactly 1",
        "Using Math.round and getting the end values half as often",
        "Expecting random results to look evenly spread in small samples",
      ],
      itemTypes: ["numeric", "choice", "find-bug", "write"],
      variationAxes: {
        context: ["spawn positions", "dice rolls", "random colours", "enemy delays"],
        range: ["decimal range", "inclusive integers", "a random array element", "a coin flip"],
        twist: ["Math.round bias", "off-by-one maximum", "negative ranges"],
      },
    },
  },
  {
    id: "1.17",
    title: "Overlapping rectangles",
    track: "maths",
    kind: "concept",
    goal: "Test whether two rectangles overlap, one axis at a time",
    sessions: 2,
    prereqs: ["1.05", "1.12"],
    links: [
      { to: "2.07", note: "Circles and boxes extend the same idea to other shapes." },
    ],
    brief: {
      keyIdeas: [
        "Two rectangles overlap only if they overlap on the x axis and on the y axis",
        "On one axis, ranges overlap when each starts before the other ends",
        "Axis-aligned boxes are stored as x, y, width and height",
        "Touching edges count or not depending on < versus <=",
      ],
      misconceptions: [
        "Checking only whether a corner is inside the other rectangle",
        "Forgetting that y grows downwards when reasoning about top and bottom",
        "Using || where && is needed",
      ],
      itemTypes: ["numeric", "choice", "write", "find-bug"],
      variationAxes: {
        context: ["player and raindrop", "bullet and wall", "mouse and button", "two crates"],
        case: ["clear overlap", "separate on x only", "separate on y only", "touching edges", "one inside the other"],
        representation: ["numbers", "a drawing", "code"],
      },
    },
  },
  {
    id: "1.18",
    title: "Game: Rainfall",
    track: "design",
    kind: "project",
    goal: "Build a one-screen dodging game with score, rising speed, game over and restart",
    sessions: 10,
    prereqs: [
      "1.01", "1.02", "1.03", "1.04", "1.05", "1.06", "1.07", "1.08", "1.09",
      "1.10", "1.11", "1.12", "1.13", "1.14", "1.15", "1.16", "1.17",
    ],
    links: [
      { to: "3.01", note: "Rainfall's playing and game-over modes are your first informal state machine." },
    ],
    brief: {
      keyIdeas: [
        "A complete game is a loop, a player, hazards, a score and a way to lose and restart",
        "Difficulty that rises over time keeps a simple game interesting",
        "Small, testable milestones make a game manageable",
      ],
      misconceptions: [
        "Building everything at once and debugging it all together",
        "Forgetting to reset every piece of state on restart",
      ],
      itemTypes: ["milestone", "find-bug", "preview"],
      variationAxes: {
        milestone: ["player movement", "falling drops", "collision", "score", "speed curve", "game over and restart"],
      },
    },
  },
];
