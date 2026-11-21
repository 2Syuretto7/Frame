import type { MapLayout, PhaseBand, PlacedEdge, PlacedNode } from "@/curriculum/layout";

/** Horizontal room between columns of phases. */
const COLUMN_GAP = 160;
/** Vertical room between phases stacked in one column. */
const ROW_GAP = 56;

export interface ArrangedBand extends PhaseBand {
  x: number;
  width: number;
}

export interface Arrangement {
  columns: number;
  width: number;
  height: number;
  nodes: PlacedNode[];
  edges: PlacedEdge[];
  bands: ArrangedBand[];
}

/**
 * Lays the phase bands out in `columns` columns, reading down each column in order,
 * so the whole map can fill a wide screen as well as a tall one.
 */
export function arrange(layout: MapLayout, phaseOf: ReadonlyMap<string, number>, columns: number): Arrangement {
  const bands = [...layout.bands].sort((a, b) => a.phase - b.phase);
  const widthOf = new Map<number, number>();
  for (const n of layout.nodes) {
    const phase = phaseOf.get(n.id);
    if (phase === undefined) continue;
    widthOf.set(phase, Math.max(widthOf.get(phase) ?? 0, n.x + layout.nodeWidth));
  }

  const perColumn = Math.ceil(bands.length / columns);
  const shift = new Map<number, { dx: number; dy: number }>();
  const placed: ArrangedBand[] = [];
  let x = 0;
  let height = 0;
  for (let c = 0; c < columns; c++) {
    const group = bands.slice(c * perColumn, (c + 1) * perColumn);
    if (group.length === 0) break;
    const columnWidth = Math.max(...group.map((b) => widthOf.get(b.phase) ?? 0));
    let y = 0;
    for (const band of group) {
      shift.set(band.phase, { dx: x, dy: y - band.y });
      placed.push({ ...band, x, y, width: columnWidth });
      y += band.height + ROW_GAP;
    }
    height = Math.max(height, y - ROW_GAP);
    x += columnWidth + COLUMN_GAP;
  }

  const move = (id: string) => shift.get(phaseOf.get(id) ?? 0) ?? { dx: 0, dy: 0 };
  return {
    columns,
    width: x - COLUMN_GAP,
    height,
    bands: placed,
    nodes: layout.nodes.map((n) => {
      const { dx, dy } = move(n.id);
      return { id: n.id, x: n.x + dx, y: n.y + dy };
    }),
    edges: layout.edges.map((e) => {
      const { dx, dy } = move(e.from);
      return { ...e, points: e.points.map(([px, py]) => [px + dx, py + dy] as [number, number]) };
    }),
  };
}

/** The number of columns (one to three) that lets the whole map be drawn largest in a box of this shape. */
export function bestColumns(
  layout: MapLayout,
  phaseOf: ReadonlyMap<string, number>,
  width: number,
  height: number,
): number {
  let best = 1;
  let bestScale = 0;
  for (let columns = 1; columns <= 3; columns++) {
    const a = arrange(layout, phaseOf, columns);
    const scale = Math.min(width / a.width, height / a.height);
    if (scale > bestScale * 1.05) {
      best = columns;
      bestScale = scale;
    }
  }
  return best;
}
