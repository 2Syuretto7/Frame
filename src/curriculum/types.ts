/**
 * The shape of Frame's curriculum. The graph itself lives in the phase files
 * beside this one and is reviewed like code; `graph.ts` assembles and checks it.
 */

export type Track = "programming" | "maths" | "systems" | "design";
export type NodeKind = "concept" | "skill" | "project";
export type Strand = "theory" | "reading" | "writing";

/** The kinds of practice item the generator can produce. */
export type ItemType =
  | "numeric" // theory: calculate a value
  | "choice" // theory: multiple choice, with a reason for each option
  | "order" // theory: put steps or values in order
  | "predict" // reading: commit to what a snippet prints or draws
  | "trace" // reading: fill in a table of variables line by line
  | "find-bug" // reading: point to the faulty line and say what goes wrong
  | "explain" // reading: say what a specific snippet does and why
  | "complete" // writing: finish a function so its checks pass
  | "write" // writing: write a function from a description and checks
  | "preview" // writing: make the live preview behave as described
  | "fix" // writing: repair broken code so its checks pass
  | "milestone"; // project: one step of a phase game, with checks

export interface GenerationBrief {
  /** The ideas every item on this node should exercise between them. */
  keyIdeas: string[];
  /** Mistaken ideas worth probing for, and that the tutor watches for. */
  misconceptions: string[];
  /** The item types that suit this node, roughly in order of usefulness. */
  itemTypes: ItemType[];
  /** Dimensions along which two items can genuinely differ, with example values. */
  variationAxes: Record<string, string[]>;
}

export interface RelatedLink {
  to: string;
  /** One line on how the two ideas connect. */
  note: string;
}

/** A node as authored in a phase file. The phase comes from the id. */
export interface NodeSource {
  id: string;
  title: string;
  track: Track;
  kind: NodeKind;
  /** One testable goal, phrased as what you will be able to do. */
  goal: string;
  /** Estimated sessions of 45 to 60 minutes. */
  sessions: number;
  prereqs: string[];
  links: RelatedLink[];
  brief: GenerationBrief;
}

export interface CurriculumNode extends NodeSource {
  phase: number;
  /** Position in teaching order across the whole graph, from 0. */
  order: number;
}

export type EdgeType = "prerequisite" | "related";

export interface CurriculumEdge {
  from: string;
  to: string;
  type: EdgeType;
  note: string | null;
}

export interface PhaseInfo {
  number: number;
  title: string;
  weeks: string;
  game: string;
  summary: string;
}

export const TRACK_LABELS: Record<Track, string> = {
  programming: "Programming",
  maths: "Maths",
  systems: "Game systems",
  design: "Design and craft",
};

export const KIND_LABELS: Record<NodeKind, string> = {
  concept: "Concept",
  skill: "Skill",
  project: "Project",
};
