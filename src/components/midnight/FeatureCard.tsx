import type { ReactNode } from "react";
import { cx } from "./cx";

export interface FeatureCardProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Midnight FeatureCard: an optional icon tile, an 18px/500 title and one line of description. */
export function FeatureCard({ icon, title, description, children, className }: FeatureCardProps) {
  return (
    <div className={cx("mds-card", className)}>
      {icon ? (
        <span className="mds-card-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3 className="mds-card-title">{title}</h3>
      {description ? <p className="mds-card-desc">{description}</p> : null}
      {children}
    </div>
  );
}
