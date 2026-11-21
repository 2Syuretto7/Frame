"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { STATE_LABELS, type NodeState } from "@/curriculum/status";
import type { MapData, MapNode } from "./types";
import { arrange, bestColumns } from "./arrange";

export type Placement = "centre" | "upper";

export interface MapCanvasHandle {
  zoomBy(factor: number): void;
  fit(): void;
  /** "upper" keeps the node clear of a sheet covering the lower part of the map, as on phones. */
  centreOn(id: string, placement?: Placement): void;
}

interface MapCanvasProps {
  data: MapData;
  selectedId: string | null;
  onSelect(id: string | null): void;
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 2;
const PADDING = 16;
const CLICK_SLOP = 6;
/** Below this scale node text is too small to read, so nodes show only their id and state. */
const OVERVIEW_BELOW = 0.5;
/** The scale a node is brought to when you choose it from the overview. */
const READING_SCALE = 1;

/**
 * How each state is drawn. Every state differs in more than colour: locked is
 * dashed and unfilled, ready is a solid outline, and the three started states are filled.
 */
export const NODE_STYLE: Record<NodeState, { stroke: string; fill: string; width: number; dash?: string }> = {
  locked: {
    stroke: "var(--idle)",
    fill: "var(--diagram-background)",
    width: 1,
    dash: "5 4",
  },
  available: {
    stroke: "var(--text-primary)",
    fill: "var(--diagram-background)",
    width: 1.5,
  },
  learning: { stroke: "var(--accent)", fill: "var(--accent-soft)", width: 2 },
  review: { stroke: "var(--warning)", fill: "var(--warning-soft)", width: 2 },
  learnt: { stroke: "var(--success)", fill: "var(--success-soft)", width: 2 },
};

const DOT: Record<NodeState, string> = {
  locked: "var(--idle)",
  available: "var(--text-primary)",
  learning: "var(--accent)",
  learnt: "var(--success)",
  review: "var(--warning)",
};

type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

function clampScale(k: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, k));
}

/** Splits a title into at most two lines of roughly `max` characters. */
function wrapTitle(title: string, max = 26): string[] {
  if (title.length <= max) return [title];
  const words = title.split(" ");
  let first = "";
  let i = 0;
  while (i < words.length && (first + " " + words[i]).trim().length <= max) {
    first = (first + " " + words[i]).trim();
    i += 1;
  }
  if (!first) return [title];
  return [first, words.slice(i).join(" ")];
}

/**
 * The knowledge map drawn as SVG. Panning and zooming change a transform directly
 * on the DOM rather than through React state, so dragging stays smooth on phones.
 */
export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  { data, selectedId, onSelect },
  ref,
) {
  const { layout, nodes, edges, phases, views } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const transform = useRef<Transform>({ x: PADDING, y: PADDING, k: 1 });
  /** Until you move the map yourself, it keeps refitting to its box as the window changes. */
  const touched = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startX: number;
    startY: number;
    moved: boolean;
    target: EventTarget | null;
  } | null>(null);

  const phaseOf = useMemo(() => new Map(nodes.map((n) => [n.id, n.phase])), [nodes]);
  const [columns, setColumns] = useState(1);
  const map = useMemo(() => arrange(layout, phaseOf, columns), [layout, phaseOf, columns]);
  const positions = useMemo(() => new Map(map.nodes.map((n) => [n.id, n])), [map.nodes]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const w = layout.nodeWidth;
  const h = layout.nodeHeight;

  const apply = useCallback((next: Transform, animate = false) => {
    transform.current = next;
    const world = worldRef.current;
    if (!world) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    world.style.transition = animate && !reduce ? "transform 250ms ease-out" : "none";
    world.style.transform = `translate(${next.x}px, ${next.y}px) scale(${next.k})`;
    world.style.setProperty("--k", String(next.k));
    world.style.visibility = "visible";
    const container = containerRef.current;
    if (container) container.dataset.zoom = next.k < OVERVIEW_BELOW ? "overview" : "detail";
  }, []);

  const size = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    return { width: box?.width ?? 0, height: box?.height ?? 0 };
  }, []);

  const zoomAt = useCallback(
    (factor: number, px: number, py: number, animate = false) => {
      const { x, y, k } = transform.current;
      const nk = clampScale(k * factor);
      const ratio = nk / k;
      apply({ x: px - (px - x) * ratio, y: py - (py - y) * ratio, k: nk }, animate);
    },
    [apply],
  );

  const centreOn = useCallback(
    (id: string, placement: Placement = "centre") => {
      const p = positions.get(id);
      if (!p) return;
      const { width, height } = size();
      const k = Math.max(transform.current.k, READING_SCALE);
      const targetY = placement === "upper" ? Math.min(height * 0.2, height / 2) : height / 2;
      apply(
        {
          x: width / 2 - (p.x + w / 2) * k,
          y: targetY - (p.y + h / 2) * k,
          k,
        },
        true,
      );
    },
    [apply, positions, size, w, h],
  );

  const fit = useCallback(
    (animate: boolean) => {
      const { width, height } = size();
      if (width === 0 || height === 0) return;
      const k = clampScale(Math.min((width - PADDING * 2) / map.width, (height - PADDING * 2) / map.height));
      apply(
        {
          x: (width - map.width * k) / 2,
          y: (height - map.height * k) / 2,
          k,
        },
        animate,
      );
    },
    [apply, map.height, map.width, size],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      touched.current = true;
      const { width, height } = size();
      zoomAt(factor, width / 2, height / 2, true);
    },
    [size, zoomAt],
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomBy,
      fit() {
        touched.current = false;
        fit(true);
      },
      centreOn(id, placement) {
        touched.current = true;
        centreOn(id, placement);
      },
    }),
    [centreOn, fit, zoomBy],
  );

  // Open on the whole map, and keep it whole as the window resizes until you move it yourself.
  // Wide boxes get the phases in two or three columns, tall ones in one, whichever draws the map largest.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!touched.current) fit(false);
    const observer = new ResizeObserver(() => {
      const { width, height } = size();
      if (width > 0 && height > 0) setColumns(bestColumns(layout, phaseOf, width, height));
      if (!touched.current) fit(false);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, layout, phaseOf, size]);

  /** Moves keyboard focus to the nearest idea in the direction of an arrow key. */
  const focusNeighbour = (fromId: string, direction: Direction) => {
    const from = positions.get(fromId);
    if (!from) return;
    let best: { id: string; score: number } | null = null;
    for (const p of map.nodes) {
      if (p.id === fromId) continue;
      const dx = p.x - from.x;
      const dy = p.y - from.y;
      const along =
        direction === "ArrowRight" ? dx : direction === "ArrowLeft" ? -dx : direction === "ArrowDown" ? dy : -dy;
      const across = direction === "ArrowRight" || direction === "ArrowLeft" ? Math.abs(dy) : Math.abs(dx);
      if (along <= 0) continue;
      const score = along + across * 2;
      if (!best || score < best.score) best = { id: p.id, score };
    }
    if (best) containerRef.current?.querySelector<SVGGElement>(`[data-node="${best.id}"]`)?.focus();
  };

  // Wheel: pinch on a trackpad (reported with ctrlKey) zooms; scrolling pans.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      touched.current = true;
      const box = el.getBoundingClientRect();
      if (event.ctrlKey || event.metaKey) {
        zoomAt(Math.exp(-event.deltaY * 0.01), event.clientX - box.left, event.clientY - box.top);
      } else {
        const { x, y, k } = transform.current;
        apply({ x: x - event.deltaX, y: y - event.deltaY, k });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [apply, zoomAt]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 1) {
      gesture.current = {
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        target: event.target,
      };
    } else if (gesture.current) {
      gesture.current.moved = true;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const current = { x: event.clientX, y: event.clientY };
    const box = event.currentTarget.getBoundingClientRect();

    if (pointers.current.size === 1) {
      const g = gesture.current;
      if (g && !g.moved && Math.hypot(current.x - g.startX, current.y - g.startY) > CLICK_SLOP) g.moved = true;
      if (g?.moved) {
        touched.current = true;
        const { x, y, k } = transform.current;
        apply({
          x: x + current.x - previous.x,
          y: y + current.y - previous.y,
          k,
        });
      }
    } else if (pointers.current.size === 2) {
      const [other] = [...pointers.current.entries()].filter(([id]) => id !== event.pointerId).map(([, p]) => p);
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(current.x - other.x, current.y - other.y);
      const midX = (current.x + other.x) / 2 - box.left;
      const midY = (current.y + other.y) / 2 - box.top;
      const shiftX = (current.x - previous.x) / 2;
      const shiftY = (current.y - previous.y) / 2;
      touched.current = true;
      if (before > 0) zoomAt(after / before, midX, midY);
      const { x, y, k } = transform.current;
      apply({ x: x + shiftX, y: y + shiftY, k });
    }
    pointers.current.set(event.pointerId, current);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(event.pointerId);
    const g = gesture.current;
    if (wasSingle && g && !g.moved) {
      const hit = (g.target as Element | null)?.closest?.("[data-node]");
      onSelect(hit ? hit.getAttribute("data-node") : null);
    }
    if (pointers.current.size === 0) gesture.current = null;
  };

  // What to emphasise when a node is selected: its direct prerequisites, dependants and related ideas.
  const focus = useMemo(() => {
    if (!selectedId) return null;
    const ids = new Set([selectedId]);
    const links = edges.filter((e) => e.from === selectedId || e.to === selectedId);
    for (const e of links) {
      ids.add(e.from);
      ids.add(e.to);
    }
    return { ids, links };
  }, [edges, selectedId]);

  const connector = (from: MapNode, to: MapNode): string => {
    const a = positions.get(from.id);
    const b = positions.get(to.id);
    if (!a || !b) return "";
    if (from.phase === to.phase) {
      const [left, right] = a.x <= b.x ? [a, b] : [b, a];
      const x1 = left.x + w;
      const y1 = left.y + h / 2;
      const x2 = right.x;
      const y2 = right.y + h / 2;
      if (x2 > x1 + 8) {
        const dx = Math.max(24, (x2 - x1) / 2);
        return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      }
      // Stacked in the same column: bow out to the right.
      const bow = 48;
      return `M${left.x + w},${y1} C${left.x + w + bow},${y1} ${right.x + w + bow},${y2} ${right.x + w},${y2}`;
    }
    const [upper, lower] = a.y <= b.y ? [a, b] : [b, a];
    const x1 = upper.x + w / 2;
    const y1 = upper.y + h;
    const x2 = lower.x + w / 2;
    const y2 = lower.y;
    const dy = Math.max(40, (y2 - y1) / 3);
    return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
  };

  return (
    <div
      ref={containerRef}
      className="map-canvas relative h-full w-full cursor-grab touch-none overflow-hidden bg-diagram select-none active:cursor-grabbing"
      data-zoom="overview"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg className="block h-full w-full" role="group" aria-label="Knowledge map" aria-describedby="map-keys">
        <defs>
          <marker id="map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--diagram-border)" />
          </marker>
          <marker
            id="map-arrow-focus"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--accent)" />
          </marker>
        </defs>
        <g ref={worldRef} style={{ transformOrigin: "0 0", visibility: "hidden" }}>
          {map.bands.map((band) => {
            const phase = phases.find((p) => p.number === band.phase);
            return (
              <g key={band.phase}>
                {band.y > 0 ? (
                  <line
                    x1={band.x}
                    x2={band.x + band.width}
                    y1={band.y - 28}
                    y2={band.y - 28}
                    stroke="var(--diagram-border)"
                    strokeWidth={1}
                  />
                ) : null}
                <text
                  className="map-detail"
                  x={band.x}
                  y={band.y + 76}
                  fill="var(--diagram-text)"
                  style={{
                    font: "var(--text-eyebrow)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {`PHASE ${band.phase} · WEEKS ${phase?.weeks.toUpperCase() ?? ""}`}
                </text>
                {/* Grows as you zoom out, so the phase names stay readable over the whole map. */}
                <text
                  x={band.x}
                  y={band.y + 112}
                  fill="var(--text-primary)"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "clamp(24px, calc(13px / var(--k, 1)), 120px)",
                  }}
                >
                  <tspan className="map-overview">{`Phase ${band.phase}: `}</tspan>
                  {phase?.title}
                </text>
              </g>
            );
          })}

          <g opacity={focus ? 0.25 : 1}>
            {map.edges.map((edge) => (
              <polyline
                key={`${edge.from}>${edge.to}`}
                points={edge.points.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke="var(--diagram-border)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                markerEnd="url(#map-arrow)"
              />
            ))}
          </g>

          {focus ? (
            <g>
              {focus.links.map((edge) => {
                const from = byId.get(edge.from);
                const to = byId.get(edge.to);
                if (!from || !to) return null;
                const related = edge.type === "related";
                return (
                  <path
                    key={`${edge.type}:${edge.from}>${edge.to}`}
                    d={connector(from, to)}
                    fill="none"
                    stroke={related ? "var(--diagram-text)" : "var(--accent)"}
                    strokeWidth={related ? 1 : 1.5}
                    strokeDasharray={related ? "4 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                    markerEnd={related ? undefined : "url(#map-arrow-focus)"}
                  />
                );
              })}
            </g>
          ) : null}

          {nodes.map((node) => {
            const p = positions.get(node.id);
            if (!p) return null;
            const view = views[node.id] ?? {
              state: "locked" as const,
              mastery: 0,
            };
            const look = NODE_STYLE[view.state];
            const selected = node.id === selectedId;
            const dimmed = focus !== null && !focus.ids.has(node.id);
            const lines = wrapTitle(node.title);
            const label = `${node.id} ${node.title}. ${STATE_LABELS[view.state]}.`;
            return (
              <g
                key={node.id}
                data-node={node.id}
                transform={`translate(${p.x},${p.y})`}
                opacity={dimmed ? 0.35 : 1}
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-pressed={selected}
                className="cursor-pointer outline-none [&:focus-visible>rect.ring]:opacity-100"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(node.id);
                  } else if (event.key.startsWith("Arrow")) {
                    event.preventDefault();
                    focusNeighbour(node.id, event.key as Direction);
                  } else if (event.key === "+" || event.key === "=") {
                    event.preventDefault();
                    zoomBy(1.25);
                  } else if (event.key === "-") {
                    event.preventDefault();
                    zoomBy(0.8);
                  } else if (event.key === "Escape" && selectedId) {
                    onSelect(null);
                  }
                }}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) {
                    touched.current = true;
                    centreOn(node.id);
                  }
                }}
              >
                <rect
                  className="ring opacity-0"
                  x={-4}
                  y={-4}
                  width={w + 8}
                  height={h + 8}
                  rx={6}
                  fill="none"
                  stroke="var(--focus)"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
                {selected ? (
                  <rect
                    x={-3}
                    y={-3}
                    width={w + 6}
                    height={h + 6}
                    rx={6}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <rect
                  width={w}
                  height={h}
                  rx={4}
                  fill={look.fill}
                  stroke={look.stroke}
                  strokeWidth={look.width}
                  strokeDasharray={look.dash}
                  vectorEffect="non-scaling-stroke"
                />
                {view.mastery > 0 ? (
                  <rect
                    className="map-detail"
                    x={12}
                    y={h - 7}
                    width={(w - 24) * view.mastery}
                    height={3}
                    rx={1.5}
                    fill={look.stroke}
                  />
                ) : null}
                <g className="map-detail">
                  <text
                    x={12}
                    y={20}
                    fill="var(--diagram-text)"
                    style={{
                      font: "var(--text-eyebrow)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {node.kind === "project" ? `${node.id} · PROJECT` : node.id}
                  </text>
                  <circle cx={w - 12 - 4} cy={16} r={3} fill={DOT[view.state]} />
                  <text
                    x={w - 24}
                    y={20}
                    textAnchor="end"
                    fill="var(--text-secondary)"
                    style={{
                      font: "var(--text-eyebrow)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {STATE_LABELS[view.state].toUpperCase()}
                  </text>
                  {lines.map((line, i) => (
                    <text
                      key={i}
                      x={12}
                      y={lines.length === 1 ? 44 : 38 + i * 17}
                      fill={view.state === "locked" ? "var(--text-secondary)" : "var(--text-primary)"}
                      style={{ font: "500 14px/17px var(--font-sans)" }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
                <text
                  className="map-overview"
                  x={w / 2}
                  y={h / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={view.state === "locked" ? "var(--text-secondary)" : "var(--text-primary)"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(16px, calc(11px / var(--k, 1)), 44px)",
                  }}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
});
