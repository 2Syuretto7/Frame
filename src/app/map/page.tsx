import type { Metadata } from "next";
import { Page } from "@/components/frame/Page";
import { KnowledgeMap } from "@/components/map/KnowledgeMap";
import type { MapData } from "@/components/map/types";
import { GRAPH, PHASES } from "@/curriculum/graph";
import { computeLayout } from "@/curriculum/layout";
import { deriveStates } from "@/curriculum/status";
import { LESSON_IDS } from "@/lessons";

export const metadata: Metadata = { title: "Knowledge map" };

/** The layout depends only on the graph, so it is computed once at build time and reused. */
async function getLayout() {
  "use cache";
  return computeLayout(GRAPH);
}

export default async function MapPage() {
  const layout = await getLayout();
  // Progress is not recorded yet, so every node shows its starting state.
  const views = deriveStates(GRAPH, new Map());
  const data: MapData = {
    nodes: GRAPH.nodes.map(({ id, title, phase, track, kind, goal, sessions, order, prereqs }) => ({
      id,
      title,
      phase,
      track,
      kind,
      goal,
      sessions,
      order,
      prereqs,
    })),
    edges: GRAPH.edges,
    phases: PHASES,
    layout,
    views,
    lessonIds: LESSON_IDS,
  };

  return (
    <Page wide>
      <KnowledgeMap data={data} />
    </Page>
  );
}
