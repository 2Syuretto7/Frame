import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: inverse fill with the navy wipe on hover, once per view. secondary: outlined. ghost: navigation. */
  variant?: ButtonVariant;
  /** Renders a link instead of a button. Internal paths use Next.js client navigation. */
  href?: string;
  children?: ReactNode;
}

/** Midnight Button: 40px tall, 2px corners, 16px/500 sentence-case label. */
export function Button({ variant = "primary", href, className, children, type, ...rest }: ButtonProps) {
  const cls = cx("mds-btn", `mds-btn-${variant}`, className);
  if (href) {
    const ariaLabel = rest["aria-label"];
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={cls} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}
