import { ArrowRight } from "lucide-react";
import { Button } from "@/components/midnight";
import { Greeting } from "@/components/frame/Greeting";
import { Page } from "@/components/frame/Page";
import { PhaseProgress } from "@/components/frame/PhaseProgress";
import { LEARNER_NAME, PHASES } from "@/lib/curriculum";

/** Home: a short greeting, a quiet indication of progress, and the single Learn button. */
export default function Home() {
  const phase = PHASES[0];
  return (
    <Page>
      <section className="flex flex-1 flex-col justify-center gap-12 pb-24">
        <Greeting name={LEARNER_NAME} />
        <PhaseProgress phase={phase.number} title={phase.title} learnt={0} total={phase.nodeCount} />
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
