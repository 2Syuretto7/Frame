import { notInArray, sql } from "drizzle-orm";
import { edge, node } from "@/db/schema";
import type { Db } from "@/db/types";
import type { Graph } from "@/curriculum/graph";

export interface SeedResult {
  nodes: number;
  edges: number;
  retired: number;
}

/**
 * Copies the curriculum graph into the database. Nodes are upserted, nodes that
 * have left the graph are marked retired, and edges are replaced wholesale.
 */
export async function seedCurriculum(db: Db, graph: Graph): Promise<SeedResult> {
  const ids = graph.nodes.map((n) => n.id);

  await db
    .insert(node)
    .values(
      graph.nodes.map((n) => ({
        id: n.id,
        title: n.title,
        phase: n.phase,
        track: n.track,
        kind: n.kind,
        goal: n.goal,
        sessions: n.sessions,
        position: n.order,
        retired: false,
      })),
    )
    .onConflictDoUpdate({
      target: node.id,
      set: {
        title: sql`excluded.title`,
        phase: sql`excluded.phase`,
        track: sql`excluded.track`,
        kind: sql`excluded.kind`,
        goal: sql`excluded.goal`,
        sessions: sql`excluded.sessions`,
        position: sql`excluded.position`,
        retired: false,
        updatedAt: sql`now()`,
      },
    });

  const retired = await db
    .update(node)
    .set({ retired: true, updatedAt: sql`now()` })
    .where(notInArray(node.id, ids))
    .returning({ id: node.id });

  await db.delete(edge);
  await db.insert(edge).values(
    graph.edges.map((e) => ({ fromId: e.from, toId: e.to, type: e.type, note: e.note })),
  );

  return { nodes: ids.length, edges: graph.edges.length, retired: retired.length };
}
