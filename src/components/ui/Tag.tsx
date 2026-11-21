import type { ReactNode } from "react";
import { cx } from "./cx";

export interface TagProps {
  children: ReactNode;
  className?: string;
}

/** A mono uppercase tag in a hairline box. One or two words. */
export function Tag({ children, className }: TagProps) {
  return <span className={cx("mono-tag", className)}>{children}</span>;
}
