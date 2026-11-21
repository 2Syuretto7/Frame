import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { Pill } from "@/components/ui/Pill";
import { ROW_PILL, rowState } from "@/components/map/states";
import { dependants, GRAPH, PHASES } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { TRACK_LABELS } from "@/curriculum/types";
import { LESSON_IDS } from "@/lessons";
import type { Lesson } from "@/lessons/types";
import { LeadsTo } from "./LeadsTo";
import { LessonRail } from "./LessonRail";
import { WorkedExample } from "./WorkedExample";

/** The family's lesson sections, as Polymath teaches them. */
const SECTIONS = [
  { id: "puzzle", label: "Puzzle" },
  { id: "intuition", label: "Intuition" },
  { id: "theory", label: "Theory" },
  { id: "practice", label: "Practice" },
  { id: "connections", label: "Connections" },
];

const PRACTICE_KINDS = [
  ["Theory", "Reason, calculate, choose and justify."],
  ["Code-reading", "Predict, trace, spot the bug and explain a snippet."],
  ["Code-writing", "Write code that makes the live preview behave."],
] as const;

/** A lesson in the family layout: the section rail on the left, one reading column beside it. */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const node = GRAPH.byId.get(lesson.id)!;
  const phase = PHASES.find((p) => p.number === node.phase)!;
  const prereqs = node.prereqs.map((id) => GRAPH.byId.get(id)!);
  const next = dependants(GRAPH, node.id);
  const index = LESSON_IDS.indexOf(lesson.id);
  const previousId = index > 0 ? LESSON_IDS[index - 1] : null;
  const nextId = index < LESSON_IDS.length - 1 ? LESSON_IDS[index + 1] : null;
  // Progress is not recorded yet, so the idea shows its starting state.
  const [label, tone, icon] = ROW_PILL[rowState(deriveStates(GRAPH, new Map())[node.id].state, true)];
  const sessions = `About ${node.sessions} ${node.sessions === 1 ? "session" : "sessions"}`;
  const step = (id: string) => (
    <span className="step-chip" aria-hidden="true">
      {String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, "0")}
    </span>
  );

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span />
      </div>
      <div className="lesson-layout">
        <LessonRail sections={SECTIONS} meta={`${sessions}, in weeks ${phase.weeks}`} />
        <main id="main" className="lesson">
          <header className="lesson-head">
            <Link href={`/map/phase-${phase.number}#${node.track}`} className="back">
              <ArrowLeft size={14} /> {`Phase ${phase.number}: ${phase.title}`}
            </Link>
            <p className="eyebrow">{`Lesson ${node.id} · ${TRACK_LABELS[node.track]}`}</p>
            <h1 className="lesson-title">{node.title}</h1>
            <p className="lede">{`${node.goal}.`}</p>
            <p className="lesson-meta">
              <Pill tone={tone} icon={icon}>
                {label}
              </Pill>
              <span>{sessions}</span>
              <span>{`Weeks ${phase.weeks}`}</span>
            </p>
          </header>

          <section id="puzzle" className="lesson-section">
            <h2>{step("puzzle")}Puzzle</h2>
            <div className="prose">{lesson.problem}</div>
          </section>

          <section id="intuition" className="lesson-section">
            <h2>{step("intuition")}Intuition</h2>
            <div className="prose">{lesson.idea}</div>
            <div className="lesson-play">
              {lesson.play.diagrams}
              <div>
                <p className="eyebrow">Try this and notice</p>
                <ul className="lesson-bullets">
                  {lesson.play.prompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="theory" className="lesson-section">
            <h2>{step("theory")}Theory</h2>
            <p className="section-lede">{lesson.example.intro}</p>
            <WorkedExample
              code={lesson.example.code}
              predict={lesson.example.predict}
              steps={lesson.example.steps}
              output={lesson.example.output}
            />
            <h3 className="lesson-subhead">The honest corner</h3>
            <div className="prose">{lesson.honest}</div>
          </section>

          <section id="practice" className="lesson-section">
            <h2>{step("practice")}Practice</h2>
            <div className="prose">
              <p>{lesson.build}</p>
            </div>
            <div className="connections">
              {PRACTICE_KINDS.map(([title, text]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p className="hint">{text}</p>
                </div>
              ))}
            </div>
            <p className="section-lede lesson-after">
              Before you build, check yourself against the diagrams and the worked example above.
            </p>
          </section>

          <section id="connections" className="lesson-section">
            <h2>{step("connections")}Connections</h2>
            <div className="connections">
              <div>
                <h3>Builds on</h3>
                {prereqs.length === 0 ? (
                  <p className="hint">Nothing. This is the first idea of the year, and it assumes no programming.</p>
                ) : (
                  <ul className="plain-list">
                    {prereqs.map((p) => (
                      <li key={p.id}>
                        {LESSON_IDS.includes(p.id) ? (
                          <Link href={`/learn/${p.id}`}>{p.title}</Link>
                        ) : (
                          <span>{p.title}</span>
                        )}{" "}
                        <span className="muted">{`· ${p.id}`}</span>
                        <p className="hint">{lesson.comesFrom[p.id] ?? p.goal}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <h3 className="lesson-subhead">Where this leads</h3>
            <LeadsTo node={node} next={next} lessonIds={LESSON_IDS} />
          </section>

          <nav aria-label="Lessons" className="lesson-nav">
            {previousId ? (
              <Link href={`/learn/${previousId}`} className="btn btn-ghost">
                <ArrowLeft size={14} />
                {`${previousId} ${GRAPH.byId.get(previousId)!.title}`}
              </Link>
            ) : (
              <Link href={`/map/phase-${phase.number}`} className="btn btn-ghost">
                <ArrowLeft size={14} />
                {`Phase ${phase.number}`}
              </Link>
            )}
            {nextId ? (
              <Link href={`/learn/${nextId}`} className="btn btn-primary">
                {`Start ${nextId}: ${GRAPH.byId.get(nextId)!.title}`}
                <ArrowRight size={14} />
              </Link>
            ) : null}
          </nav>
        </main>
      </div>
    </>
  );
}
