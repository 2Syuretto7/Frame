import type { MapLayout } from "@/curriculum/layout";
import type { NodeView } from "@/curriculum/status";
import type { CurriculumEdge, NodeKind, PhaseInfo, Track } from "@/curriculum/types";

/** The parts of a node the map needs. Generation briefs stay on the server. */
export interface MapNode {
  id: string;
  title: string;
  phase: number;
  track: Track;
  kind: NodeKind;
  goal: string;
  sessions: number;
  order: number;
  prereqs: string[];
}

export interface MapData {
  nodes: MapNode[];
  edges: CurriculumEdge[];
  phases: PhaseInfo[];
  layout: MapLayout;
  views: Record<string, NodeView>;
}
