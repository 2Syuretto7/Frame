import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { RevealText } from "@/components/ui/RevealText";
import { Pill } from "@/components/ui/Pill";
import { ArrowRight, ChevronRight } from "@/components/ui/Icons";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { nextLesson } from "@/lessons/next";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Home, as in Frontier and Polymath: the name, one button to the next lesson, what is up next, and the numbers. */
export default function Home() {
  // Progress is not recorded yet, so every idea shows its starting state.
  const views = deriveStates(GRAPH, new Map());
  const next = nextLesson(views);
  const node = GRAPH.byId.get(next.id)!;
  const phase = PHASES.find((p) => p.number === node.phase)!;
  const total = GRAPH.nodes.length;
  const learnt = GRAPH.nodes.filter((n) => ["learnt", "review"].includes(views[n.id]?.state)).length;
  const started = GRAPH.nodes.filter((n) => views[n.id]?.state === "learning").length;
  const lede =
    learnt === 0
      ? `${fmt(total)} ideas, from your first line of code to games you design and ship yourself, taught one at a time in the order they build on each other.`
      : `${fmt(learnt)} of ${fmt(total)} ideas learnt. The button below always opens the best next step.`;

  return (
    <div className="shell">
      <TopBar />
      <main id="main" className="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow fade-up">A personal university · Game development</p>
            <h1 id="hero-title" className="display">
              <RevealText text="Frame" delay={120} />
            </h1>
            <p className="hero-lede fade-up" style={{ animationDelay: "260ms" }}>
              {lede}
            </p>
            <div className="hero-actions fade-up" style={{ animationDelay: "340ms" }}>
              <Link href={`/learn/${node.id}`} className="btn btn-primary btn-lg learn">
                {`${next.started ? "Continue" : "Start"} ${node.id}: ${node.title}`}{" "}
                <span className="chev">
                  <ChevronRight />
                </span>
              </Link>
              <Link href="/map" className="text-link">
                Browse the map <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <aside className="next-panel fade-up" style={{ animationDelay: "420ms" }} aria-label="Up next">
            <div className="panel-bar">
              <span className="mono-tag">Up next</span>
              {next.started ? (
                <Pill tone="success" icon="dot">
                  In progress
                </Pill>
              ) : (
                <Pill tone="accent" icon="dot">
                  New lesson
                </Pill>
              )}
            </div>
            <div className="next-body">
              <p className="next-title">{next.title}</p>
              <p className="next-meta">{`Phase ${phase.number}, ${phase.title} · About ${node.sessions} ${node.sessions === 1 ? "session" : "sessions"}`}</p>
            </div>
            <div className="panel-foot">
              <span className="mono-meta">{`phase ${phase.number} / ${next.id}`}</span>
              <span className="next-progress" aria-hidden="true">
                <span />
              </span>
            </div>
          </aside>
        </section>

        <section className="stats" aria-label="Progress">
          <Stat
            label="Learnt"
            value={fmt(learnt)}
            note={
              learnt === 0
                ? "The first one is the hardest"
                : `${((learnt / total) * 100).toFixed(1)} percent of the year`
            }
          />
          <Stat label="In progress" value={fmt(started)} note="Started, not yet learnt" />
          <Stat label="Ideas" value={fmt(total)} note="From first program to shipped game" />
          <Stat label="Phases" value={fmt(PHASES.length)} note="Each one ends in a game" />
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="stat">
      <p className="eyebrow">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-note">{note}</p>
    </div>
  );
}
