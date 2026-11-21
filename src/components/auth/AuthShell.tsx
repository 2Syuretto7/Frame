import type { ReactNode } from "react";
import { Page } from "@/components/frame/Page";

/** A narrow, centred column for the sign-in, setup and reset pages. */
export function AuthShell({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <Page signedIn={false}>
      <section className="flex w-full max-w-[560px] flex-1 flex-col justify-center gap-8 py-12">
        <header className="flex flex-col gap-3">
          <h1 className="heading-2 m-0 text-ink">{title}</h1>
          {lead ? <p className="lead m-0 text-ink-secondary">{lead}</p> : null}
        </header>
        {children}
      </section>
    </Page>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-line bg-raised p-4 text-ink-secondary">{children}</div>;
}

export function FormSkeleton() {
  return <div className="h-40 rounded-card border border-line" aria-hidden="true" />;
}
