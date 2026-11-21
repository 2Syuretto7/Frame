import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { reducedPrerequisites, type Graph } from "./graph";
import type { Track } from "./types";

export const NODE_WIDTH = 216;
export const NODE_HEIGHT = 64;
const BAND_HEADER = 72;
const BAND_GAP = 56;

const TRACK_ORDER: Record<Track, number> = { programming: 0, maths: 1, systems: 2, design: 3 };

export interface PlacedNode {
  id: string;
  x: number;
  y: number;
}

export interface PlacedEdge {
  from: string;
  to: string;
  /** Polyline points from the prerequisite to the node that builds on it. */
  points: [number, number][];
}

export interface PhaseBand {
  phase: number;
  y: number;
  height: number;
}

export interface MapLayout {
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  nodes: PlacedNode[];
  /** Prerequisite edges inside a phase, with redundant edges removed. Always drawn. */
  edges: PlacedEdge[];
  bands: PhaseBand[];
}

/**
 * Lays the graph out as one horizontal band per phase, each band arranged left to
 * right by ELK's layered algorithm so prerequisites sit to the left of what they unlock.
 * Prerequisites that cross phases are drawn only when a node is selected.
 */
export async function computeLayout(graph: Graph): Promise<MapLayout> {
  const elk = new ELK();
  const reduced = reducedPrerequisites(graph);
  const phases = [...new Set(graph.nodes.map((n) => n.phase))].sort((a, b) => a - b);

  const nodes: PlacedNode[] = [];
  const edges: PlacedEdge[] = [];
  const bands: PhaseBand[] = [];
  let top = 0;
  let width = 0;

  for (const phase of phases) {
    const members = graph.nodes
      .filter((n) => n.phase === phase)
      .sort((a, b) => TRACK_ORDER[a.track] - TRACK_ORDER[b.track] || a.order - b.order);
    const ids = new Set(members.map((n) => n.id));
    const inside = reduced.filter((e) => ids.has(e.from) && ids.has(e.to));

    const root: ElkNode = {
      id: `phase-${phase}`,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.layered.spacing.nodeNodeBetweenLayers": "56",
        "elk.spacing.nodeNode": "20",
        "elk.spacing.edgeNode": "16",
        "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
        "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
      },
      children: members.map((n) => ({ id: n.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
      edges: inside.map((e) => ({ id: `${e.from}>${e.to}`, sources: [e.from], targets: [e.to] })),
    };

    const result = await elk.layout(root);
    const offset = top + BAND_HEADER;
    for (const child of result.children ?? []) {
      nodes.push({ id: child.id, x: Math.round(child.x ?? 0), y: Math.round((child.y ?? 0) + offset) });
    }
    for (const e of result.edges ?? []) {
      const [from, to] = e.id.split(">");
      const points: [number, number][] = [];
      for (const section of e.sections ?? []) {
        points.push([section.startPoint.x, section.startPoint.y + offset]);
        for (const bend of section.bendPoints ?? []) points.push([bend.x, bend.y + offset]);
        points.push([section.endPoint.x, section.endPoint.y + offset]);
      }
      edges.push({ from, to, points: points.map(([x, y]) => [Math.round(x), Math.round(y)]) });
    }
    const height = BAND_HEADER + (result.height ?? 0);
    bands.push({ phase, y: Math.round(top), height: Math.round(height) });
    width = Math.max(width, result.width ?? 0);
    top += height + BAND_GAP;
  }

  return {
    width: Math.round(width),
    height: Math.round(top - BAND_GAP),
    nodeWidth: NODE_WIDTH,
    nodeHeight: NODE_HEIGHT,
    nodes,
    edges,
    bands,
  };
}
