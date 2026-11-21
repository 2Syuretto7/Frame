import { ArrowRight } from "lucide-react";
import { Button } from "@/components/midnight";
import { Greeting } from "@/components/frame/Greeting";
import { Page } from "@/components/frame/Page";
import { PhaseProgress } from "@/components/frame/PhaseProgress";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { LEARNER_NAME } from "@/lib/learner";

/** Home: a short greeting, a quiet indication of progress, and the single Learn button. */
export default function Home() {
  const phase = PHASES[0];
  const total = GRAPH.nodes.filter((n) => n.phase === phase.number).length;
  return (
    <Page>
      <section className="flex flex-1 flex-col justify-center gap-12 pb-24">
        <Greeting name={LEARNER_NAME} />
        <PhaseProgress phase={phase.number} title={phase.title} learnt={0} total={total} />
        <div>
          <Button href="/learn" variant="primary">
            Learn
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </section>
    </Page>
  );
}
