import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: filled, once per view. secondary: hairline outline. ghost: quiet. danger: sign-outs and deletions. */
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Renders a link instead of a button. Internal paths use Next.js client navigation. */
  href?: string;
  children?: ReactNode;
}

/** The family button: 40px tall, 2px corners, 15px/500 label. */
export function Button({ variant = "primary", size = "md", href, className, children, type, ...rest }: ButtonProps) {
  const cls = cx(
    "btn",
    variant === "secondary" ? null : `btn-${variant}`,
    size === "md" ? null : `btn-${size}`,
    className,
  );
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
