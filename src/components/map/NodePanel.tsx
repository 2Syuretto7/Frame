"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { StatusBadge, Tag, type Status } from "@/components/midnight";
import { STATE_LABELS, type NodeState } from "@/curriculum/status";
import { KIND_LABELS, TRACK_LABELS } from "@/curriculum/types";
import type { MapData, MapNode } from "./types";

export const BADGE_FOR_STATE: Record<NodeState, Status> = {
  locked: "paused",
  available: "new",
  learning: "progress",
  learnt: "complete",
  review: "pending",
};

interface NodePanelProps {
  data: MapData;
  node: MapNode;
  onSelect(id: string): void;
  onClose(): void;
}

/** Everything about one node: its goal, what it builds on, where it leads, and your history. */
export function NodePanel({ data, node, onSelect, onClose }: NodePanelProps) {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const view = data.views[node.id] ?? { state: "locked" as const, mastery: 0 };
  const phase = data.phases.find((p) => p.number === node.phase);

  const noteFor = (from: string, to: string) =>
    data.edges.find((e) => e.type === "prerequisite" && e.from === from && e.to === to)?.note ?? null;
  const buildsOn = node.prereqs.map((id) => ({ node: byId.get(id)!, note: noteFor(id, node.id) }));
  const leadsTo = data.nodes
    .filter((n) => n.prereqs.includes(node.id))
    .map((n) => ({ node: n, note: noteFor(node.id, n.id) }));
  const related = data.edges
    .filter((e) => e.type === "related" && (e.from === node.id || e.to === node.id))
    .map((e) => ({ node: byId.get(e.from === node.id ? e.to : e.from)!, note: e.note }))
    .sort((a, b) => a.node.order - b.node.order);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Tag>{`Phase ${node.phase}`}</Tag>
          <Tag>{TRACK_LABELS[node.track]}</Tag>
          {node.kind !== "concept" ? <Tag>{KIND_LABELS[node.kind]}</Tag> : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mds-btn mds-btn-ghost -mt-2 -mr-2 h-11 w-11 flex-none justify-center !px-0 text-ink-faint hover:text-ink"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="eyebrow m-0 text-ink-faint">{node.id}</p>
        <h2 className="heading-2 m-0 text-ink">{node.title}</h2>
        <div>
          <StatusBadge status={BADGE_FOR_STATE[view.state]}>{STATE_LABELS[view.state]}</StatusBadge>
        </div>
        <p className="body m-0 text-ink-secondary">{node.goal}.</p>
        <p className="caption m-0 text-ink-faint">
          {`About ${node.sessions} ${node.sessions === 1 ? "session" : "sessions"}`}
          {phase ? ` · ${phase.title}, weeks ${phase.weeks}` : ""}
        </p>
      </div>

      <LinkList title="Builds on" empty="Nothing. This is where the year begins." items={buildsOn} onSelect={onSelect} />
      <LinkList title="Leads to" empty="Nothing directly. This is where the path ends." items={leadsTo} onSelect={onSelect} />
      {related.length > 0 ? (
        <LinkList title="Connects with" empty="" items={related} onSelect={onSelect} />
      ) : null}

      <section className="flex flex-col gap-2">
        <h3 className="small m-0 text-ink">Your history</h3>
        <p className="caption m-0 text-ink-faint">
          Nothing yet. Once daily sessions begin, your practice and reviews on this idea appear here.
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="small m-0 text-ink">Lesson</h3>
        {data.lessonIds.includes(node.id) ? (
          <div>
            <Link href={`/learn/${node.id}`} className="mds-btn mds-btn-secondary">
              Open the lesson
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <p className="caption m-0 text-ink-faint">This lesson is still being written. It will be ready before you reach it.</p>
        )}
      </section>
    </div>
  );
}

function LinkList({
  title,
  empty,
  items,
  onSelect,
}: {
  title: string;
  empty: string;
  items: { node: MapNode; note: string | null }[];
  onSelect(id: string): void;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="small m-0 text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="caption m-0 text-ink-faint">{empty}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {items.map(({ node, note }) => (
            <li key={node.id} className="border-t border-line first:border-t-0">
              <button
                type="button"
                onClick={() => onSelect(node.id)}
                className="flex min-h-11 w-full flex-col items-start gap-1 bg-transparent py-3 text-left text-ink hover:text-accent"
              >
                <span className="small">
                  <span className="eyebrow mr-2 text-ink-faint">{node.id}</span>
                  {node.title}
                </span>
                {note ? <span className="caption text-ink-faint">{note}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
