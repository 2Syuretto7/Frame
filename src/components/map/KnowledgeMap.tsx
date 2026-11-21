"use client";

import { useRef, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { StatusBadge } from "@/components/midnight";
import { cx } from "@/components/midnight/cx";
import { STATE_LABELS, type NodeState } from "@/curriculum/status";
import { MapCanvas, NODE_STYLE, type MapCanvasHandle } from "./MapCanvas";
import { BADGE_FOR_STATE, NodePanel } from "./NodePanel";
import type { MapData } from "./types";

type Mode = "map" | "list";

const toolButton =
  "mds-btn mds-btn-ghost h-[46px] gap-2 border border-line bg-ground px-3 text-ink-secondary hover:text-ink";

/**
 * The knowledge map page: the whole curriculum as a map (the one full-width view in
 * Frame) or as a plain list, with a panel for the idea you choose.
 */
export function KnowledgeMap({ data }: { data: MapData }) {
  const [mode, setMode] = useState<Mode>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvas = useRef<MapCanvasHandle>(null);

  const selected = selectedId ? (data.nodes.find((n) => n.id === selectedId) ?? null) : null;

  // Bring the chosen idea into view once the panel has opened and the map has resized.
  const choose = (id: string | null) => {
    setSelectedId(id);
    if (!id || mode !== "map") return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    requestAnimationFrame(() => canvas.current?.centreOn(id, wide ? "centre" : "upper"));
  };

  const panel = selected ? (
    <NodePanel data={data} node={selected} onSelect={choose} onClose={() => setSelectedId(null)} />
  ) : null;

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="page-column flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="heading-1 m-0 text-ink">Knowledge map</h1>
          <p className="caption m-0 text-ink-secondary">
            {`${data.nodes.length} ideas in ${data.phases.length} phases. Choose an idea to see what it builds on and where it leads.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div role="tablist" aria-label="View" className="flex rounded-control border border-line p-0.5">
            {(["map", "list"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cx(
                  "small h-10 min-w-20 rounded-[2px] px-4 transition-colors",
                  mode === m
                    ? "bg-inverse text-inverse-ink"
                    : "bg-transparent text-ink-secondary hover:bg-hover hover:text-ink",
                )}
              >
                {m === "map" ? "Map" : "List"}
              </button>
            ))}
          </div>
          {mode === "map" ? (
            <div className="flex gap-2" role="group" aria-label="Zoom">
              <button type="button" className={toolButton} onClick={() => canvas.current?.zoomBy(0.8)}>
                <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
                Zoom out
              </button>
              <button type="button" className={toolButton} onClick={() => canvas.current?.zoomBy(1.25)}>
                <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                Zoom in
              </button>
              <button type="button" className={toolButton} onClick={() => canvas.current?.fit()}>
                <Maximize2 size={14} strokeWidth={1.5} aria-hidden="true" />
                Whole map
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {mode === "map" ? (
        <>
          <div
            className="relative flex overflow-hidden rounded-sheet border border-line"
            style={{ height: "max(360px, calc(100dvh - 300px))" }}
          >
            <div className="relative min-w-0 flex-1">
              <MapCanvas ref={canvas} data={data} selectedId={selectedId} onSelect={choose} />
            </div>
            {panel ? (
              <aside
                aria-label={`${selected!.id} ${selected!.title}`}
                className={cx(
                  "overflow-y-auto border-line bg-ground",
                  // Phones and tablets: a sheet over the lower part of the map.
                  "absolute inset-x-0 bottom-0 max-h-[60%] rounded-t-sheet border-t",
                  // Laptops: a column beside the map.
                  "lg:static lg:max-h-none lg:w-[380px] lg:flex-none lg:rounded-none lg:border-t-0 lg:border-l",
                )}
              >
                {panel}
              </aside>
            ) : null}
          </div>
          <div className="page-column flex flex-col gap-3">
            <p id="map-keys" className="caption m-0 text-ink-secondary">
              Drag to move, scroll or pinch to zoom. With a keyboard, press Tab to reach an idea, then use the arrow
              keys.
            </p>
            <Legend />
          </div>
        </>
      ) : (
        <div className="page-column flex items-start gap-8">
          <ListView data={data} selectedId={selectedId} onSelect={setSelectedId} />
          {panel ? (
            <aside
              aria-label={`${selected!.id} ${selected!.title}`}
              className={cx(
                "border-line bg-ground",
                // Phones and tablets: a sheet fixed to the bottom of the screen.
                "fixed inset-x-0 bottom-0 z-10 max-h-[70dvh] overflow-y-auto rounded-t-sheet border-t",
                // Laptops: a column that stays in view as the list scrolls.
                "lg:sticky lg:top-4 lg:max-h-[calc(100dvh-32px)] lg:w-[360px] lg:flex-none lg:rounded-sheet lg:border",
              )}
            >
              {panel}
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}

const LEGEND: { state: NodeState; text: string }[] = [
  { state: "available", text: "you can start it now" },
  { state: "learning", text: "you have started it" },
  { state: "review", text: "time to practise it again" },
  { state: "learnt", text: "done for now" },
  {
    state: "locked",
    text: "opens once you have learnt the ideas it builds on",
  },
];

/** What each look means, below the map so it never covers it. */
function Legend() {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0" aria-label="What the colours mean">
      {LEGEND.map(({ state, text }) => {
        const look = NODE_STYLE[state];
        return (
          <li key={state} className="caption flex items-center gap-2 text-ink-secondary">
            <svg width="20" height="14" aria-hidden="true" className="flex-none">
              <rect
                x="1"
                y="1"
                width="18"
                height="12"
                rx="2"
                fill={look.fill}
                stroke={look.stroke}
                strokeWidth={look.width}
                strokeDasharray={look.dash ? "3 2" : undefined}
              />
            </svg>
            <span>
              <span className="text-ink">{STATE_LABELS[state]}</span>
              {`: ${text}`}
            </span>
          </li>
        );
      })}
      <li className="caption flex items-center gap-2 text-ink-secondary">
        <svg width="20" height="14" aria-hidden="true" className="flex-none">
          <path d="M1,7 H15" stroke="var(--diagram-border)" strokeWidth="1.5" />
          <path d="M13,3 L19,7 L13,11 z" fill="var(--diagram-border)" />
        </svg>
        <span>
          <span className="text-ink">Arrow</span>: points to the idea that builds on it
        </span>
      </li>
    </ul>
  );
}

/** The same ideas as a list that scrolls with the page, status beside each title. */
function ListView({
  data,
  selectedId,
  onSelect,
}: {
  data: MapData;
  selectedId: string | null;
  onSelect(id: string): void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-10">
      {data.phases.map((phase) => (
        <section key={phase.number} className="flex flex-col gap-3" aria-labelledby={`phase-${phase.number}`}>
          <div className="flex flex-col gap-1">
            <p className="eyebrow m-0 text-ink-secondary">{`PHASE ${phase.number} · WEEKS ${phase.weeks.toUpperCase()}`}</p>
            <h2 id={`phase-${phase.number}`} className="heading-2 m-0 text-ink">
              {phase.title}
            </h2>
            <p className="body m-0 text-ink-secondary">{phase.summary}</p>
          </div>
          <ul className="m-0 flex list-none flex-col border-y border-line p-0">
            {data.nodes
              .filter((n) => n.phase === phase.number)
              .map((node) => {
                const view = data.views[node.id];
                const current = selectedId === node.id;
                return (
                  <li key={node.id} className="border-t border-line first:border-t-0">
                    <button
                      type="button"
                      onClick={() => onSelect(node.id)}
                      aria-pressed={current}
                      className={cx(
                        "flex min-h-12 w-full items-center gap-3 rounded-control bg-transparent px-2 py-2 text-left transition-colors",
                        current ? "bg-accent-soft text-ink" : "text-ink hover:bg-hover",
                      )}
                    >
                      <span className="eyebrow w-10 flex-none text-ink-secondary">{node.id}</span>
                      <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="small">{node.title}</span>
                        <StatusBadge status={BADGE_FOR_STATE[view.state]}>{STATE_LABELS[view.state]}</StatusBadge>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
