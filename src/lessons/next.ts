import { GRAPH } from "@/curriculum/graph";
import type { NodeView } from "@/curriculum/status";
import { LESSON_IDS } from "./index";

export interface NextLesson {
  id: string;
  title: string;
  /** True when you have already started it. */
  started: boolean;
}

/**
 * The lesson the home page's primary button opens: the first idea, in teaching
 * order, that you are part-way through, or else the first one ready to start.
 */
export function nextLesson(views: Record<string, NodeView>): NextLesson {
  const ordered = [...GRAPH.nodes].sort((a, b) => a.order - b.order).filter((n) => LESSON_IDS.includes(n.id));
  const pick =
    ordered.find((n) => views[n.id]?.state === "learning") ??
    ordered.find((n) => views[n.id]?.state === "available") ??
    ordered.find((n) => views[n.id]?.state !== "learnt") ??
    ordered[0];
  return {
    id: pick.id,
    title: pick.title,
    started: views[pick.id]?.state === "learning",
  };
}
