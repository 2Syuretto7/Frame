import Link from "next/link";
import type { CurriculumNode } from "@/curriculum/types";

const BOX_W = 200;
const BOX_H = 48;
const GAP = 12;

/**
 * A small slice of the knowledge map: this node on the left and the ideas that
 * build on it on the right. Each box links to the map, or to its lesson.
 */
export function LeadsTo({
  node,
  next,
  lessonIds,
}: {
  node: CurriculumNode;
  next: CurriculumNode[];
  lessonIds: string[];
}) {
  const rows = Math.max(1, next.length);
  const height = rows * BOX_H + (rows - 1) * GAP;
  const width = BOX_W * 2 + 96;
  const sourceY = (height - BOX_H) / 2;

  return (
    <div className="overflow-x-auto rounded-card border border-diagram-line bg-diagram p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="block max-w-none"
        role="group"
        aria-label={`${node.title} leads to ${next.map((n) => n.title).join(", ") || "nothing directly"}.`}
      >
        {next.map((n, i) => {
          const y = i * (BOX_H + GAP);
          const x1 = BOX_W;
          const y1 = sourceY + BOX_H / 2;
          const x2 = width - BOX_W;
          const y2 = y + BOX_H / 2;
          return (
            <path
              key={n.id}
              d={`M${x1},${y1} C${x1 + 48},${y1} ${x2 - 48},${y2} ${x2},${y2}`}
              fill="none"
              stroke="var(--diagram-border)"
            />
          );
        })}
        <Box x={0} y={sourceY} node={node} current />
        {next.map((n, i) => (
          <Link
            key={n.id}
            href={lessonIds.includes(n.id) ? `/learn/${n.id}` : "/map"}
            aria-label={`${n.id} ${n.title}`}
          >
            <Box x={width - BOX_W} y={i * (BOX_H + GAP)} node={n} />
          </Link>
        ))}
      </svg>
    </div>
  );
}

function Box({ x, y, node, current = false }: { x: number; y: number; node: CurriculumNode; current?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        width={BOX_W}
        height={BOX_H}
        rx={4}
        fill="var(--diagram-background)"
        stroke={current ? "var(--accent)" : "var(--diagram-border)"}
        strokeWidth={current ? 2 : 1}
      />
      <text x={10} y={18} fill="var(--diagram-text)" style={{ font: "var(--text-eyebrow)" }}>
        {node.id}
      </text>
      <text x={10} y={36} fill="var(--text-primary)" style={{ font: "500 13px/16px var(--font-sans)" }}>
        {node.title.length > 26 ? `${node.title.slice(0, 25)}…` : node.title}
      </text>
    </g>
  );
}
