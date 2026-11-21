"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Maximize2, Minus, Plus } from "lucide-react";
import { ArrowLeft } from "@/components/ui/Icons";
import { cx } from "@/components/ui/cx";
import { STATE_LABELS, type NodeState } from "@/curriculum/status";
import { MapCanvas, NODE_STYLE, type MapCanvasHandle } from "./MapCanvas";
import { NodePanel } from "./NodePanel";
import type { MapData } from "./types";

/**
 * Every idea and how it connects: the one full-width view in Frame, with a panel
 * for the idea you choose. The phase table at /map is the list view.
 */
export function KnowledgeMap({ data }: { data: MapData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvas = useRef<MapCanvasHandle>(null);

  const selected = selectedId ? (data.nodes.find((n) => n.id === selectedId) ?? null) : null;

  // Bring the chosen idea into view once the panel has opened and the map has resized.
  const choose = (id: string | null) => {
    setSelectedId(id);
    if (!id) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    requestAnimationFrame(() => canvas.current?.centreOn(id, wide ? "centre" : "upper"));
  };

  return (
    <div className="flex flex-col gap-4">
      <Link href="/map" className="back">
        <ArrowLeft size={14} /> Map
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <header className="page-head graph-head">
          <p className="eyebrow">The curriculum</p>
          <h1>How every idea connects</h1>
          <p className="lede">
            {`${data.nodes.length} ideas in ${data.phases.length} phases. Choose an idea to see what it builds on and where it leads.`}
          </p>
        </header>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Zoom">
          <button type="button" className="btn btn-sm" onClick={() => canvas.current?.zoomBy(0.8)}>
            <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
            Zoom out
          </button>
          <button type="button" className="btn btn-sm" onClick={() => canvas.current?.zoomBy(1.25)}>
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Zoom in
          </button>
          <button type="button" className="btn btn-sm" onClick={() => canvas.current?.fit()}>
            <Maximize2 size={13} strokeWidth={1.5} aria-hidden="true" />
            Whole map
          </button>
        </div>
      </div>

      <div
        className="relative flex overflow-hidden rounded-sheet border border-line"
        style={{ height: "max(360px, calc(100dvh - 320px))" }}
      >
        <div className="relative min-w-0 flex-1">
          <MapCanvas ref={canvas} data={data} selectedId={selectedId} onSelect={choose} />
        </div>
        {selected ? (
          <aside
            aria-label={`${selected.id} ${selected.title}`}
            className={cx(
              "overflow-y-auto border-line bg-ground",
              // Phones and tablets: a sheet over the lower part of the map.
              "absolute inset-x-0 bottom-0 max-h-[60%] rounded-t-sheet border-t",
              // Laptops: a column beside the map.
              "lg:static lg:max-h-none lg:w-[380px] lg:flex-none lg:rounded-none lg:border-t-0 lg:border-l",
            )}
          >
            <NodePanel data={data} node={selected} onSelect={choose} onClose={() => setSelectedId(null)} />
          </aside>
        ) : null}
      </div>
      <p id="map-keys" className="hint m-0">
        Drag to move, scroll or pinch to zoom. With a keyboard, press Tab to reach an idea, then use the arrow keys.
      </p>
      <Legend />
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
