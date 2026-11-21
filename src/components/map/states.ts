import type { NodeState } from "@/curriculum/status";
import type { PillTone } from "@/components/ui/Pill";

export type RowState = "learnt" | "review" | "started" | "open" | "locked" | "unwritten";

/** How an idea shows in lists, following the family's lesson rows. */
export function rowState(state: NodeState, written: boolean): RowState {
  if (state === "learnt") return "learnt";
  if (state === "review") return "review";
  if (state === "learning") return "started";
  if (state === "locked") return "locked";
  return written ? "open" : "unwritten";
}

export const ROW_PILL: Record<RowState, [label: string, tone: PillTone, icon: "check" | "dot" | "lock" | "pen" | "clock" | undefined]> = {
  learnt: ["Learnt", "success", "check"],
  review: ["Review due", "warning", "clock"],
  started: ["In progress", "accent", "dot"],
  open: ["Ready", "neutral", undefined],
  locked: ["Locked", "muted", "lock"],
  unwritten: ["Being written", "muted", "pen"],
};
