import type { NodeSource } from "./types";

/** Phase 3: Structure, worlds and sound (weeks 19 to 27). */
export const PHASE_3_NODES: NodeSource[] = [
  {
    id: "3.01",
    title: "State machines",
    track: "programming",
    kind: "concept",
    goal: "Model game and player behaviour as states with explicit transitions",
    sessions: 3,
    prereqs: ["1.05", "1.11"],
    links: [
      { to: "4.09", note: "Enemy behaviour is a state machine driven by perception." },
      { to: "5.04", note: "Menu flows are state machines over screens." },
      { to: "6.02", note: "An editor's tools are states, and undo records the transitions." },
    ],
    brief: {
      keyIdeas: [
        "A state machine is in exactly one state at a time",
        "Transitions happen on events or conditions, and can run enter and exit code",
        "A union type lists the states so impossible states cannot be written",
        "Drawing the states and arrows first makes the code obvious",
      ],
      misconceptions: [
        "Tracking state with several booleans that can contradict each other",
        "Changing state in the middle of an update and running two states' logic in one frame",
        "Forgetting a transition, so the machine gets stuck",
      ],
      itemTypes: ["trace", "find-bug", "write", "choice"],
      variationAxes: {
        context: ["a player that runs, jumps and falls", "a traffic light", "a door", "title, play and game over"],
        task: ["follow events through the machine", "add a state", "find the missing transition"],
        twist: ["conflicting booleans", "enter and exit actions", "a transition on a timer"],
      },
    },
  },
  {
    id: "3.02",
    title: "Scenes and structure",
    track: "programming",
    kind: "concept",
    goal: "Organise a game into scenes with enter, update, draw and exit",
    sessions: 2,
    prereqs: ["2.13", "3.01"],
    links: [
      { to: "6.08", note: "Godot's scene tree is a richer version of the scene structure you build here." },
    ],
    brief: {
      keyIdeas: [
        "A scene is a self-contained part of the game: title, level, pause, game over",
        "Every scene has the same interface, so the main loop treats them alike",
        "Switching scenes calls exit on the old one and enter on the new one",
        "A scene stack lets a pause screen sit on top of play",
      ],
      misconceptions: [
        "One giant update function with a mode variable checked everywhere",
        "Leaking listeners or timers from a scene after it exits",
        "Restarting a level by reloading the page",
      ],
      itemTypes: ["trace", "find-bug", "write", "explain"],
      variationAxes: {
        context: ["title to level", "pause overlay", "level to level", "game over and retry"],
        feature: ["interface", "switching", "stack", "shared data between scenes"],
        twist: ["leaked listener", "state not reset", "update while paused"],
      },
    },
  },
  {
    id: "3.03",
    title: "Loading things asynchronously",
    track: "programming",
    kind: "concept",
    goal: "Use promises and async and await to load before play begins",
    sessions: 2,
    prereqs: ["1.07", "3.02"],
    links: [
      { to: "5.13", note: "Loading a save file is another asynchronous step." },
    ],
    brief: {
      keyIdeas: [
        "Some work finishes later, such as loading images or sounds",
        "A promise stands for a value that will arrive, or an error",
        "await pauses an async function until the promise settles, without freezing the page",
        "Promise.all waits for several loads at once",
      ],
      misconceptions: [
        "Expecting code after an async call to see its result without await",
        "Awaiting in a loop when the loads could run together",
        "Forgetting to handle a failed load",
      ],
      itemTypes: ["predict", "order", "find-bug", "write"],
      variationAxes: {
        context: ["loading sprites", "loading a level file", "decoding sounds", "a loading bar"],
        pattern: ["single await", "sequential awaits", "Promise.all", "try and catch"],
        twist: ["missing await", "order of logs", "a failed load"],
      },
    },
  },
  {
    id: "3.04",
    title: "Sprites from code",
    track: "systems",
    kind: "concept",
    goal: "Turn text-grid pixel art into images and draw them crisply at any scale",
    sessions: 2,
    prereqs: ["1.12", "3.03"],
    links: [
      { to: "5.11", note: "A shader also decides a colour for every pixel, on the graphics card." },
    ],
    brief: {
      keyIdeas: [
        "A sprite can be written as rows of characters, each character a colour from a palette",
        "Draw the grid once onto an offscreen canvas, then reuse it every frame",
        "Turning off image smoothing keeps pixel art crisp when scaled",
        "Scale by whole numbers to avoid uneven pixels",
      ],
      misconceptions: [
        "Redrawing every pixel of every sprite every frame",
        "Blurry sprites from smoothing left on",
        "Mixing up rows and columns when reading the grid",
      ],
      itemTypes: ["predict", "write", "find-bug", "preview"],
      variationAxes: {
        context: ["a hero", "a coin", "a bat", "a heart icon", "a tile"],
        task: ["read a grid", "draw a grid", "scale", "flip horizontally"],
        twist: ["smoothing", "rows and columns swapped", "non-integer scale"],
      },
    },
  },
  {
    id: "3.05",
    title: "Frame animation",
    track: "systems",
    kind: "concept",
    goal: "Time animation frames and tie them to the player's state",
    sessions: 2,
    prereqs: ["2.11", "3.01", "3.04"],
    links: [
      { to: "5.07", note: "Squash and stretch adds feel on top of frame animation." },
    ],
    brief: {
      keyIdeas: [
        "An animation is a list of frames and a time per frame",
        "Elapsed time divided by frame time, wrapped with %, picks the frame",
        "Each state has its own animation, and changing state restarts it",
        "Some animations loop and some play once",
      ],
      misconceptions: [
        "Advancing one frame per game frame, so speed depends on frame rate",
        "Not resetting the timer when the state changes",
        "Looping animations that should play once",
      ],
      itemTypes: ["numeric", "trace", "find-bug", "preview"],
      variationAxes: {
        context: ["walking", "idle breathing", "a coin spin", "a door opening"],
        mode: ["looping", "play once", "ping-pong"],
        twist: ["frame-rate dependence", "no reset on state change", "different frame times"],
      },
    },
  },
  {
    id: "3.06",
    title: "Tilemaps",
    track: "systems",
    kind: "concept",
    goal: "Store a level as a grid, convert between tile and world positions, and draw only what is visible",
    sessions: 3,
    prereqs: ["1.09", "2.02"],
    links: [
      { to: "4.13", note: "A tilemap is a graph in which neighbouring tiles are connected." },
      { to: "6.01", note: "Levels as data files start with the tile grid." },
    ],
    brief: {
      keyIdeas: [
        "A level is a 2D grid, often stored as an array of rows or one flat array",
        "tile = Math.floor(world / tileSize); world = tile × tileSize",
        "Flat index = row × width + column",
        "Draw only the tiles the camera can see",
      ],
      misconceptions: [
        "Swapping rows and columns, or x and y",
        "Using Math.round instead of Math.floor for tile lookup",
        "Drawing the whole map every frame",
      ],
      itemTypes: ["numeric", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["a cave", "a dungeon floor", "a puzzle board", "a race track"],
        operation: ["world to tile", "tile to world", "flat index", "visible range"],
        twist: ["negative coordinates", "edge of the map", "rows versus columns"],
      },
    },
  },
  {
    id: "3.07",
    title: "Platformer movement",
    track: "systems",
    kind: "concept",
    goal: "Apply gravity, jump and resolve tile collisions one axis at a time",
    sessions: 3,
    prereqs: ["2.07", "2.08", "3.06"],
    links: [
      { to: "4.03", note: "Collision response generalises pushing out of tiles to any shapes." },
    ],
    brief: {
      keyIdeas: [
        "Gravity adds to vertical velocity every step",
        "Move on x and resolve, then move on y and resolve, so corners behave",
        "Landing sets vertical velocity to zero and marks the player as grounded",
        "Coyote time and jump buffering make jumping feel fair",
      ],
      misconceptions: [
        "Resolving both axes at once and snagging on corners",
        "Allowing jumps in mid-air because grounded is never cleared",
        "Tunnelling through floors at high speed",
      ],
      itemTypes: ["trace", "find-bug", "preview", "explain"],
      variationAxes: {
        context: ["a jump onto a ledge", "walking into a wall", "falling into a pit", "a low ceiling"],
        feature: ["gravity", "jump", "axis-by-axis resolution", "coyote time"],
        twist: ["corner snag", "tunnelling", "double jump bug"],
      },
    },
  },
  {
    id: "3.08",
    title: "Cameras",
    track: "systems",
    kind: "concept",
    goal: "Follow the player with a dead zone, bounds, smoothing and screen shake",
    sessions: 2,
    prereqs: ["2.02", "2.11"],
    links: [
      { to: "3.09", note: "A camera is a transform applied to the whole world." },
      { to: "5.12", note: "Zooming and rotating cameras need full matrices and their inverses." },
    ],
    brief: {
      keyIdeas: [
        "The camera has a world position; drawing subtracts it from everything",
        "A dead zone lets the player move a little before the camera follows",
        "Clamp the camera so it never shows beyond the level",
        "Shake adds a small, decaying random offset",
      ],
      misconceptions: [
        "Moving the world instead of the camera",
        "Clamping before smoothing, causing jitter at the edges",
        "Shake that never decays or depends on frame rate",
      ],
      itemTypes: ["numeric", "write", "find-bug", "preview"],
      variationAxes: {
        context: ["a platformer", "a top-down map", "a boss arena", "a narrow corridor"],
        feature: ["follow", "dead zone", "bounds", "shake"],
        twist: ["level smaller than the screen", "fast player", "order of clamp and smoothing"],
      },
    },
  },
  {
    id: "3.09",
    title: "Transforms and matrices",
    track: "maths",
    kind: "concept",
    goal: "See translate, rotate and scale as functions on vectors, and compose them",
    sessions: 3,
    prereqs: ["2.04", "3.08"],
    links: [
      { to: "4.04", note: "Rotated boxes are transformed corners." },
      { to: "5.11", note: "Shaders receive positions that have already been transformed." },
      { to: "5.12", note: "Matrices in depth adds homogeneous coordinates and inverses." },
    ],
    brief: {
      keyIdeas: [
        "Translate, rotate and scale each move a point in a predictable way",
        "Order matters: rotate then translate differs from translate then rotate",
        "A 2×2 matrix is a compact way to write rotation and scale",
        "ctx.save and ctx.restore keep transforms from leaking between objects",
      ],
      misconceptions: [
        "Thinking transform order does not matter",
        "Forgetting to restore, so every later drawing is transformed",
        "Rotating around the origin instead of the object's centre",
      ],
      itemTypes: ["numeric", "predict", "choice", "find-bug"],
      variationAxes: {
        context: ["a spinning blade", "a swinging arm", "a zoomed map", "a mirrored sprite"],
        operation: ["translate", "rotate", "scale", "composition of two"],
        twist: ["order", "pivot point", "negative scale"],
      },
    },
  },
  {
    id: "3.10",
    title: "Events",
    track: "programming",
    kind: "concept",
    goal: "Decouple parts of a game with events, so one action can trigger sound, score and effects",
    sessions: 2,
    prereqs: ["2.13"],
    links: [
      { to: "5.04", note: "Interfaces react to game events without the game knowing about them." },
      { to: "6.08", note: "Godot's signals are events with a different name." },
    ],
    brief: {
      keyIdeas: [
        "An event emitter keeps lists of listeners for named events",
        "Emitting calls every listener with the event's data",
        "The code that emits does not need to know who listens",
        "Listeners must be removed when their owner goes away",
      ],
      misconceptions: [
        "Expecting listeners to run in a particular order without arranging it",
        "Leaking listeners from destroyed objects",
        "Using events for everything, so control flow becomes hard to follow",
      ],
      itemTypes: ["predict", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["coin collected", "player hurt", "level complete", "enemy defeated"],
        feature: ["subscribe", "emit", "unsubscribe", "event data"],
        twist: ["leaked listener", "listener added during emit", "typed event names"],
      },
    },
  },
  {
    id: "3.11",
    title: "Web Audio basics",
    track: "systems",
    kind: "concept",
    goal: "Play, layer and control sounds, including the rules phones apply to audio",
    sessions: 2,
    prereqs: ["3.03", "3.10"],
    links: [
      { to: "3.13", note: "Mixing builds on gain nodes and routing." },
    ],
    brief: {
      keyIdeas: [
        "An AudioContext routes sound from sources through nodes to the speakers",
        "A gain node controls volume",
        "Browsers start audio suspended until the user taps or presses a key",
        "Each playback uses a new source node",
      ],
      misconceptions: [
        "Expecting sound to play before any user gesture",
        "Reusing a source node that has already played",
        "Treating volume as linear to loudness",
      ],
      itemTypes: ["find-bug", "order", "explain", "write"],
      variationAxes: {
        context: ["a jump sound", "background hum", "a menu click", "overlapping hits"],
        feature: ["resume on gesture", "gain", "routing", "overlapping playback"],
        twist: ["suspended context", "reused source", "volume curve"],
      },
    },
  },
  {
    id: "3.12",
    title: "Synthesising sound",
    track: "design",
    kind: "concept",
    goal: "Make your own effects from oscillators and envelopes",
    sessions: 2,
    prereqs: ["2.04", "2.11", "3.11"],
    links: [
      { to: "5.07", note: "Sound is half of game feel." },
    ],
    brief: {
      keyIdeas: [
        "An oscillator makes a repeating wave: sine, square, sawtooth or triangle",
        "Frequency sets pitch; doubling it raises the note by an octave",
        "An envelope shapes volume over time: attack, decay, sustain, release",
        "Pitch sweeps and noise make classic game effects",
      ],
      misconceptions: [
        "Abrupt stops that click because the volume drops instantly",
        "Thinking pitch is linear, so adding 100 Hz is always the same step",
        "Expecting a sine wave to sound bright",
      ],
      itemTypes: ["numeric", "choice", "write", "explain"],
      variationAxes: {
        context: ["a laser", "a coin chime", "an explosion", "a jump"],
        element: ["waveform", "frequency", "envelope", "pitch sweep"],
        twist: ["clicking", "octaves", "noise"],
      },
    },
  },
  {
    id: "3.13",
    title: "Music and mixing",
    track: "design",
    kind: "concept",
    goal: "Loop music, crossfade, group volumes and pan sounds by position",
    sessions: 2,
    prereqs: ["2.02", "3.12"],
    links: [
      { to: "5.05", note: "Separate volume controls are an accessibility setting." },
    ],
    brief: {
      keyIdeas: [
        "Music loops without gaps when scheduled on the audio clock",
        "Crossfading lowers one track while raising another",
        "Bus gains group sounds into music, effects and interface",
        "Stereo panning can follow an object's position on screen",
      ],
      misconceptions: [
        "Scheduling with setTimeout and getting gaps or drift",
        "A crossfade where the total loudness dips or jumps",
        "Panning by world position without converting to the screen",
      ],
      itemTypes: ["numeric", "find-bug", "write", "explain"],
      variationAxes: {
        context: ["a calm level to a boss", "pause menu ducking", "a passing enemy", "a volume slider"],
        feature: ["looping", "crossfade", "buses", "panning"],
        twist: ["timer drift", "equal-power fade", "position off screen"],
      },
    },
  },
  {
    id: "3.14",
    title: "Working outside Frame",
    track: "programming",
    kind: "skill",
    goal: "Set up VS Code, Node, Vite and git, and run your game locally",
    sessions: 2,
    prereqs: ["2.13"],
    links: [
      { to: "6.05", note: "Releasing builds on the same tools." },
    ],
    brief: {
      keyIdeas: [
        "Node runs JavaScript tools on your computer; npm installs them",
        "Vite serves your game while you work and builds it for release",
        "git records snapshots, so you can always go back",
        "A project folder has a package.json, an index.html and your source files",
      ],
      misconceptions: [
        "Committing node_modules",
        "Opening index.html directly and wondering why modules fail",
        "Thinking git saves automatically",
      ],
      itemTypes: ["order", "choice", "find-bug", "explain"],
      variationAxes: {
        context: ["starting a project", "a broken import", "undoing a change", "adding a library"],
        tool: ["terminal", "npm", "Vite", "git"],
        twist: ["wrong folder", "missing install", "uncommitted work"],
      },
    },
  },
  {
    id: "3.15",
    title: "Game: Lantern",
    track: "design",
    kind: "project",
    goal: "Build a single-level cave platformer with your own animated sprite, camera, synthesised sound and title, pause and game-over states",
    sessions: 10,
    prereqs: [
      "3.01", "3.02", "3.03", "3.04", "3.05", "3.06", "3.07",
      "3.08", "3.09", "3.10", "3.11", "3.12", "3.13", "3.14",
    ],
    links: [
      { to: "5.02", note: "Level design will ask you to look back at Lantern's level with new eyes." },
    ],
    brief: {
      keyIdeas: [
        "Scenes and states give a game a clear structure",
        "A tilemap, a camera and platformer physics make a world to explore",
        "Your own sprites and sounds give the game a voice",
      ],
      misconceptions: [
        "Hard-coding the level in drawing code",
        "Sounds that play before the first tap on a phone",
      ],
      itemTypes: ["milestone", "find-bug", "preview"],
      variationAxes: {
        milestone: ["scenes", "tilemap level", "player movement", "sprite and animation", "camera", "sound", "states and polish"],
      },
    },
  },
];
