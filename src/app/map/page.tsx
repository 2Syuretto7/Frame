import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/frame/Page";
import { ArrowRight, ChevronRight } from "@/components/ui/Icons";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { TRACK_LABELS, type Track } from "@/curriculum/types";
import { LESSON_IDS } from "@/lessons";

export const metadata: Metadata = { title: "Map" };

const TRACKS: Track[] = ["programming", "maths", "systems", "design"];

/** The curriculum as the family draws it: one row per phase, its ideas by track, and the game it ends in. */
export default function MapPage() {
  // Progress is not recorded yet, so every idea shows its starting state.
  const views = deriveStates(GRAPH, new Map());
  const learnt = GRAPH.nodes.filter((n) => ["learnt", "review"].includes(views[n.id].state));

  const card = (href: string, code: string, title: string, ids: string[]) => {
    const done = ids.filter((id) => ["learnt", "review"].includes(views[id].state)).length;
    const ready = ids.filter((id) => views[id].state === "available" && LESSON_IDS.includes(id)).length;
    return (
      <Link key={href} href={href} className="course-card">
        <span className="course-code">{code}</span>
        <span className="course-title">{title}</span>
        <span className="chev">
          <ChevronRight size={14} />
        </span>
        <span className="meter" aria-hidden="true">
          <span style={{ width: `${ids.length ? (done / ids.length) * 100 : 0}%` }} />
        </span>
        <span className="course-stat">
          <span>{`${done} of ${ids.length} learnt`}</span>
          {ready > 0 ? <span className="ready">{`${ready} ready`}</span> : null}
        </span>
      </Link>
    );
  };

  return (
    <Page wide>
      <header className="page-head">
        <p className="eyebrow">The curriculum</p>
        <h1>Map</h1>
        <p className="lede">
          Six phases over a year, each ending in a game you build. Programming, maths, game systems and design grow side
          by side.
        </p>
      </header>
      <div className="map-summary">
        <div>
          <p className="eyebrow">Phases</p>
          <p>{PHASES.length}</p>
        </div>
        <div>
          <p className="eyebrow">Ideas</p>
          <p>{GRAPH.nodes.length}</p>
        </div>
        <div>
          <p className="eyebrow">Learnt</p>
          <p>{learnt.length}</p>
        </div>
      </div>
      <p className="course-links">
        <Link href="/map/graph" className="text-link">
          See how every idea connects <ArrowRight size={14} />
        </Link>
      </p>
      <div className="map-head">
        <span>Phase</span>
        <span>Ideas by track</span>
        <span>The game it ends in</span>
      </div>
      {PHASES.map((phase) => {
        const members = GRAPH.nodes.filter((n) => n.phase === phase.number);
        const game = members.find((n) => n.kind === "project" && /^(Game|Capstone)/.test(n.title));
        const ideas = members.filter((n) => n !== game);
        return (
          <section key={phase.number} className="tier" aria-labelledby={`phase-${phase.number}`}>
            <h2 className="tier-name" id={`phase-${phase.number}`}>
              <span className="mono-tag">{`Phase ${phase.number}`}</span>
              {phase.title}
            </h2>
            <div className="tier-grid">
              <div className="track">
                <p className="eyebrow track-label">Ideas by track</p>
                <div className="course-col">
                  {TRACKS.map((track) => {
                    const ids = ideas.filter((n) => n.track === track).map((n) => n.id);
                    if (ids.length === 0) return null;
                    return card(`/map/phase-${phase.number}#${track}`, `P${phase.number}`, TRACK_LABELS[track], ids);
                  })}
                </div>
              </div>
              <div className="track">
                <p className="eyebrow track-label">The game it ends in</p>
                <div className="course-col">
                  {card(
                    `/map/phase-${phase.number}#game`,
                    game?.id ?? `P${phase.number}`,
                    game ? game.title : phase.game,
                    game ? [game.id] : [],
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </Page>
  );
}
