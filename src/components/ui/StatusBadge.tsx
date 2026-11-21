import type { ReactNode } from "react";
import { Pill, type PillTone } from "./Pill";

export type Status = "active" | "complete" | "progress" | "pending" | "failed" | "paused" | "new";

const STATUS: Record<Status, [tone: PillTone, icon: "check" | "clock" | "lock" | "dot" | undefined, label: string]> = {
  active: ["success", "dot", "Active"],
  complete: ["success", "check", "Complete"],
  progress: ["accent", "dot", "In progress"],
  pending: ["accent", "clock", "Pending"],
  failed: ["danger", undefined, "Failed"],
  paused: ["muted", "lock", "Paused"],
  new: ["neutral", undefined, "New"],
};

/** A status as a family pill. The text always carries the meaning; the icon only reinforces it. */
export function StatusBadge({ status = "active", children }: { status?: Status; children?: ReactNode; className?: string }) {
  const [tone, icon, label] = STATUS[status];
  return (
    <Pill tone={tone} icon={icon}>
      {children ?? label}
    </Pill>
  );
}
