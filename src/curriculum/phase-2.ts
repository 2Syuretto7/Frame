import type { NodeSource } from "./types";

/** Phase 2: Motion and the maths of movement (weeks 10 to 18). */
export const PHASE_2_NODES: NodeSource[] = [
  {
    id: "2.01",
    title: "Vectors as arrows",
    track: "maths",
    kind: "concept",
    goal: "Add and scale vectors by components and by drawing",
    sessions: 3,
    prereqs: ["1.04", "1.10"],
    links: [
      { to: "2.05", note: "Velocity is a vector added to position every frame." },
      { to: "3.08", note: "A camera offset is a vector subtracted from every position." },
      { to: "4.03", note: "Collision response pushes bodies apart along a vector." },
      { to: "5.11", note: "In a shader, colours and positions are vectors too." },
    ],
    brief: {
      keyIdeas: [
        "A vector has a direction and a length, and is stored as x and y components",
        "Adding vectors adds components, which is placing arrows tip to tail",
        "Scaling multiplies both components and stretches the arrow",
        "A position and a displacement are both vectors but mean different things",
      ],
      misconceptions: [
        "Adding lengths instead of components",
        "Thinking a vector is tied to a fixed starting point",
        "Scaling only one component",
      ],
      itemTypes: ["numeric", "choice", "write", "predict"],
      variationAxes: {
        context: ["a ship's thrust", "wind on a projectile", "a conveyor belt", "a camera pan"],
        operation: ["addition", "subtraction", "scaling", "a sum of several vectors"],
        representation: ["components", "a drawing", "code"],
        twist: ["negative components", "the zero vector", "scaling by a negative"],
      },
    },
  },
  {
    id: "2.02",
    title: "Coordinate systems",
    track: "maths",
    kind: "concept",
    goal: "Convert between world and screen positions",
    sessions: 2,
    prereqs: ["1.12", "2.01"],
    links: [
      { to: "3.08", note: "A camera is the rule that turns world positions into screen positions." },
      { to: "3.09", note: "Transforms generalise the conversion to rotation and scale." },
    ],
    brief: {
      keyIdeas: [
        "The world has its own units and origin, separate from the screen's pixels",
        "screen = (world - cameraPosition) * scale, and the reverse undoes it step by step",
        "Converting a tap or click into world space reverses the drawing conversion",
        "Choose world units that suit the game, such as metres or tiles",
      ],
      misconceptions: [
        "Storing positions in screen pixels so the world breaks when the window resizes",
        "Applying the steps of the inverse conversion in the wrong order",
        "Forgetting the device pixel ratio on high-density screens",
      ],
      itemTypes: ["numeric", "write", "find-bug", "trace"],
      variationAxes: {
        context: ["a tap on a map", "a large level", "a zoomed view", "a minimap"],
        direction: ["world to screen", "screen to world", "a round trip"],
        twist: ["scale other than one", "camera at negative coordinates", "pixel ratio"],
      },
    },
  },
  {
    id: "2.03",
    title: "Length and unit vectors",
    track: "maths",
    kind: "concept",
    goal: "Measure distance with Pythagoras and fix faster diagonal movement",
    sessions: 2,
    prereqs: ["2.01"],
    links: [
      { to: "4.07", note: "Steering scales unit vectors by a desired speed." },
      { to: "4.16", note: "A* uses straight-line distance as its guess of the remaining cost." },
    ],
    brief: {
      keyIdeas: [
        "Length is the square root of x squared plus y squared",
        "Distance between points is the length of their difference",
        "Dividing by the length gives a unit vector: pure direction",
        "Comparing squared distances avoids a square root",
      ],
      misconceptions: [
        "Adding x and y to get the length",
        "Normalising the zero vector and getting NaN",
        "Thinking diagonal input of (1, 1) has length 1",
      ],
      itemTypes: ["numeric", "write", "find-bug", "predict"],
      variationAxes: {
        context: ["diagonal movement", "range of a tower", "nearest enemy", "joystick direction"],
        operation: ["length", "distance", "normalise", "compare squared distances"],
        twist: ["zero vector", "negative components", "3-4-5 versus awkward numbers"],
      },
    },
  },
  {
    id: "2.04",
    title: "Angles and trigonometry",
    track: "maths",
    kind: "concept",
    goal: "Use radians, the unit circle, sine, cosine and atan2",
    sessions: 3,
    prereqs: ["2.03"],
    links: [
      { to: "3.09", note: "Rotation in a transform is built from cosine and sine." },
      { to: "3.12", note: "A sine wave over time is the simplest sound." },
    ],
    brief: {
      keyIdeas: [
        "Radians measure angle by arc length on a circle of radius one, and a full turn is 2π",
        "cos and sin turn an angle into a unit vector: (cos θ, sin θ)",
        "atan2(y, x) turns a vector back into an angle",
        "With y downwards on screen, positive angles turn clockwise",
      ],
      misconceptions: [
        "Passing degrees to Math.sin",
        "Using atan(y / x) and getting the wrong quadrant",
        "Expecting angles to turn anticlockwise on the canvas",
      ],
      itemTypes: ["numeric", "choice", "write", "predict"],
      variationAxes: {
        context: ["orbiting moons", "a turret angle", "a clock hand", "a circular spawn ring"],
        operation: ["degrees to radians", "angle to vector", "vector to angle", "points on a circle"],
        twist: ["quadrant", "y downwards", "angles past a full turn"],
      },
    },
  },
  {
    id: "2.05",
    title: "Velocity and acceleration",
    track: "maths",
    kind: "concept",
    goal: "Update position from velocity and velocity from acceleration",
    sessions: 2,
    prereqs: ["1.14", "2.01"],
    links: [
      { to: "4.01", note: "Forces divided by mass give the acceleration used here." },
    ],
    brief: {
      keyIdeas: [
        "Velocity is change in position per second; acceleration is change in velocity per second",
        "Each frame: velocity += acceleration × dt, then position += velocity × dt",
        "Friction or drag can be modelled by shrinking velocity a little each frame",
        "Inertia comes from keeping velocity between frames",
      ],
      misconceptions: [
        "Setting position directly from input and losing inertia",
        "Applying drag with a factor that ignores delta time",
        "Mixing up which of position, velocity and acceleration to update first",
      ],
      itemTypes: ["trace", "numeric", "preview", "find-bug"],
      variationAxes: {
        context: ["a spaceship with thrust", "a car braking", "a falling stone", "an ice floor"],
        quantity: ["constant velocity", "constant acceleration", "drag", "a top speed"],
        twist: ["delta time ignored", "update order", "a sudden stop"],
      },
    },
  },
  {
    id: "2.06",
    title: "The dot product",
    track: "maths",
    kind: "concept",
    goal: "Measure facing and project one vector onto another",
    sessions: 3,
    prereqs: ["2.04"],
    links: [
      { to: "4.04", note: "The separating axis test is a series of projections." },
      { to: "4.08", note: "A vision cone check compares a dot product with the cone's angle." },
      { to: "5.11", note: "Diffuse lighting is the dot product of a surface normal and the light." },
    ],
    brief: {
      keyIdeas: [
        "a · b = ax × bx + ay × by",
        "For unit vectors it is the cosine of the angle between them",
        "Positive means roughly the same way, zero means perpendicular, negative means opposite",
        "Dotting with a unit vector gives the length of the shadow along it",
      ],
      misconceptions: [
        "Expecting the dot product to be a vector",
        "Forgetting to normalise before reading it as a cosine",
        "Confusing projection length with the projected vector",
      ],
      itemTypes: ["numeric", "choice", "write", "explain"],
      variationAxes: {
        context: ["is the enemy in front", "sliding along a wall", "light on a surface", "a guard's view"],
        use: ["sign test", "angle", "projection length", "projected vector"],
        twist: ["unnormalised input", "perpendicular case", "opposite directions"],
      },
    },
  },
  {
    id: "2.07",
    title: "Circle and box collision",
    track: "maths",
    kind: "concept",
    goal: "Detect circle and box overlaps, including the closest point on a box",
    sessions: 2,
    prereqs: ["1.17", "2.03"],
    links: [
      { to: "3.07", note: "Tile collision is box collision against a grid." },
      { to: "4.05", note: "A broad phase decides which pairs are worth testing at all." },
    ],
    brief: {
      keyIdeas: [
        "Two circles overlap when the distance between centres is less than the sum of the radii",
        "Comparing squared distance with squared radius sum avoids a square root",
        "Clamping a point to a box gives the closest point on the box",
        "A circle hits a box when that closest point lies within the radius",
      ],
      misconceptions: [
        "Treating circles as their bounding boxes",
        "Comparing squared distance with the unsquared radius sum",
        "Clamping with the wrong box edges because y grows downwards",
      ],
      itemTypes: ["numeric", "write", "find-bug", "predict"],
      variationAxes: {
        context: ["a ball and a paddle", "two asteroids", "a coin pickup", "a bumper"],
        pair: ["circle and circle", "circle and box", "point and circle"],
        case: ["overlap", "near miss", "touching", "circle centre inside the box"],
      },
    },
  },
  {
    id: "2.08",
    title: "Fixed timestep",
    track: "systems",
    kind: "concept",
    goal: "Step simulation at a steady rate with an accumulator, and explain why",
    sessions: 2,
    prereqs: ["1.14", "2.05"],
    links: [
      { to: "4.02", note: "Integration methods behave best with a steady step." },
      { to: "5.08", note: "A frame budget is the time you can spend before the next step is due." },
    ],
    brief: {
      keyIdeas: [
        "A variable step makes physics depend on frame rate, such as jump heights that differ",
        "An accumulator gathers elapsed time and runs fixed steps while enough has built up",
        "Drawing can blend between the last two states for smoothness",
        "A cap on steps per frame prevents a spiral of death",
      ],
      misconceptions: [
        "Thinking a fixed step means a fixed frame rate",
        "Forgetting to subtract the step from the accumulator",
        "Running unlimited catch-up steps after a long pause",
      ],
      itemTypes: ["trace", "numeric", "find-bug", "explain"],
      variationAxes: {
        context: ["a jump arc", "a falling sand toy", "a pendulum", "a replay system"],
        situation: ["steady frames", "a slow frame", "a very fast display", "a long pause"],
        twist: ["no cap", "accumulator not reduced", "interpolation factor"],
      },
    },
  },
  {
    id: "2.09",
    title: "Rotation and aiming",
    track: "systems",
    kind: "concept",
    goal: "Turn towards a target at a limited turning speed",
    sessions: 2,
    prereqs: ["2.04", "2.05"],
    links: [
      { to: "4.07", note: "Steering behaviours also turn gradually, but by changing velocity." },
    ],
    brief: {
      keyIdeas: [
        "The angle to a target comes from atan2 of the difference vector",
        "The shortest turn wraps the angle difference into the range -π to π",
        "Limit the change per frame to turn speed × dt",
        "Draw rotated shapes with ctx.rotate around their centre",
      ],
      misconceptions: [
        "Turning the long way round when the angle crosses ±π",
        "Snapping instantly and calling it aiming",
        "Rotating around the canvas origin instead of the object",
      ],
      itemTypes: ["numeric", "write", "find-bug", "preview"],
      variationAxes: {
        context: ["a turret", "a homing missile", "a ship facing the mouse", "a searchlight"],
        case: ["small turn", "crossing ±π", "target behind", "target moving"],
        twist: ["degrees versus radians", "frame-rate dependent turning"],
      },
    },
  },
  {
    id: "2.10",
    title: "Input as actions",
    track: "systems",
    kind: "concept",
    goal: "Map keyboard, mouse and touch onto actions, including an on-screen joystick",
    sessions: 3,
    prereqs: ["1.15", "2.03"],
    links: [
      { to: "5.04", note: "Menus and a HUD need the same action layer, plus focus and selection." },
    ],
    brief: {
      keyIdeas: [
        "Game code asks about actions such as move and fire, not about keys",
        "Pointer events cover mouse, pen and touch with one set of handlers",
        "A virtual joystick turns a drag into a direction and a strength between 0 and 1",
        "Keyboard direction vectors need normalising; joystick vectors need a dead zone",
      ],
      misconceptions: [
        "Writing separate game logic for each input device",
        "Forgetting that touch has no hover and several fingers at once",
        "No dead zone, so the player drifts",
      ],
      itemTypes: ["write", "find-bug", "trace", "preview"],
      variationAxes: {
        context: ["a twin-stick shooter", "a menu cursor", "a platformer jump", "a drag-to-aim catapult"],
        device: ["keyboard", "mouse", "touch", "two at once"],
        twist: ["dead zone", "diagonal speed", "multiple touches"],
      },
    },
  },
  {
    id: "2.11",
    title: "Interpolation and easing",
    track: "design",
    kind: "concept",
    goal: "Blend between values with lerp and shape motion with easing curves",
    sessions: 2,
    prereqs: ["2.05"],
    links: [
      { to: "3.05", note: "Animation timing uses the same idea of progress from 0 to 1." },
      { to: "3.08", note: "A smooth camera lerps towards its target every frame." },
      { to: "5.07", note: "Game feel leans heavily on well-chosen easing." },
    ],
    brief: {
      keyIdeas: [
        "lerp(a, b, t) = a + (b - a) × t, with t from 0 to 1",
        "Easing functions reshape t, such as ease-out = 1 - (1 - t)²",
        "Lerping towards a moving target each frame gives smooth following",
        "Frame-rate independent smoothing uses 1 - Math.exp(-rate × dt), not a fixed fraction",
      ],
      misconceptions: [
        "Using t outside 0 to 1 without meaning to",
        "Thinking a fixed fraction lerp each frame looks the same at every frame rate",
        "Confusing ease-in with ease-out",
      ],
      itemTypes: ["numeric", "choice", "write", "preview"],
      variationAxes: {
        context: ["a menu sliding in", "a health bar draining", "a camera follow", "a colour fade"],
        curve: ["linear", "ease-in", "ease-out", "ease-in-out"],
        twist: ["t out of range", "frame-rate dependence", "reversing direction"],
      },
    },
  },
  {
    id: "2.12",
    title: "Many entities",
    track: "programming",
    kind: "concept",
    goal: "Spawn, update and remove many objects safely while looping",
    sessions: 2,
    prereqs: ["1.09", "1.11"],
    links: [
      { to: "4.05", note: "Many entities make naive collision checks too slow." },
      { to: "5.09", note: "Pooling reuses removed entities instead of creating new ones." },
    ],
    brief: {
      keyIdeas: [
        "Keep entities of one kind in an array and update them all each frame",
        "Removing while looping forwards skips elements; loop backwards or filter",
        "Mark entities as dead and sweep them out after the update",
        "Give each entity the data it needs and keep behaviour in shared functions",
      ],
      misconceptions: [
        "Splicing inside a forward loop and skipping the next entity",
        "Spawning into the array being looped over and looping forever",
        "Keeping references to removed entities",
      ],
      itemTypes: ["trace", "find-bug", "write", "predict"],
      variationAxes: {
        context: ["bullets", "falling stars", "enemies", "floating score numbers"],
        operation: ["spawn", "update", "remove", "count by kind"],
        twist: ["splice in a loop", "spawn during update", "stale reference"],
      },
    },
  },
  {
    id: "2.13",
    title: "Classes and modules",
    track: "programming",
    kind: "concept",
    goal: "Organise code into modules, and choose between classes and plain functions",
    sessions: 3,
    prereqs: ["1.11", "2.12"],
    links: [
      { to: "5.10", note: "Entity-component design is another answer to the same question of organisation." },
    ],
    brief: {
      keyIdeas: [
        "A module is a file with exports and imports, which keeps names from clashing",
        "A class bundles data and the functions that act on it",
        "this refers to the object a method was called on",
        "Plain objects plus functions are often simpler than classes",
      ],
      misconceptions: [
        "Losing this when passing a method as a callback",
        "Thinking everything must be a class",
        "Circular imports between modules",
      ],
      itemTypes: ["predict", "find-bug", "write", "explain"],
      variationAxes: {
        context: ["a vector module", "an enemy class", "an input module", "a score keeper"],
        feature: ["export and import", "constructor", "method", "static helper"],
        twist: ["lost this", "default versus named export", "class versus functions"],
      },
    },
  },
  {
    id: "2.14",
    title: "Particles",
    track: "systems",
    kind: "concept",
    goal: "Build a particle system with lifetimes and random spread",
    sessions: 2,
    prereqs: ["1.16", "2.05", "2.12"],
    links: [
      { to: "5.07", note: "Particles with purpose are a large part of game feel." },
    ],
    brief: {
      keyIdeas: [
        "A particle is a tiny entity with position, velocity, age and lifetime",
        "Emitters spawn particles with randomised direction and speed",
        "Fade or shrink each particle by its age divided by its lifetime",
        "Remove particles when their age passes their lifetime",
      ],
      misconceptions: [
        "Random spread by random x and y, giving a square instead of a circle",
        "Forgetting to remove old particles so the count grows forever",
        "Lifetimes measured in frames rather than seconds",
      ],
      itemTypes: ["preview", "write", "find-bug", "numeric"],
      variationAxes: {
        context: ["an explosion", "engine exhaust", "sparks on a hit", "falling snow"],
        property: ["spread angle", "speed range", "lifetime", "gravity on particles"],
        twist: ["square spread", "no removal", "lifetime in frames"],
      },
    },
  },
  {
    id: "2.15",
    title: "Game: Drift",
    track: "design",
    kind: "project",
    goal: "Build a top-down arena game: steer a ship with inertia, aim by mouse or touch, collect shards and avoid drones that home in on you",
    sessions: 10,
    prereqs: [
      "2.01", "2.02", "2.03", "2.04", "2.05", "2.06", "2.07",
      "2.08", "2.09", "2.10", "2.11", "2.12", "2.13", "2.14",
    ],
    links: [
      { to: "4.07", note: "Drift's homing drones are steering behaviours in their simplest form." },
    ],
    brief: {
      keyIdeas: [
        "Inertia and turning make movement feel physical",
        "Aiming and input must work on keyboard, mouse and touch",
        "Many entities, collisions and particles combine in one loop",
      ],
      misconceptions: [
        "Drones that snap to the player instead of turning",
        "Frame-rate dependent motion that changes the difficulty",
      ],
      itemTypes: ["milestone", "find-bug", "preview"],
      variationAxes: {
        milestone: ["ship with inertia", "aiming", "shards", "homing drones", "collisions", "particles and score"],
      },
    },
  },
];
