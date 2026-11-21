import type { ReactNode } from "react";
import { cx } from "./cx";

export type Status = "active" | "complete" | "progress" | "pending" | "failed" | "paused" | "new";

const STATUS: Record<Status, [tone: string, label: string]> = {
  active: ["success", "Active"],
  complete: ["success", "Complete"],
  progress: ["accent", "In progress"],
  pending: ["warning", "Pending"],
  failed: ["error", "Failed"],
  paused: ["idle", "Paused"],
  new: ["new", "New"],
};

export interface StatusBadgeProps {
  status?: Status;
  /** Overrides the default label. The text always carries the meaning; the dot only reinforces it. */
  children?: ReactNode;
  className?: string;
}

/** Midnight StatusBadge: a 20px chip with a 6px dot in the status colour on its soft ground. */
export function StatusBadge({ status = "active", children, className }: StatusBadgeProps) {
  const [tone, label] = STATUS[status];
  return (
    <span className={cx("mds-badge", `mds-badge-${tone}`, className)}>
      {tone === "new" ? null : <span className="mds-badge-dot" aria-hidden="true" />}
      {children ?? label}
    </span>
  );
}
