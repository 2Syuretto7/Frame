import { PHASE_1_NODES } from "./phase-1";
import { PHASE_2_NODES } from "./phase-2";
import { PHASE_3_NODES } from "./phase-3";
import { PHASE_4_NODES } from "./phase-4";
import { PHASE_5_NODES } from "./phase-5";
import { PHASE_6_NODES } from "./phase-6";
import type { CurriculumEdge, CurriculumNode, NodeSource, PhaseInfo } from "./types";

export const PHASES: PhaseInfo[] = [
  {
    number: 1,
    title: "Programming and the game loop",
    weeks: "1 to 9",
    game: "Rainfall",
    summary: "From never having programmed to a simple game that moves on screen in response to keys.",
  },
  {
    number: 2,
    title: "Motion and the maths of movement",
    weeks: "10 to 18",
    game: "Drift",
    summary: "Vectors and trigonometry through motion, alongside managing many entities.",
  },
  {
    number: 3,
    title: "Structure, worlds and sound",
    weeks: "19 to 27",
    game: "Lantern",
    summary: "States, scenes, sprites, tilemaps, cameras, transforms and sound.",
  },
  {
    number: 4,
    title: "Physics, probability and game AI",
    weeks: "28 to 36",
    game: "Undercroft",
    summary: "Physics, probability, and graphs with pathfinding, meeting in enemy behaviour.",
  },
  {
    number: 5,
    title: "Design, interfaces, polish and performance",
    weeks: "37 to 45",
    game: "Tidepool",
    summary: "Making games good: design, playtesting, interfaces, feel, performance and shaders.",
  },
  {
    number: 6,
    title: "Tools, shipping and independence",
    weeks: "46 to 52",
    game: "Your capstone",
    summary: "Your own tools, testing and releasing, then a game of your own.",
  },
];

const SOURCES: NodeSource[][] = [
  PHASE_1_NODES,
  PHASE_2_NODES,
  PHASE_3_NODES,
  PHASE_4_NODES,
  PHASE_5_NODES,
  PHASE_6_NODES,
];

/** Nodes that a phase's game does not require, because they are optional. */
const OPTIONAL_NODES = new Set(["6.08"]);

const ID_PATTERN = /^([1-9])\.(\d{2})$/;

export function phaseOf(id: string): number {
  const match = ID_PATTERN.exec(id);
  return match ? Number(match[1]) : NaN;
}

export interface Graph {
  nodes: CurriculumNode[];
  byId: Map<string, CurriculumNode>;
  edges: CurriculumEdge[];
}

export function buildGraph(sources: NodeSource[][] = SOURCES): Graph {
  const nodes: CurriculumNode[] = sources.flat().map((source, order) => ({
    ...source,
    phase: phaseOf(source.id),
    order,
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges: CurriculumEdge[] = [];
  const prerequisiteEdges = new Map<string, CurriculumEdge>();
  for (const node of nodes) {
    for (const from of node.prereqs) {
      const edge: CurriculumEdge = { from, to: node.id, type: "prerequisite", note: null };
      edges.push(edge);
      prerequisiteEdges.set(pairKey(from, node.id), edge);
    }
  }
  for (const node of nodes) {
    for (const link of node.links) {
      // A link between a node and its prerequisite explains that prerequisite edge.
      const prerequisite = prerequisiteEdges.get(pairKey(node.id, link.to));
      if (prerequisite) prerequisite.note = link.note;
      else edges.push({ from: node.id, to: link.to, type: "related", note: link.note });
    }
  }
  return { nodes, byId, edges };
}

/**
 * Checks the graph and returns every problem found, so one run reports them all.
 * The build refuses to deploy while this list is not empty.
 */
export function validateGraph(graph: Graph, phases: PhaseInfo[] = PHASES): string[] {
  const problems: string[] = [];
  const { nodes, byId } = graph;
  const phaseNumbers = new Set(phases.map((p) => p.number));

  const seen = new Set<string>();
  for (const node of nodes) {
    if (!ID_PATTERN.test(node.id)) problems.push(`${node.id}: the id must look like 1.01`);
    if (seen.has(node.id)) problems.push(`${node.id}: the id is used twice`);
    seen.add(node.id);
    if (!phaseNumbers.has(node.phase)) problems.push(`${node.id}: phase ${node.phase} does not exist`);
    if (!node.title.trim() || !node.goal.trim()) problems.push(`${node.id}: the title and goal must not be empty`);
    if (/[.!]$/.test(node.goal)) problems.push(`${node.id}: the goal should not end with punctuation`);
    if (!Number.isInteger(node.sessions) || node.sessions < 1) problems.push(`${node.id}: sessions must be a whole number of at least 1`);

    const brief = node.brief;
    if (brief.keyIdeas.length === 0) problems.push(`${node.id}: the brief needs key ideas`);
    if (brief.misconceptions.length === 0) problems.push(`${node.id}: the brief needs misconceptions`);
    if (brief.itemTypes.length === 0) problems.push(`${node.id}: the brief needs item types`);
    const axes = Object.entries(brief.variationAxes);
    if (axes.length === 0) problems.push(`${node.id}: the brief needs at least one variation axis`);
    for (const [axis, values] of axes) {
      if (values.length < 2) problems.push(`${node.id}: variation axis "${axis}" needs at least two values`);
    }
  }

  // Prerequisites must exist and come earlier in teaching order, which also rules out cycles.
  for (const node of nodes) {
    const unique = new Set(node.prereqs);
    if (unique.size !== node.prereqs.length) problems.push(`${node.id}: a prerequisite is listed twice`);
    for (const id of node.prereqs) {
      const prereq = byId.get(id);
      if (!prereq) {
        problems.push(`${node.id}: prerequisite ${id} does not exist`);
      } else if (prereq.order >= node.order) {
        problems.push(`${node.id}: prerequisite ${id} must come earlier in the graph`);
      } else if (prereq.phase > node.phase) {
        problems.push(`${node.id}: prerequisite ${id} is in a later phase`);
      }
    }
  }

  const cycle = findCycle(graph);
  if (cycle) problems.push(`the prerequisites form a cycle: ${cycle.join(" → ")}`);

  // Links must exist and appear once per pair. A link that matches a prerequisite is
  // allowed: its note becomes the explanation on that prerequisite edge.
  const pairs = new Set<string>();
  for (const node of nodes) {
    for (const link of node.links) {
      if (!byId.has(link.to)) {
        problems.push(`${node.id}: linked node ${link.to} does not exist`);
        continue;
      }
      if (link.to === node.id) problems.push(`${node.id}: a node cannot link to itself`);
      const key = pairKey(node.id, link.to);
      if (pairs.has(key)) problems.push(`${node.id}: the link with ${link.to} is listed twice`);
      pairs.add(key);
      if (!link.note.trim()) problems.push(`${node.id}: the link with ${link.to} needs a note`);
    }
  }

  // Each phase game requires every other node in its phase, apart from optional ones.
  for (const phase of phases) {
    const inPhase = nodes.filter((n) => n.phase === phase.number);
    const projects = inPhase.filter((n) => n.kind === "project");
    if (projects.length !== 1) {
      problems.push(`phase ${phase.number}: expected exactly one project, found ${projects.length}`);
      continue;
    }
    const project = projects[0];
    const reachable = ancestors(graph, project.id);
    for (const node of inPhase) {
      if (node === project || OPTIONAL_NODES.has(node.id)) continue;
      if (!reachable.has(node.id)) problems.push(`${project.id}: the phase game does not build on ${node.id}`);
    }
    if (project.order !== inPhase[inPhase.length - 1].order) {
      problems.push(`${project.id}: the phase game must be the last node of its phase`);
    }
  }

  return problems;
}

export function assertValidGraph(graph: Graph): void {
  const problems = validateGraph(graph);
  if (problems.length > 0) {
    throw new Error(`The curriculum graph has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  }
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function findCycle(graph: Graph): string[] | null {
  const state = new Map<string, "visiting" | "done">();
  const stack: string[] = [];
  const visit = (id: string): string[] | null => {
    const mark = state.get(id);
    if (mark === "done") return null;
    if (mark === "visiting") return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, "visiting");
    stack.push(id);
    for (const prereq of graph.byId.get(id)?.prereqs ?? []) {
      if (!graph.byId.has(prereq)) continue;
      const found = visit(prereq);
      if (found) return found;
    }
    stack.pop();
    state.set(id, "done");
    return null;
  };
  for (const node of graph.nodes) {
    const found = visit(node.id);
    if (found) return found.reverse();
  }
  return null;
}

/** Every node that `id` depends on, directly or through other prerequisites. */
export function ancestors(graph: Graph, id: string): Set<string> {
  const found = new Set<string>();
  const queue = [...(graph.byId.get(id)?.prereqs ?? [])];
  while (queue.length > 0) {
    const next = queue.pop()!;
    if (found.has(next)) continue;
    found.add(next);
    queue.push(...(graph.byId.get(next)?.prereqs ?? []));
  }
  return found;
}

/**
 * Prerequisite edges with the redundant ones removed: an edge a → c is dropped when
 * c also depends on a through some other prerequisite. This keeps the map readable
 * while saying exactly the same thing about order.
 */
export function reducedPrerequisites(graph: Graph): CurriculumEdge[] {
  return graph.edges.filter((edge) => {
    if (edge.type !== "prerequisite") return false;
    const node = graph.byId.get(edge.to);
    if (!node) return false;
    return !node.prereqs.some((other) => other !== edge.from && ancestors(graph, other).has(edge.from));
  });
}

/** The nodes that list `id` as a prerequisite. */
export function dependants(graph: Graph, id: string): CurriculumNode[] {
  return graph.nodes.filter((node) => node.prereqs.includes(id));
}

export interface RelatedNode {
  node: CurriculumNode;
  note: string;
}

/** Related nodes in either direction, with the note that explains each connection. */
export function relatedTo(graph: Graph, id: string): RelatedNode[] {
  const result: RelatedNode[] = [];
  for (const edge of graph.edges) {
    if (edge.type !== "related" || !edge.note) continue;
    const other = edge.from === id ? edge.to : edge.to === id ? edge.from : null;
    const node = other ? graph.byId.get(other) : undefined;
    if (node) result.push({ node, note: edge.note });
  }
  return result.sort((a, b) => a.node.order - b.node.order);
}

/** The checked curriculum. Importing it anywhere fails loudly if the graph is invalid. */
export const GRAPH: Graph = buildGraph();
assertValidGraph(GRAPH);
