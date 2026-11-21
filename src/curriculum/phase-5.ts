import type { NodeSource } from "./types";

/** Phase 5: Design, interfaces, polish and performance (weeks 37 to 45). */
export const PHASE_5_NODES: NodeSource[] = [
  {
    id: "5.01",
    title: "Game design fundamentals",
    track: "design",
    kind: "concept",
    goal: "Describe a game as goals, rules, a core loop and feedback, and critique your own earlier games",
    sessions: 2,
    prereqs: ["1.18"],
    links: [
      { to: "6.06", note: "Scoping starts from knowing which loop is the core of your game." },
    ],
    brief: {
      keyIdeas: [
        "Goals, rules, a core loop and feedback make up a game",
        "The core loop is the action you repeat most, and it must be satisfying alone",
        "Meaningful choices have trade-offs the player can understand",
        "Feedback tells the player what happened and why",
      ],
      misconceptions: [
        "Thinking more features make a better game",
        "Confusing theme and story with mechanics",
        "Believing a choice is meaningful when one option is always best",
      ],
      itemTypes: ["choice", "explain", "order"],
      variationAxes: {
        context: ["Rainfall", "Drift", "Lantern", "Undercroft", "a well-known genre"],
        lens: ["goals", "rules", "core loop", "feedback", "choices"],
        task: ["identify", "critique", "propose a change"],
      },
    },
  },
  {
    id: "5.02",
    title: "Level design",
    track: "design",
    kind: "concept",
    goal: "Teach a mechanic through a level: introduce, practise, twist, and pace the sequence",
    sessions: 2,
    prereqs: ["3.06", "5.01"],
    links: [
      { to: "6.02", note: "A level editor speeds up the build, test and change cycle." },
    ],
    brief: {
      keyIdeas: [
        "Introduce a mechanic safely, let the player practise, then add a twist",
        "Pacing alternates tension and rest",
        "Sight lines and landmarks guide the player without words",
        "Every level should have one clear idea",
      ],
      misconceptions: [
        "Teaching with text instead of with the level",
        "Raising difficulty steadily with no rest",
        "Putting every mechanic into the first level",
      ],
      itemTypes: ["choice", "order", "explain"],
      variationAxes: {
        context: ["a platformer", "a puzzle game", "a dungeon", "a top-down shooter"],
        stage: ["introduce", "practise", "twist", "test"],
        task: ["order levels", "spot the problem", "sketch a sequence"],
      },
    },
  },
  {
    id: "5.03",
    title: "Playtesting and iteration",
    track: "design",
    kind: "skill",
    goal: "Run a playtest, observe without helping, and turn notes into changes",
    sessions: 2,
    prereqs: ["5.01"],
    links: [
      { to: "6.06", note: "Playtests tell you what to cut." },
    ],
    brief: {
      keyIdeas: [
        "Watch what players do, not only what they say",
        "Do not explain or help during the test",
        "Separate observations from your interpretation",
        "Change one thing, then test again",
      ],
      misconceptions: [
        "Treating player suggestions as the solution rather than a symptom",
        "Testing only with yourself",
        "Fixing everything at once so you cannot tell what helped",
      ],
      itemTypes: ["choice", "order", "explain"],
      variationAxes: {
        context: ["a confusing tutorial", "a difficulty spike", "an unnoticed key", "a lost player"],
        task: ["write questions", "sort observations", "choose the change"],
        twist: ["leading questions", "too much help", "a single tester"],
      },
    },
  },
  {
    id: "5.04",
    title: "Interface architecture",
    track: "systems",
    kind: "concept",
    goal: "Build menus and a HUD that work with keyboard, mouse and touch on any screen size",
    sessions: 3,
    prereqs: ["2.10", "3.01", "3.10"],
    links: [
      { to: "6.02", note: "Editor tools are an interface with more state." },
    ],
    brief: {
      keyIdeas: [
        "Lay out by anchors and safe margins, not fixed pixels",
        "Focus moves predictably with keys and controllers; touch needs large targets",
        "A HUD reads game state through events or a read-only view",
        "Menus are a stack of screens with a clear back action",
      ],
      misconceptions: [
        "Interfaces that only work at one screen size",
        "Buttons that respond to mouse but not to keyboard",
        "HUD code that changes game state",
      ],
      itemTypes: ["find-bug", "write", "preview", "explain"],
      variationAxes: {
        context: ["a pause menu", "a health and score HUD", "settings", "a level select"],
        input: ["keyboard", "mouse", "touch"],
        twist: ["small phone", "focus trap", "back button"],
      },
    },
  },
  {
    id: "5.05",
    title: "Text and accessibility",
    track: "design",
    kind: "concept",
    goal: "Render readable text, choose colour-blind-safe palettes, allow remapping and reduced motion",
    sessions: 2,
    prereqs: ["5.04"],
    links: [],
    brief: {
      keyIdeas: [
        "Text needs size, contrast and a readable font at the smallest screen",
        "Never use colour as the only signal",
        "Let players remap controls and reduce motion and flashing",
        "Settings must be saved and easy to find",
      ],
      misconceptions: [
        "Thinking accessibility helps only a few players",
        "Red and green as the only difference between states",
        "Shake and flashes with no way to turn them off",
      ],
      itemTypes: ["choice", "find-bug", "write", "explain"],
      variationAxes: {
        context: ["team colours", "a damage flash", "subtitles", "control remapping"],
        need: ["colour vision", "motion sensitivity", "reading", "motor"],
        task: ["spot the problem", "choose a fix", "implement a setting"],
      },
    },
  },
  {
    id: "5.06",
    title: "Difficulty and balance",
    track: "design",
    kind: "concept",
    goal: "Shape difficulty curves and tune numbers using expected value and playtest data",
    sessions: 2,
    prereqs: ["4.10", "5.03"],
    links: [],
    brief: {
      keyIdeas: [
        "Difficulty should rise with skill, with dips for rest",
        "Expected damage per second and time to kill make numbers comparable",
        "Change one variable at a time and measure",
        "Dominant strategies show a balance problem",
      ],
      misconceptions: [
        "Balancing by feel alone",
        "Making a game harder only by adding health",
        "Ignoring variance when the average looks right",
      ],
      itemTypes: ["numeric", "choice", "explain"],
      variationAxes: {
        context: ["two weapons", "an enemy wave", "a boss", "an economy of coins"],
        measure: ["damage per second", "time to kill", "win rate", "expected reward"],
        twist: ["dominant option", "variance", "skill ceiling"],
      },
    },
  },
  {
    id: "5.07",
    title: "Game feel",
    track: "design",
    kind: "concept",
    goal: "Add tweening, hit-stop, shake, squash and stretch, and particles with purpose",
    sessions: 3,
    prereqs: ["2.11", "2.14", "3.08"],
    links: [],
    brief: {
      keyIdeas: [
        "Feel comes from response time, motion and feedback layered together",
        "Hit-stop pauses for a few frames to make impacts land",
        "Squash and stretch keep volume roughly constant",
        "Every effect should say something about what happened",
      ],
      misconceptions: [
        "Adding effects until the screen is unreadable",
        "Delays between input and response that make controls feel heavy",
        "Effects that stop gameplay rather than accompany it",
      ],
      itemTypes: ["choice", "preview", "write", "explain"],
      variationAxes: {
        context: ["a sword hit", "a jump landing", "collecting a coin", "an explosion"],
        technique: ["tween", "hit-stop", "shake", "squash and stretch", "particles"],
        twist: ["too much", "input delay", "reduced motion setting"],
      },
    },
  },
  {
    id: "5.08",
    title: "Performance and profiling",
    track: "systems",
    kind: "skill",
    goal: "Measure a frame budget with the browser profiler and fix the real bottleneck",
    sessions: 2,
    prereqs: ["2.08", "4.05"],
    links: [
      { to: "6.03", note: "Debug overlays show frame time while you play." },
    ],
    brief: {
      keyIdeas: [
        "At 60 frames a second each frame has about 16.7 milliseconds",
        "Measure before changing anything",
        "The profiler shows where time actually goes",
        "Fix the largest cost first, then measure again",
      ],
      misconceptions: [
        "Optimising code that is not slow",
        "Judging speed on a fast laptop only",
        "Confusing frame rate with frame time",
      ],
      itemTypes: ["numeric", "choice", "explain", "find-bug"],
      variationAxes: {
        context: ["many particles", "large tilemap", "pathfinding spikes", "text rendering"],
        evidence: ["profiler flame chart", "frame time graph", "counts per frame"],
        twist: ["garbage collection", "a spike rather than an average", "phone versus laptop"],
      },
    },
  },
  {
    id: "5.09",
    title: "Memory and pooling",
    track: "programming",
    kind: "concept",
    goal: "Avoid garbage-collection pauses with object pools and typed arrays",
    sessions: 2,
    prereqs: ["2.12", "5.08"],
    links: [
      { to: "5.10", note: "Components stored in typed arrays are a step towards a data-oriented design." },
    ],
    brief: {
      keyIdeas: [
        "Creating many short-lived objects makes the garbage collector pause",
        "A pool keeps dead objects and reuses them",
        "Reused objects must be fully reset",
        "Typed arrays store numbers compactly and quickly",
      ],
      misconceptions: [
        "Pooling everything, even things created once",
        "Forgetting to reset a reused object",
        "Holding references to pooled objects after release",
      ],
      itemTypes: ["find-bug", "write", "trace", "explain"],
      variationAxes: {
        context: ["bullets", "particles", "damage numbers", "temporary vectors"],
        technique: ["pool", "reset", "typed array", "avoid allocation in a loop"],
        twist: ["stale reference", "partial reset", "pool exhausted"],
      },
    },
  },
  {
    id: "5.10",
    title: "Entity-component design",
    track: "programming",
    kind: "concept",
    goal: "Build entities from components and systems, and know when it is worth it",
    sessions: 3,
    prereqs: ["2.13", "5.09"],
    links: [
      { to: "6.08", note: "Godot's nodes are another way of composing behaviour." },
    ],
    brief: {
      keyIdeas: [
        "An entity is an id; components are plain data; systems run over entities with given components",
        "Composition replaces deep inheritance trees",
        "Systems run in a chosen order each frame",
        "For small games, simple objects are often enough",
      ],
      misconceptions: [
        "Putting behaviour in components",
        "Thinking ECS is always faster or better",
        "Systems that depend on each other's order without saying so",
      ],
      itemTypes: ["trace", "write", "explain", "choice"],
      variationAxes: {
        context: ["a burning crate", "a flying enemy", "a moving platform", "a collectable"],
        part: ["entity", "component", "system", "query"],
        twist: ["inheritance problem", "system order", "too small to need it"],
      },
    },
  },
  {
    id: "5.11",
    title: "Shaders with WebGL",
    track: "systems",
    kind: "concept",
    goal: "Write fragment shaders as functions of position, treat colours as vectors, and light with the dot product",
    sessions: 3,
    prereqs: ["2.06", "3.09"],
    links: [],
    brief: {
      keyIdeas: [
        "A fragment shader runs once per pixel, in parallel on the graphics card",
        "Colours are vectors with components from 0 to 1",
        "Uniforms pass values such as time and resolution from your code",
        "Diffuse light is max(0, normal · light direction)",
      ],
      misconceptions: [
        "Expecting a shader to remember earlier pixels",
        "Using 0 to 255 colours in shader code",
        "Forgetting that coordinates need normalising by resolution",
      ],
      itemTypes: ["predict", "numeric", "write", "find-bug"],
      variationAxes: {
        context: ["a vignette", "water ripples", "a light around the player", "a damage flash"],
        idea: ["colour as vector", "uniforms", "distance fields", "dot product lighting"],
        twist: ["colour range", "resolution", "negative light"],
      },
    },
  },
  {
    id: "5.12",
    title: "Matrices in depth",
    track: "maths",
    kind: "concept",
    goal: "Use 3x3 homogeneous matrices and their inverse to turn a tap on screen into a world position under zoom and rotation",
    sessions: 3,
    prereqs: ["3.08", "3.09"],
    links: [
      { to: "5.11", note: "Shaders apply the same matrices on the graphics card." },
    ],
    brief: {
      keyIdeas: [
        "Homogeneous coordinates add a 1 so translation becomes a matrix too",
        "Multiplying matrices composes transforms, right to left",
        "The inverse undoes a transform",
        "Screen to world is the inverse of the camera matrix",
      ],
      misconceptions: [
        "Multiplying in the wrong order",
        "Inverting each part but in the original order",
        "Treating a direction like a point and translating it",
      ],
      itemTypes: ["numeric", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["a zoomable map", "a rotating camera", "picking a tile", "a minimap"],
        operation: ["compose", "apply", "invert", "point versus direction"],
        twist: ["order", "rotation and zoom together", "scale of zero"],
      },
    },
  },
  {
    id: "5.13",
    title: "Saving and loading",
    track: "programming",
    kind: "concept",
    goal: "Serialise game state, version save files and store them in the browser",
    sessions: 2,
    prereqs: ["1.10", "3.03"],
    links: [
      { to: "6.01", note: "Data files and save files are both serialised data." },
    ],
    brief: {
      keyIdeas: [
        "Save only the state needed to rebuild the game, not every object",
        "JSON turns plain data into text and back",
        "A version number lets new code read old saves",
        "localStorage is small and synchronous; IndexedDB suits larger data",
      ],
      misconceptions: [
        "Saving class instances and expecting methods back",
        "No version, so updates break saves",
        "Trusting loaded data without checking it",
      ],
      itemTypes: ["predict", "write", "find-bug", "explain"],
      variationAxes: {
        context: ["level progress", "settings", "an inventory", "a high-score table"],
        task: ["serialise", "load", "migrate an old version", "validate"],
        twist: ["class instance", "missing field", "corrupted save"],
      },
    },
  },
  {
    id: "5.14",
    title: "Game: Tidepool",
    track: "design",
    kind: "project",
    goal: "Build a polished puzzle game with a dozen designed levels, menus, settings, saves, accessibility options, juice and one shader effect, playtested at least twice",
    sessions: 12,
    prereqs: [
      "5.01", "5.02", "5.03", "5.04", "5.05", "5.06", "5.07",
      "5.08", "5.09", "5.10", "5.11", "5.12", "5.13",
    ],
    links: [
      { to: "6.09", note: "Tidepool is the rehearsal for building and finishing your own game." },
    ],
    brief: {
      keyIdeas: [
        "Polish is many small decisions made carefully",
        "Designed levels teach the mechanic without words",
        "Playtests decide what changes",
      ],
      misconceptions: [
        "Polishing before the core loop is fun",
        "Skipping playtests because the game seems obvious",
      ],
      itemTypes: ["milestone", "find-bug", "preview"],
      variationAxes: {
        milestone: ["core puzzle", "level format", "levels", "menus and settings", "saves", "accessibility", "juice and shader", "playtests"],
      },
    },
  },
];
