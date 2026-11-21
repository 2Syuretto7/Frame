import type { NodeSource } from "./types";

/** Phase 6: Tools, shipping and independence (weeks 46 to 52). */
export const PHASE_6_NODES: NodeSource[] = [
  {
    id: "6.01",
    title: "Data-driven design",
    track: "programming",
    kind: "concept",
    goal: "Move levels and tuning values into data files and reload them live",
    sessions: 2,
    prereqs: ["3.06", "5.13"],
    links: [],
    brief: {
      keyIdeas: [
        "Code describes how things work; data describes what exists and how strong it is",
        "Data files can be changed without touching code",
        "Validate data when it loads, with clear messages",
        "Live reload shortens the change and test cycle",
      ],
      misconceptions: [
        "Putting logic into data until it becomes a second programming language",
        "Trusting data files without checking them",
        "Keeping two copies of the same number in code and data",
      ],
      itemTypes: ["find-bug", "write", "explain", "choice"],
      variationAxes: {
        context: ["enemy stats", "level layouts", "weapon tuning", "dialogue"],
        task: ["extract to data", "validate", "reload", "default values"],
        twist: ["typo in a key", "missing field", "logic in data"],
      },
    },
  },
  {
    id: "6.02",
    title: "Building a level editor",
    track: "systems",
    kind: "skill",
    goal: "Build a grid editor with painting, selection and undo through commands",
    sessions: 3,
    prereqs: ["5.04", "6.01"],
    links: [],
    brief: {
      keyIdeas: [
        "An editor reads and writes the same data format the game loads",
        "Each change is a command object that can do and undo",
        "Undo and redo are two stacks of commands",
        "Tools are states with their own pointer handling",
      ],
      misconceptions: [
        "Implementing undo by copying the whole level every change",
        "Clearing the redo stack at the wrong time",
        "Recording one command per pixel of a drag",
      ],
      itemTypes: ["trace", "write", "find-bug", "explain"],
      variationAxes: {
        context: ["painting tiles", "placing enemies", "a fill tool", "moving a selection"],
        part: ["command", "undo stack", "redo stack", "tool state"],
        twist: ["drag merges", "redo after a new change", "save and reload"],
      },
    },
  },
  {
    id: "6.03",
    title: "Debug tools",
    track: "systems",
    kind: "skill",
    goal: "Add overlays, slow motion, frame stepping and an in-game console",
    sessions: 2,
    prereqs: ["2.08", "5.08"],
    links: [],
    brief: {
      keyIdeas: [
        "Overlays draw hidden information such as hit boxes, paths and frame time",
        "Slow motion scales the time step, not the frame rate",
        "Frame stepping runs exactly one update on demand",
        "A console lets you change values while the game runs",
      ],
      misconceptions: [
        "Leaving debug drawing on in a release build",
        "Slowing the game by skipping frames instead of scaling time",
        "Debug code that changes the game's behaviour",
      ],
      itemTypes: ["write", "find-bug", "explain", "preview"],
      variationAxes: {
        context: ["collision boxes", "pathfinding nodes", "an enemy's state", "frame time"],
        tool: ["overlay", "slow motion", "frame step", "console"],
        twist: ["release build", "time scale", "side effects"],
      },
    },
  },
  {
    id: "6.04",
    title: "Testing game logic",
    track: "programming",
    kind: "skill",
    goal: "Write unit tests for pure functions and reproducible simulations with seeds",
    sessions: 2,
    prereqs: ["1.07", "4.11"],
    links: [],
    brief: {
      keyIdeas: [
        "Pure functions give the same output for the same input and are easy to test",
        "A test arranges inputs, acts, then asserts the result",
        "Seeded randomness makes a whole simulation repeatable",
        "Test the rules, not the drawing",
      ],
      misconceptions: [
        "Testing only the happy path",
        "Tests that depend on the clock or unseeded randomness",
        "Thinking tests prove the game is fun",
      ],
      itemTypes: ["write", "find-bug", "choice", "explain"],
      variationAxes: {
        context: ["damage calculation", "inventory rules", "a level generator", "score combos"],
        test: ["edge case", "seeded simulation", "regression test"],
        twist: ["flaky test", "impure function", "missing edge case"],
      },
    },
  },
  {
    id: "6.05",
    title: "Building and releasing",
    track: "programming",
    kind: "skill",
    goal: "Make a production build, keep downloads small, and publish on itch.io as a playable web game",
    sessions: 2,
    prereqs: ["3.14"],
    links: [
      { to: "6.09", note: "Your capstone is released the same way." },
    ],
    brief: {
      keyIdeas: [
        "A production build bundles and shrinks your code",
        "Assets are often most of the size, so measure them",
        "itch.io hosts a web game as a zip with index.html at its root",
        "Test the released build, not only the development server",
      ],
      misconceptions: [
        "Uploading the development folder",
        "Absolute paths that break on the host",
        "Never testing on a phone before release",
      ],
      itemTypes: ["order", "find-bug", "choice", "explain"],
      variationAxes: {
        context: ["first release", "an update", "a broken asset path", "a large download"],
        step: ["build", "measure", "package", "upload and test"],
        twist: ["absolute paths", "missing file", "cache of an old version"],
      },
    },
  },
  {
    id: "6.06",
    title: "Scoping a game",
    track: "design",
    kind: "skill",
    goal: "Plan a vertical slice, cut scope and set milestones you can keep",
    sessions: 2,
    prereqs: ["5.01", "5.03"],
    links: [
      { to: "6.09", note: "The capstone's plan comes from this node." },
    ],
    brief: {
      keyIdeas: [
        "A vertical slice is a small part of the game at finished quality",
        "List features, then cut until the core loop alone fits the time",
        "Milestones should end with something playable",
        "Estimates are usually low, so plan a buffer",
      ],
      misconceptions: [
        "Planning the whole game before playing any of it",
        "Treating cut features as failure",
        "Milestones that end with nothing to play",
      ],
      itemTypes: ["choice", "order", "explain"],
      variationAxes: {
        context: ["a four-week game", "a game jam", "an ambitious idea", "a sequel to an earlier game"],
        task: ["cut features", "order milestones", "estimate"],
        twist: ["feature creep", "missing buffer", "no playable milestone"],
      },
    },
  },
  {
    id: "6.07",
    title: "Learning on your own",
    track: "design",
    kind: "skill",
    goal: "Solve unfamiliar problems from documentation, reference pages and source code",
    sessions: 2,
    prereqs: ["1.08"],
    links: [],
    brief: {
      keyIdeas: [
        "State the problem precisely before searching",
        "Reference documentation answers what something does; guides answer how",
        "A tiny experiment settles a question faster than reading more",
        "Reading other people's source code is a skill that grows with practice",
      ],
      misconceptions: [
        "Copying code you do not understand",
        "Trusting the first search result",
        "Reading everything before trying anything",
      ],
      itemTypes: ["choice", "explain", "order"],
      variationAxes: {
        context: ["an unfamiliar browser API", "a library's options", "an error message", "a technique from a talk"],
        source: ["reference page", "guide", "source code", "an experiment"],
        twist: ["outdated answer", "wrong version", "half-understood snippet"],
      },
    },
  },
  {
    id: "6.08",
    title: "Bridge to Godot (optional)",
    track: "systems",
    kind: "skill",
    goal: "Map scenes, events, physics and components onto Godot's nodes, signals and bodies, and rebuild a small earlier game in it",
    sessions: 6,
    prereqs: ["3.02", "3.10", "4.03", "5.10"],
    links: [
      { to: "6.09", note: "You may choose Godot for the capstone." },
    ],
    brief: {
      keyIdeas: [
        "Godot's scene tree is scenes made of nodes, as your scenes held entities",
        "Signals are events",
        "Physics bodies are the collision code you wrote, done for you",
        "GDScript reads like the TypeScript you know, with indentation",
      ],
      misconceptions: [
        "Expecting the engine to remove the need to understand the ideas",
        "Fighting the engine's way of organising a game",
        "Rewriting systems the engine already provides",
      ],
      itemTypes: ["choice", "explain", "milestone"],
      variationAxes: {
        context: ["Rainfall in Godot", "a scene tree for Lantern", "Drift's drones as nodes"],
        mapping: ["scenes", "signals", "physics bodies", "components"],
        task: ["map an idea", "rebuild a feature"],
      },
    },
  },
  {
    id: "6.09",
    title: "Capstone: your own game",
    track: "design",
    kind: "project",
    goal: "Design, scope, build and publish your own game in about four weeks, with a short written post-mortem",
    sessions: 18,
    prereqs: ["5.14", "6.01", "6.02", "6.03", "6.04", "6.05", "6.06", "6.07"],
    links: [],
    brief: {
      keyIdeas: [
        "You choose the idea, the scope and the tools",
        "A vertical slice first, then content and polish",
        "Release, then write what went well and what you would change",
      ],
      misconceptions: [
        "Starting with the largest idea",
        "Waiting for perfection before releasing",
      ],
      itemTypes: ["milestone"],
      variationAxes: {
        milestone: ["pitch and scope", "vertical slice", "content", "polish", "release", "post-mortem"],
      },
    },
  },
];
