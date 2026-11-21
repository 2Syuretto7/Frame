import type { ReactNode } from "react";
import { AuthFrame } from "@/components/shell/AuthFrame";

/** The sign-in, setup and reset pages: the family's signed-out frame with one card. */
export function AuthShell({
  eyebrow,
  title,
  lead,
  foot,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AuthFrame>
      <div className="card">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="lede">{lead}</p> : null}
        {children}
        {foot ? <p className="foot">{foot}</p> : null}
      </div>
    </AuthFrame>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="error">{children}</p>;
}

export function FormSkeleton() {
  return <div className="h-40" aria-hidden="true" />;
}
