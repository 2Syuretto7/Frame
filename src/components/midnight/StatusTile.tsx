import type { ReactNode } from "react";
import { cx } from "./cx";
import { StatusBadge, type Status } from "./StatusBadge";

export interface StatusTileProps {
  name: string;
  type?: string;
  status?: Status;
  icon?: ReactNode;
  /** Outlines the tile in the accent colour: the item currently in focus. */
  active?: boolean;
  className?: string;
}

/** Midnight StatusTile: one item in an overview grid, with name, type and status. */
export function StatusTile({ name, type, status, icon, active, className }: StatusTileProps) {
  return (
    <div className={cx("mds-tile", active && "mds-tile-active", className)}>
      <span className="mds-tile-icon" aria-hidden="true">
        {icon ?? (name || "?").charAt(0)}
      </span>
      <span className="mds-tile-text">
        <span className="mds-tile-name">{name}</span>
        <span className="mds-tile-type">{type}</span>
      </span>
      {status ? <StatusBadge status={status} /> : null}
    </div>
  );
}
