import type { ReactNode } from "react";
import { cx } from "./cx";

export interface TagProps {
  children: ReactNode;
  className?: string;
}

/** Midnight Tag: a mono uppercase eyebrow in an 18px hairline box. One or two words. */
export function Tag({ children, className }: TagProps) {
  return <span className={cx("mds-tag", className)}>{children}</span>;
}
