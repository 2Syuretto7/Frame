"use client";

import { useMemo, useRef, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { StatusBadge } from "@/components/midnight";
import { cx } from "@/components/midnight/cx";
import { STATE_LABELS } from "@/curriculum/status";
import { MapCanvas, type MapCanvasHandle } from "./MapCanvas";
import { BADGE_FOR_STATE, NodePanel } from "./NodePanel";
import type { MapData } from "./types";

type Mode = "map" | "list";

const iconButton =
  "mds-btn mds-btn-ghost h-11 w-11 justify-center !px-0 text-ink-faint hover:text-ink bg-ground border border-line";

/** The knowledge map page: a pannable map or a plain list, with a panel for the chosen node. */
export function KnowledgeMap({ data }: { data: MapData }) {
  const [mode, setMode] = useState<Mode>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvas = useRef<MapCanvasHandle>(null);

  const selected = selectedId ? (data.nodes.find((n) => n.id === selectedId) ?? null) : null;
  const focusId = useMemo(() => {
    const order = ["learning", "review", "available"] as const;
    for (const state of order) {
      const found = data.nodes.find((n) => data.views[n.id]?.state === state);
      if (found) return found.id;
    }
    return data.nodes[0].id;
  }, [data]);

  // Bring the chosen node into view once the panel has opened and the map has resized.
  const choose = (id: string | null) => {
    setSelectedId(id);
    if (!id || mode !== "map") return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    requestAnimationFrame(() => canvas.current?.centreOn(id, wide ? "centre" : "upper"));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="heading-2 m-0 text-ink">Knowledge map</h1>
          <p className="caption m-0 hidden text-ink-faint sm:block">
            {`${data.nodes.length} ideas in ${data.phases.length} phases. Tap an idea to see where it comes from and where it leads.`}
          </p>
        </div>
        <div role="tablist" aria-label="View" className="flex rounded-control border border-line p-0.5">
          {(["map", "list"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cx(
                "small h-10 min-w-16 rounded-[2px] px-3 sm:min-w-20 sm:px-4",
                mode === m ? "bg-raised text-ink" : "bg-transparent text-ink-faint hover:text-ink",
              )}
            >
              {m === "map" ? "Map" : "List"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-sheet border border-line">
        <div className="relative min-h-[420px] min-w-0 flex-1">
          {mode === "map" ? (
            <>
              <MapCanvas ref={canvas} data={data} selectedId={selectedId} onSelect={choose} focusId={focusId} />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button type="button" aria-label="Zoom in" className={iconButton} onClick={() => canvas.current?.zoomBy(1.25)}>
                  <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Zoom out" className={iconButton} onClick={() => canvas.current?.zoomBy(0.8)}>
                  <Minus size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Show the whole map" className={iconButton} onClick={() => canvas.current?.fit()}>
                  <Maximize2 size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
              <Legend />
            </>
          ) : (
            <ListView data={data} selectedId={selectedId} onSelect={setSelectedId} />
          )}
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
    </div>
  );
}

function Legend() {
  const items = [
    { key: "locked", swatch: "border border-dashed border-diagram-line" },
    { key: "available", swatch: "border border-diagram-ink" },
    { key: "learning", swatch: "border border-accent" },
    { key: "review", swatch: "border border-warning" },
    { key: "learnt", swatch: "border-2 border-success" },
  ] as const;
  return (
    <ul className="pointer-events-none absolute bottom-3 left-3 m-0 hidden list-none flex-wrap gap-x-4 gap-y-1 rounded-control border border-line bg-ground px-3 py-2 sm:flex">
      {items.map((item) => (
        <li key={item.key} className="caption flex items-center gap-2 text-ink-faint">
          <span className={cx("inline-block h-3 w-4 rounded-[2px]", item.swatch)} aria-hidden="true" />
          {STATE_LABELS[item.key]}
        </li>
      ))}
    </ul>
  );
}

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
    <div className="absolute inset-0 overflow-y-auto">
      {data.phases.map((phase) => (
        <section key={phase.number} className="flex flex-col gap-3 border-b border-line px-4 py-6 last:border-b-0 sm:px-6">
          <div className="flex flex-col gap-1">
            <p className="eyebrow m-0 text-ink-faint">{`PHASE ${phase.number} · WEEKS ${phase.weeks.toUpperCase()}`}</p>
            <h2 className="heading-2 m-0 text-ink">{phase.title}</h2>
            <p className="caption m-0 text-ink-faint">{phase.summary}</p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {data.nodes
              .filter((n) => n.phase === phase.number)
              .map((node) => {
                const view = data.views[node.id];
                return (
                  <li key={node.id} className="border-t border-line first:border-t-0">
                    <button
                      type="button"
                      onClick={() => onSelect(node.id)}
                      aria-pressed={selectedId === node.id}
                      className={cx(
                        "flex min-h-12 w-full items-center gap-3 bg-transparent py-2 text-left",
                        selectedId === node.id ? "text-accent" : "text-ink hover:text-accent",
                      )}
                    >
                      <span className="eyebrow w-10 flex-none text-ink-faint">{node.id}</span>
                      <span className="small min-w-0 flex-1">{node.title}</span>
                      <StatusBadge status={BADGE_FOR_STATE[view.state]}>{STATE_LABELS[view.state]}</StatusBadge>
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
