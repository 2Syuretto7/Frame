import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Tag } from "@/components/midnight";
import { Page } from "@/components/frame/Page";

export const metadata: Metadata = { title: "Learn" };

/** Placeholder until the session planner arrives in Milestone 7. */
export default function LearnPage() {
  return (
    <Page>
      <section className="flex max-w-[640px] flex-1 flex-col justify-center gap-6 pb-24">
        <div>
          <Tag>Milestone 7</Tag>
        </div>
        <h1 className="heading-2 m-0 text-ink">Your first session is on its way</h1>
        <p className="lead m-0 text-ink-secondary">
          This button will soon look at what is due for review, what you have just unlocked and where you
          left off, and give you one focused session. It arrives with Milestone 7, after accounts, the
          curriculum, lessons, the code editor and fresh practice are in place.
        </p>
        <p className="body m-0 text-ink-secondary">
          The first lessons are ready to read now, with diagrams you can play with.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/learn/1.01" variant="secondary">
            Start with 1.01 Programs and output
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Button href="/" variant="ghost">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            Back home
          </Button>
        </div>
      </section>
    </Page>
  );
}
