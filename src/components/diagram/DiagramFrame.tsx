import type { ReactNode } from "react";
import { cx } from "@/components/ui/cx";

export interface DiagramFrameProps {
  title: string;
  /** A plain description of what the diagram shows, for everyone and for screen readers. */
  description: string;
  children: ReactNode;
  controls?: ReactNode;
  className?: string;
}

/** The frame every lesson diagram sits in: the family diagram ground, hairline and labels. */
export function DiagramFrame({ title, description, children, controls, className }: DiagramFrameProps) {
  return (
    <figure
      className={cx("m-0 flex flex-col overflow-hidden rounded-card border border-diagram-line bg-diagram", className)}
    >
      <div className="flex flex-col gap-1 border-b border-diagram-line px-4 py-3">
        <span className="eyebrow text-diagram-ink">{title.toUpperCase()}</span>
        <figcaption className="caption text-ink-faint">{description}</figcaption>
      </div>
      <div className="p-4">{children}</div>
      {controls ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-diagram-line px-4 py-3">{controls}</div>
      ) : null}
    </figure>
  );
}
