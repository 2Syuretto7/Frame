import type { NodeSource } from "./types";

/** Phase 4: Physics, probability and game AI (weeks 28 to 36). */
export const PHASE_4_NODES: NodeSource[] = [
  {
    id: "4.01",
    title: "Forces and mass",
    track: "systems",
    kind: "concept",
    goal: "Apply gravity, drag and pushes through acceleration",
    sessions: 2,
    prereqs: ["2.05", "2.08"],
    links: [
      { to: "5.07", note: "Knockback is a carefully tuned force." },
    ],
    brief: {
      keyIdeas: [
        "Acceleration = total force ÷ mass",
        "Sum every force acting this step, then apply them once",
        "Gravity gives every mass the same acceleration; drag opposes velocity",
        "An impulse changes velocity instantly: Δv = impulse ÷ mass",
      ],
      misconceptions: [
        "Applying gravity as a force that ignores mass, then dividing by mass anyway",
        "Applying forces directly to position",
        "Treating an impulse like a force spread over time",
      ],
      itemTypes: ["numeric", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["a heavy crate and a light ball", "wind", "a rocket", "an explosion push"],
        force: ["gravity", "drag", "constant push", "impulse"],
        twist: ["heavier mass", "several forces at once", "force versus impulse"],
      },
    },
  },
  {
    id: "4.02",
    title: "Integration methods",
    track: "maths",
    kind: "concept",
    goal: "Compare Euler, semi-implicit Euler and Verlet, and see energy drift in slow motion",
    sessions: 2,
    prereqs: ["4.01"],
    links: [
      { to: "6.03", note: "Slow motion and frame stepping make integration errors visible." },
    ],
    brief: {
      keyIdeas: [
        "Integration steps the simulation forward by small amounts of time",
        "Explicit Euler updates position with the old velocity and gains energy over time",
        "Semi-implicit Euler updates velocity first and is stable for most games",
        "Verlet stores the previous position instead of velocity and suits ropes and cloth",
      ],
      misconceptions: [
        "Thinking smaller steps remove all error",
        "Believing the order of the two update lines does not matter",
        "Assuming the most accurate method is always best for games",
      ],
      itemTypes: ["trace", "numeric", "choice", "explain"],
      variationAxes: {
        context: ["an orbit", "a spring", "a pendulum", "a bouncing ball"],
        method: ["explicit Euler", "semi-implicit Euler", "Verlet"],
        twist: ["large step", "energy gain", "update order"],
      },
    },
  },
  {
    id: "4.03",
    title: "Collision response",
    track: "systems",
    kind: "concept",
    goal: "Separate overlapping bodies and bounce them with impulses, restitution and friction",
    sessions: 3,
    prereqs: ["2.06", "2.07", "4.01"],
    links: [],
    brief: {
      keyIdeas: [
        "Find the collision normal and how deep the overlap is",
        "Push bodies apart along the normal in proportion to their inverse masses",
        "Relative velocity along the normal decides whether they are approaching",
        "Restitution sets bounciness; friction reduces sliding along the surface",
      ],
      misconceptions: [
        "Reversing the whole velocity rather than its normal component",
        "Applying a bounce when the bodies are already separating",
        "Moving only one body, so heavy objects get pushed by light ones",
      ],
      itemTypes: ["numeric", "trace", "find-bug", "write"],
      variationAxes: {
        context: ["billiard balls", "a ball on a slope", "a crate hitting a wall", "two players bumping"],
        quantity: ["normal", "penetration", "restitution", "friction"],
        twist: ["infinite mass", "separating bodies", "glancing hit"],
      },
    },
  },
  {
    id: "4.04",
    title: "Separating axis theorem",
    track: "maths",
    kind: "concept",
    goal: "Detect collisions between rotated boxes and convex polygons",
    sessions: 3,
    prereqs: ["2.06", "3.09"],
    links: [
      { to: "4.06", note: "Raycasting uses the same projection ideas along a line." },
    ],
    brief: {
      keyIdeas: [
        "Two convex shapes do not overlap if some axis separates their shadows",
        "For polygons, the candidate axes are the edge normals of both shapes",
        "Project every corner onto an axis with the dot product and keep the minimum and maximum",
        "The axis with the smallest overlap gives the push-out direction",
      ],
      misconceptions: [
        "Applying the test to concave shapes",
        "Testing only one shape's axes",
        "Forgetting to normalise axes when measuring overlap depth",
      ],
      itemTypes: ["numeric", "trace", "choice", "write"],
      variationAxes: {
        context: ["a rotated crate", "a triangle ramp", "a spinning blade", "a tilted platform"],
        step: ["find axes", "project", "compare intervals", "minimum overlap"],
        twist: ["concave shape", "touching", "unnormalised axis"],
      },
    },
  },
  {
    id: "4.05",
    title: "Broad phase",
    track: "systems",
    kind: "concept",
    goal: "Use a spatial grid so collision checks scale to many objects",
    sessions: 2,
    prereqs: ["2.07", "2.12"],
    links: [
      { to: "5.08", note: "Profiling shows when a broad phase is worth adding." },
    ],
    brief: {
      keyIdeas: [
        "Testing every pair grows with the square of the object count",
        "A spatial grid buckets objects by cell so only neighbours are tested",
        "Objects spanning several cells go into each one",
        "Cell size should suit the typical object size",
      ],
      misconceptions: [
        "Testing the same pair twice",
        "Choosing a cell size far smaller than the objects",
        "Forgetting to rebuild or update the grid as objects move",
      ],
      itemTypes: ["numeric", "trace", "write", "explain"],
      variationAxes: {
        context: ["a swarm of bullets", "a crowd", "falling debris", "a bullet-hell pattern"],
        operation: ["count pairs", "insert", "query neighbours", "choose cell size"],
        twist: ["object across cells", "duplicate pairs", "very uneven sizes"],
      },
    },
  },
  {
    id: "4.06",
    title: "Raycasting",
    track: "maths",
    kind: "concept",
    goal: "Cast rays against segments and boxes for line of sight and hitscan",
    sessions: 2,
    prereqs: ["2.06", "4.04"],
    links: [
      { to: "4.08", note: "Line of sight is a ray from the agent to the target." },
    ],
    brief: {
      keyIdeas: [
        "A ray is a start point plus a direction, with points at start + t × direction",
        "Intersecting with a segment solves for t and the position along the segment",
        "The slab method intersects a ray with an axis-aligned box",
        "Keep the nearest hit with the smallest positive t",
      ],
      misconceptions: [
        "Accepting hits behind the start point",
        "Dividing by zero for parallel rays and segments",
        "Taking the first hit found rather than the nearest",
      ],
      itemTypes: ["numeric", "trace", "write", "find-bug"],
      variationAxes: {
        context: ["a laser sight", "a guard's line of sight", "a hitscan weapon", "mouse picking"],
        target: ["a segment", "a box", "a circle", "several walls"],
        twist: ["parallel", "behind the start", "nearest of several"],
      },
    },
  },
  {
    id: "4.07",
    title: "Steering behaviours",
    track: "systems",
    kind: "concept",
    goal: "Make agents seek, flee, arrive, wander and keep apart",
    sessions: 3,
    prereqs: ["2.03", "2.05"],
    links: [],
    brief: {
      keyIdeas: [
        "Steering = desired velocity - current velocity, limited to a maximum force",
        "Seek points the desired velocity at the target; flee points it away",
        "Arrive slows down inside a radius",
        "Separation pushes agents apart; behaviours combine as weighted sums",
      ],
      misconceptions: [
        "Setting velocity directly, so agents turn instantly",
        "Arrive that overshoots because it ignores current velocity",
        "Weights that let one behaviour drown out the rest",
      ],
      itemTypes: ["numeric", "write", "preview", "find-bug"],
      variationAxes: {
        context: ["a flock of birds", "a chasing hound", "fleeing sheep", "a crowd of shoppers"],
        behaviour: ["seek", "flee", "arrive", "wander", "separation"],
        twist: ["no force limit", "combined behaviours", "target moving"],
      },
    },
  },
  {
    id: "4.08",
    title: "Perception",
    track: "systems",
    kind: "concept",
    goal: "Give agents vision cones, hearing ranges and line of sight",
    sessions: 2,
    prereqs: ["2.06", "4.06"],
    links: [
      { to: "5.11", note: "Lighting and vision both compare directions with the dot product." },
    ],
    brief: {
      keyIdeas: [
        "Vision: within range, within the cone by dot product, and not blocked by walls",
        "Compare the dot product with the cosine of half the cone angle",
        "Hearing is a range check, perhaps scaled by how loud the sound was",
        "Remember the last seen position when sight is lost",
      ],
      misconceptions: [
        "Comparing the dot product with the angle itself",
        "Using the full cone angle instead of half",
        "Checking line of sight before the cheap tests, wasting time",
      ],
      itemTypes: ["numeric", "choice", "write", "find-bug"],
      variationAxes: {
        context: ["a guard", "a security camera", "a bat that hears", "a sniper"],
        sense: ["vision cone", "hearing", "line of sight", "memory"],
        twist: ["half angle", "unnormalised facing", "test order"],
      },
    },
  },
  {
    id: "4.09",
    title: "Enemy state machines",
    track: "systems",
    kind: "concept",
    goal: "Build patrol, chase, attack and retreat behaviour from states and perception",
    sessions: 3,
    prereqs: ["3.01", "4.07", "4.08"],
    links: [
      { to: "5.06", note: "Enemy behaviour is one of the main levers of difficulty." },
    ],
    brief: {
      keyIdeas: [
        "Each state chooses a steering behaviour and checks for transitions",
        "Perception events drive transitions such as patrol to chase",
        "Timers and hysteresis stop rapid flicking between states",
        "Telegraphing an attack makes it readable and fair",
      ],
      misconceptions: [
        "Transitions that flicker every frame at a boundary",
        "Enemies that know where the player is without seeing them",
        "One huge state with many flags",
      ],
      itemTypes: ["trace", "find-bug", "write", "explain"],
      variationAxes: {
        context: ["a skeleton guard", "a wolf pack", "a turret", "a cowardly goblin"],
        state: ["patrol", "chase", "attack", "search", "retreat"],
        twist: ["flicker", "lost sight", "telegraph timing"],
      },
    },
  },
  {
    id: "4.10",
    title: "Probability foundations",
    track: "maths",
    kind: "concept",
    goal: "Reason about chance, independence and expected value, and check intuition by simulation",
    sessions: 3,
    prereqs: ["1.16"],
    links: [
      { to: "5.06", note: "Balancing uses expected value to tune numbers." },
    ],
    brief: {
      keyIdeas: [
        "Probability is a number from 0 to 1 for how often something happens in the long run",
        "Independent chances multiply; either of exclusive outcomes add",
        "1 minus the chance of never is the chance of at least once",
        "Expected value is the average result over many tries",
      ],
      misconceptions: [
        "The gambler's fallacy: a miss makes a hit more likely next time",
        "Adding probabilities of independent events to get at least once",
        "Thinking a 10% chance guarantees one success in ten tries",
      ],
      itemTypes: ["numeric", "choice", "write", "explain"],
      variationAxes: {
        context: ["critical hits", "dice", "card draws", "rare drops"],
        question: ["single event", "and", "or", "at least once", "expected value"],
        twist: ["gambler's fallacy", "dependent draws", "simulation versus maths"],
      },
    },
  },
  {
    id: "4.11",
    title: "Weighted and seeded randomness",
    track: "maths",
    kind: "concept",
    goal: "Make weighted choices, shuffle fairly and reproduce results with seeds",
    sessions: 2,
    prereqs: ["1.09", "4.10"],
    links: [
      { to: "6.04", note: "Seeds make random simulations testable." },
    ],
    brief: {
      keyIdeas: [
        "A weighted choice picks a random number up to the total weight and walks the list",
        "The Fisher-Yates shuffle gives every order equal chance",
        "A seeded generator gives the same sequence for the same seed",
        "Separate generators for separate systems keep one change from shifting everything",
      ],
      misconceptions: [
        "Shuffling by sorting with a random comparison",
        "Off-by-one errors at the weight boundaries",
        "Reseeding with the time every frame",
      ],
      itemTypes: ["trace", "numeric", "write", "find-bug"],
      variationAxes: {
        context: ["a loot chest", "a card deck", "daily challenge levels", "enemy spawns"],
        technique: ["weighted pick", "shuffle", "seeded generator", "separate streams"],
        twist: ["biased shuffle", "zero weight", "shared generator"],
      },
    },
  },
  {
    id: "4.12",
    title: "Loot and spawn tables",
    track: "design",
    kind: "concept",
    goal: "Design drop and spawn tables, control variance and add pity timers",
    sessions: 2,
    prereqs: ["4.11"],
    links: [
      { to: "5.06", note: "Drop rates are a balance decision as much as a maths one." },
    ],
    brief: {
      keyIdeas: [
        "A table lists outcomes with weights, often with a chance of nothing",
        "Variance decides how streaky results feel, not just the average",
        "Pity timers raise the chance after a run of bad luck",
        "Shuffle bags guarantee every outcome within a set number of draws",
      ],
      misconceptions: [
        "Tuning only the average and ignoring droughts",
        "Thinking pity timers change the long-run rate not at all",
        "Weights that do not add up to what the designer intended",
      ],
      itemTypes: ["numeric", "choice", "write", "explain"],
      variationAxes: {
        context: ["a boss drop", "random enemy waves", "a card reward after a fight", "treasure rooms"],
        tool: ["weights", "variance", "pity timer", "shuffle bag"],
        twist: ["long droughts", "nested tables", "a tiny chance"],
      },
    },
  },
  {
    id: "4.13",
    title: "Graphs",
    track: "programming",
    kind: "concept",
    goal: "Represent maps and grids as nodes and edges",
    sessions: 2,
    prereqs: ["1.10", "3.06"],
    links: [],
    brief: {
      keyIdeas: [
        "A graph is a set of nodes joined by edges, which may be directed or weighted",
        "An adjacency list stores each node's neighbours",
        "A grid is an implicit graph: neighbours are worked out, not stored",
        "Frame's own knowledge map is a directed graph",
      ],
      misconceptions: [
        "Forgetting diagonal neighbours, or including them by accident",
        "Neighbours outside the grid",
        "Treating a one-way edge as two-way",
      ],
      itemTypes: ["trace", "write", "choice", "find-bug"],
      variationAxes: {
        context: ["dungeon rooms", "a road network", "a tile grid", "a skill tree"],
        representation: ["adjacency list", "implicit grid", "edge list"],
        twist: ["diagonals", "edges of the grid", "directed edges"],
      },
    },
  },
  {
    id: "4.14",
    title: "Queues and breadth-first search",
    track: "programming",
    kind: "concept",
    goal: "Flood-fill and find reachable areas",
    sessions: 2,
    prereqs: ["4.13"],
    links: [
      { to: "4.17", note: "Generated levels are checked for connectivity with a flood fill." },
    ],
    brief: {
      keyIdeas: [
        "A queue serves items first in, first out",
        "Breadth-first search visits nodes in rings of increasing distance",
        "Mark a node as visited when it is queued, not when it is taken out",
        "Recording each node's parent lets you rebuild the shortest path in steps",
      ],
      misconceptions: [
        "Using a stack and expecting shortest paths",
        "Marking visited too late and queueing nodes many times",
        "Using shift on a huge array without knowing its cost",
      ],
      itemTypes: ["trace", "predict", "write", "find-bug"],
      variationAxes: {
        context: ["paint bucket fill", "reachable rooms", "distance map for enemies", "puzzle moves"],
        output: ["visit order", "distances", "path", "reachable count"],
        twist: ["walls", "late visited mark", "stack instead of queue"],
      },
    },
  },
  {
    id: "4.15",
    title: "Dijkstra and priority queues",
    track: "programming",
    kind: "concept",
    goal: "Find cheapest paths with a binary heap",
    sessions: 3,
    prereqs: ["4.14"],
    links: [
      { to: "5.08", note: "A heap is an example of choosing a data structure for speed." },
    ],
    brief: {
      keyIdeas: [
        "Dijkstra expands the cheapest unexplored node first",
        "A priority queue gives the smallest item quickly",
        "A binary heap keeps that order in an array with parent at (i - 1) ÷ 2",
        "Edge costs must not be negative",
      ],
      misconceptions: [
        "Finalising a node when it is first seen instead of when it is taken out",
        "Thinking breadth-first search handles different costs",
        "Off-by-one parent and child index formulas",
      ],
      itemTypes: ["trace", "numeric", "write", "find-bug"],
      variationAxes: {
        context: ["swamp and road tiles", "travel between towns", "lava costs", "a delivery route"],
        part: ["heap insert", "heap remove", "relaxation", "path rebuild"],
        twist: ["tie costs", "negative cost", "stale queue entries"],
      },
    },
  },
  {
    id: "4.16",
    title: "A* pathfinding",
    track: "systems",
    kind: "concept",
    goal: "Find paths quickly with a heuristic, and smooth them",
    sessions: 3,
    prereqs: ["2.03", "4.15"],
    links: [
      { to: "4.09", note: "Chasing enemies follow A* paths when they cannot see you." },
    ],
    brief: {
      keyIdeas: [
        "A* orders the frontier by cost so far plus a heuristic guess of the cost remaining",
        "An admissible heuristic never overestimates, which keeps paths optimal",
        "Manhattan distance suits four-way grids; octile distance suits eight-way",
        "Paths can be smoothed by skipping waypoints that have line of sight",
      ],
      misconceptions: [
        "Using a heuristic that overestimates and expecting the best path",
        "Euclidean distance on a four-way grid making A* slower than needed",
        "Smoothing through corners the agent cannot fit past",
      ],
      itemTypes: ["trace", "numeric", "choice", "write"],
      variationAxes: {
        context: ["a guard crossing a dungeon", "a unit in a strategy game", "a cat chasing a mouse", "a maze"],
        heuristic: ["zero", "Manhattan", "octile", "Euclidean", "overestimating"],
        twist: ["no path", "ties", "diagonal corner cutting"],
      },
    },
  },
  {
    id: "4.17",
    title: "Procedural generation",
    track: "design",
    kind: "concept",
    goal: "Generate connected rooms and corridors from a seed",
    sessions: 3,
    prereqs: ["4.11", "4.14"],
    links: [
      { to: "6.01", note: "Generated content and authored data files often work together." },
    ],
    brief: {
      keyIdeas: [
        "Generation is an algorithm plus constraints, driven by a seed",
        "Place rooms, then connect them, then check every room is reachable",
        "Random walks and cellular automata give organic caves",
        "Always validate output and retry if a rule is broken",
      ],
      misconceptions: [
        "Assuming random output is always playable",
        "Unseeded generation that cannot be reproduced",
        "Overlapping rooms because placement never checked",
      ],
      itemTypes: ["trace", "write", "preview", "explain"],
      variationAxes: {
        context: ["a dungeon floor", "a cave", "an island", "a star field"],
        method: ["room placement", "corridors", "random walk", "cellular automaton"],
        twist: ["unreachable room", "same seed twice", "overlap"],
      },
    },
  },
  {
    id: "4.18",
    title: "Game: Undercroft",
    track: "design",
    kind: "project",
    goal: "Build a top-down dungeon crawler with generated floors, enemies that see, chase and pathfind, physical knockback and seeded loot",
    sessions: 10,
    prereqs: [
      "4.01", "4.02", "4.03", "4.04", "4.05", "4.06", "4.07", "4.08", "4.09",
      "4.10", "4.11", "4.12", "4.13", "4.14", "4.15", "4.16", "4.17",
    ],
    links: [
      { to: "5.02", note: "Undercroft's generated floors make a useful contrast with designed levels." },
    ],
    brief: {
      keyIdeas: [
        "Generation, AI and physics combine in one game",
        "Seeds make bugs reproducible",
        "Enemies need to be readable and fair, not only clever",
      ],
      misconceptions: [
        "Pathfinding every enemy every frame",
        "Loot rates tuned only by feel",
      ],
      itemTypes: ["milestone", "find-bug", "preview"],
      variationAxes: {
        milestone: ["generated floor", "movement and collision", "enemy perception", "chase and pathfinding", "knockback", "loot", "floors and progression"],
      },
    },
  },
];
