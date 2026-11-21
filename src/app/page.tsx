import { ArrowRight } from "lucide-react";
import { Button } from "@/components/midnight";
import { Greeting } from "@/components/frame/Greeting";
import { Page } from "@/components/frame/Page";
import { PhaseProgress } from "@/components/frame/PhaseProgress";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { nextLesson } from "@/lessons/next";
import { LEARNER_NAME } from "@/lib/learner";

/** Home: a short greeting, your progress through the phase, and one button straight into the next lesson. */
export default function Home() {
  // Progress is not recorded yet, so every idea shows its starting state.
  const views = deriveStates(GRAPH, new Map());
  const next = nextLesson(views);
  const phase = PHASES.find((p) => p.number === GRAPH.byId.get(next.id)!.phase) ?? PHASES[0];
  const members = GRAPH.nodes.filter((n) => n.phase === phase.number);
  const learnt = members.filter((n) => ["learnt", "review"].includes(views[n.id]?.state)).length;

  return (
    <Page>
      <section className="flex flex-1 flex-col justify-center gap-12 pb-24">
        <Greeting name={LEARNER_NAME} />
        <PhaseProgress phase={phase.number} title={phase.title} learnt={learnt} total={members.length} />
        <div className="flex flex-col items-start gap-3">
          <Button href={`/learn/${next.id}`} variant="primary">
            {`${next.started ? "Continue" : "Start"} ${next.id}: ${next.title}`}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </section>
    </Page>
  );
}
