import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/frame/Page";
import { ROW_PILL, rowState } from "@/components/map/states";
import { ArrowLeft } from "@/components/ui/Icons";
import { Pill } from "@/components/ui/Pill";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { TRACK_LABELS, type CurriculumNode, type Track } from "@/curriculum/types";
import { LESSON_IDS } from "@/lessons";

const TRACKS: Track[] = ["programming", "maths", "systems", "design"];

function phaseFor(slug: string) {
  const match = /^phase-(\d)$/.exec(slug);
  return match ? PHASES.find((p) => p.number === Number(match[1])) : undefined;
}

export function generateStaticParams() {
  return PHASES.map((p) => ({ phase: `phase-${p.number}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ phase: string }> }): Promise<Metadata> {
  const { phase } = await params;
  const info = phaseFor(phase);
  return { title: info ? `Phase ${info.number}: ${info.title}` : "Phase" };
}

/** One phase of the curriculum, laid out like a family course page: its ideas by track, then its game. */
export default async function PhasePage({ params }: { params: Promise<{ phase: string }> }) {
  const { phase: slug } = await params;
  const phase = phaseFor(slug);
  if (!phase) notFound();

  // Progress is not recorded yet, so every idea shows its starting state.
  const views = deriveStates(GRAPH, new Map());
  const members = GRAPH.nodes.filter((n) => n.phase === phase.number);
  const game = members.find((n) => n.kind === "project" && /^(Game|Capstone)/.test(n.title));
  const learnt = members.filter((n) => ["learnt", "review"].includes(views[n.id].state)).length;
  const written = members.filter((n) => LESSON_IDS.includes(n.id)).length;
  const previous = PHASES.find((p) => p.number === phase.number - 1);
  const following = PHASES.find((p) => p.number === phase.number + 1);

  const phaseLink = (n: number, title: string) => (
    <Link href={`/map/phase-${n}`} className="chip">
      <span className="mono-meta">{`Phase ${n}`}</span>
      {title}
    </Link>
  );

  const rows = (nodes: CurriculumNode[]) => (
    <ol className="lesson-list">
      {nodes.map((n) => {
        const written = LESSON_IDS.includes(n.id);
        const state = rowState(views[n.id].state, written);
        const [label, tone, icon] = ROW_PILL[state];
        const open = written && state !== "locked";
        return (
          <li key={n.id} className={`lesson-row is-${state}`}>
            <span className="mono-meta">{n.id}</span>
            {open ? <Link href={`/learn/${n.id}`}>{n.title}</Link> : <span>{n.title}</span>}
            <Pill tone={tone} icon={icon}>
              {label}
            </Pill>
          </li>
        );
      })}
    </ol>
  );

  return (
    <Page>
      <Link href="/map" className="back">
        <ArrowLeft size={14} /> Map
      </Link>
      <p className="eyebrow">{`Phase ${phase.number} · Weeks ${phase.weeks}`}</p>
      <h1>{phase.title}</h1>
      <p className="lede">{phase.summary}</p>
      <div className="map-summary">
        <div>
          <p className="eyebrow">Ideas</p>
          <p>{members.length}</p>
        </div>
        <div>
          <p className="eyebrow">Learnt</p>
          <p>{learnt}</p>
        </div>
        <div>
          <p className="eyebrow">Written so far</p>
          <p>{written}</p>
        </div>
      </div>
      {(previous || following) && (
        <div className="course-links">
          {previous && (
            <div>
              <span className="muted">Builds on</span> {phaseLink(previous.number, previous.title)}
            </div>
          )}
          {following && (
            <div>
              <span className="muted">Leads to</span> {phaseLink(following.number, following.title)}
            </div>
          )}
        </div>
      )}
      {TRACKS.map((track) => {
        const nodes = members.filter((n) => n.track === track && n !== game);
        if (nodes.length === 0) return null;
        return (
          <section key={track} id={track} className="chapter">
            <h2>{TRACK_LABELS[track]}</h2>
            {rows(nodes)}
          </section>
        );
      })}
      {game && (
        <section id="game" className="chapter">
          <h2>
            <span className="mono-meta">The game</span>
            {game.title.replace(/^Game: /, "")}
          </h2>
          {rows([game])}
        </section>
      )}
    </Page>
  );
}
