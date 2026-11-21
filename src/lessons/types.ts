import type { ReactNode } from "react";

export interface WorkedStep {
  /** Zero-based lines of the example this step is about. */
  lines: number[];
  text: string;
}

/**
 * One lesson, in Frame's seven-part shape. Parts 2 and 7 are partly built from the
 * graph: the prerequisites and the ideas that follow are filled in automatically.
 */
export interface Lesson {
  id: string;
  /** 1. A small, concrete situation in a game that you cannot yet handle. */
  problem: ReactNode;
  /** 2. A short recap of each prerequisite, keyed by its node id. */
  comesFrom: Record<string, string>;
  /** 3. Plain words, then an analogy, then the precise version. */
  idea: ReactNode;
  /** 4. Interactive diagrams, with "try this and notice" prompts. */
  play: { diagrams: ReactNode[]; prompts: string[] };
  /** 5. One small, complete example worked step by step. */
  example: {
    intro: string;
    code: string;
    /** The question to answer before revealing the output. */
    predict: string;
    steps: WorkedStep[];
    /** What the code prints, checked against the real code by a unit test. */
    output: string[];
  };
  /** 6. What is subtle, where people go wrong, and what has been simplified. */
  honest: ReactNode;
  /** 7. What the practice for this idea will ask you to build. */
  build: string;
}
