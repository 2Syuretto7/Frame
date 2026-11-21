import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dependants, GRAPH, PHASES } from "@/curriculum/graph";
import { LESSON_IDS } from "@/lessons";
import type { Lesson } from "@/lessons/types";
import { LeadsTo } from "./LeadsTo";
import { LessonContents } from "./LessonContents";
import { WorkedExample } from "./WorkedExample";

const PARTS = [
  { id: "problem", title: "The problem" },
  { id: "comes-from", title: "Where this comes from" },
  { id: "idea", title: "The idea" },
  { id: "play", title: "Play with it" },
  { id: "example", title: "A worked example" },
  { id: "honest", title: "The honest corner" },
  { id: "practise", title: "Practise, then build" },
] as const;

/** A lesson in Frame's seven-part shape, so you always know where you are. */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const node = GRAPH.byId.get(lesson.id)!;
  const phase = PHASES.find((p) => p.number === node.phase)!;
  const prereqs = node.prereqs.map((id) => GRAPH.byId.get(id)!);
  const next = dependants(GRAPH, node.id);
  const index = LESSON_IDS.indexOf(lesson.id);
  const previousId = index > 0 ? LESSON_IDS[index - 1] : null;
  const nextId = index < LESSON_IDS.length - 1 ? LESSON_IDS[index + 1] : null;

  return (
    <div className="grid gap-x-12 pt-8 pb-24 lg:grid-cols-[minmax(0,1fr)_200px]">
      <header className="flex flex-col gap-3 pb-6 lg:col-start-1">
        <p className="eyebrow m-0 text-ink-secondary">{`LESSON ${node.id} · PHASE ${phase.number}`}</p>
        <h1 className="heading-1 m-0 text-ink">{node.title}</h1>
        <p className="lead m-0 max-w-[65ch] text-ink-secondary">{`${node.goal}.`}</p>
      </header>
      <aside className="row-span-2 hidden lg:col-start-2 lg:row-start-1 lg:block">
        <LessonContents items={PARTS} variant="side" />
      </aside>
      <article className="flex min-w-0 flex-col gap-16 lg:col-start-1">
        <LessonContents items={PARTS} variant="bar" />

        <Part n={1} id="problem" title="The problem">
          <div className="lesson-prose">{lesson.problem}</div>
        </Part>

        <Part n={2} id="comes-from" title="Where this comes from">
          {prereqs.length === 0 ? (
            <div className="lesson-prose">
              <p>Nothing. This is the first idea of the year, and it assumes no programming at all.</p>
            </div>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {prereqs.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 rounded-card border border-line p-4">
                  <Link
                    href={LESSON_IDS.includes(p.id) ? `/learn/${p.id}` : "/map"}
                    className="small text-ink no-underline hover:text-accent"
                  >
                    <span className="eyebrow mr-2 text-ink-secondary">{p.id}</span>
                    {p.title}
                  </Link>
                  <p className="body m-0 text-ink-secondary">{lesson.comesFrom[p.id] ?? p.goal}</p>
                </li>
              ))}
            </ul>
          )}
        </Part>

        <Part n={3} id="idea" title="The idea">
          <div className="lesson-prose">{lesson.idea}</div>
        </Part>

        <Part n={4} id="play" title="Play with it">
          <div className="flex flex-col gap-6">
            {lesson.play.diagrams}
            <div className="flex flex-col gap-2">
              <span className="eyebrow text-ink-secondary">TRY THIS AND NOTICE</span>
              <ul className="lesson-list m-0 flex flex-col gap-2 pl-5">
                {lesson.play.prompts.map((prompt) => (
                  <li key={prompt} className="body text-ink-secondary">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Part>

        <Part n={5} id="example" title="A worked example">
          <div className="flex flex-col gap-6">
            <p className="lead m-0 text-ink-secondary">{lesson.example.intro}</p>
            <WorkedExample
              code={lesson.example.code}
              predict={lesson.example.predict}
              steps={lesson.example.steps}
              output={lesson.example.output}
            />
          </div>
        </Part>

        <Part n={6} id="honest" title="The honest corner">
          <div className="lesson-prose">{lesson.honest}</div>
        </Part>

        <Part n={7} id="practise" title="Practise, then build">
          <div className="flex flex-col gap-6">
            <div className="lesson-prose">
              <p>{lesson.build}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Theory", "Reason, calculate, choose and justify."],
                ["Code-reading", "Predict, trace, spot the bug and explain a snippet."],
                ["Code-writing", "Write code that makes the live preview behave."],
              ].map(([title, text]) => (
                <div key={title} className="flex flex-col gap-1 rounded-card border border-line p-4">
                  <span className="small text-ink">{title}</span>
                  <span className="caption text-ink-secondary">{text}</span>
                </div>
              ))}
            </div>
            <p className="body m-0 text-ink-secondary">
              Practice questions for this idea are on their way, written fresh for you each time. For now, use the
              diagrams and the worked example above to check yourself.
            </p>
            <div className="flex flex-col gap-3">
              <h3 className="small m-0 text-ink">Where this leads</h3>
              <LeadsTo node={node} next={next} lessonIds={LESSON_IDS} />
            </div>
          </div>
        </Part>

        <nav aria-label="Lessons" className="flex flex-wrap justify-between gap-4 border-t border-line pt-8">
          {previousId ? (
            <Link href={`/learn/${previousId}`} className="mds-btn mds-btn-ghost">
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              {`${previousId} ${GRAPH.byId.get(previousId)!.title}`}
            </Link>
          ) : (
            <Link href="/map" className="mds-btn mds-btn-ghost">
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              Knowledge map
            </Link>
          )}
          {nextId ? (
            <Link href={`/learn/${nextId}`} className="mds-btn mds-btn-secondary">
              {`${nextId} ${GRAPH.byId.get(nextId)!.title}`}
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}

function Part({ n, id, title, children }: { n: number; id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-6 lg:scroll-mt-8" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="heading-2 m-0 border-t border-line pt-6 text-ink">
        <span className="mr-3 text-ink-secondary">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
