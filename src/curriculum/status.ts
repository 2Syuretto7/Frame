import type { Graph } from "./graph";

/**
 * Where you stand on a node. Colour follows Frame's rule that colour means state:
 * idle for locked, accent for learning, success for learnt, warning for a review due.
 */
export type NodeState = "locked" | "available" | "learning" | "learnt" | "review";

export const STATE_LABELS: Record<NodeState, string> = {
  locked: "Locked",
  available: "Ready to start",
  learning: "Learning",
  learnt: "Learnt",
  review: "Review due",
};

/** What the database records about a node. Arrives with mastery tracking in Milestone 7. */
export interface NodeProgress {
  status: "learning" | "learnt";
  /** Overall mastery from 0 to 1. */
  mastery: number;
  reviewDue?: boolean;
}

export interface NodeView {
  state: NodeState;
  mastery: number;
}

/**
 * Works out every node's state from recorded progress. A node with no record
 * is ready to start once all of its prerequisites are learnt, and locked before.
 */
export function deriveStates(graph: Graph, progress: ReadonlyMap<string, NodeProgress>): Record<string, NodeView> {
  const views: Record<string, NodeView> = {};
  for (const node of graph.nodes) {
    const record = progress.get(node.id);
    if (record) {
      const state: NodeState =
        record.status === "learnt" ? (record.reviewDue ? "review" : "learnt") : "learning";
      views[node.id] = { state, mastery: clamp01(record.mastery) };
      continue;
    }
    const ready = node.prereqs.every((id) => progress.get(id)?.status === "learnt");
    views[node.id] = { state: ready ? "available" : "locked", mastery: 0 };
  }
  return views;
}

/** The step on the mastery scale, from 0 (none) to 4 (solid). */
export function masteryStep(mastery: number): 0 | 1 | 2 | 3 | 4 {
  if (mastery <= 0) return 0;
  if (mastery < 0.25) return 1;
  if (mastery < 0.5) return 2;
  if (mastery < 0.8) return 3;
  return 4;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
