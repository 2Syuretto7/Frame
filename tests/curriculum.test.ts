import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { edge, node } from "@/db/schema";
import {
  GRAPH,
  ancestors,
  buildGraph,
  dependants,
  reducedPrerequisites,
  relatedTo,
  validateGraph,
} from "@/curriculum/graph";
import { computeLayout } from "@/curriculum/layout";
import { deriveStates, masteryStep } from "@/curriculum/status";
import type { NodeSource } from "@/curriculum/types";
import { seedCurriculum } from "@/server/curriculum/seed";
import { testDb } from "./helpers";

function source(id: string, prereqs: string[] = [], extra: Partial<NodeSource> = {}): NodeSource {
  return {
    id,
    title: `Node ${id}`,
    track: "programming",
    kind: "concept",
    goal: "Do something testable",
    sessions: 2,
    prereqs,
    links: [],
    brief: {
      keyIdeas: ["an idea"],
      misconceptions: ["a mistake"],
      itemTypes: ["predict"],
      variationAxes: { context: ["a", "b"] },
    },
    ...extra,
  };
}

const project = (id: string, prereqs: string[]) => source(id, prereqs, { kind: "project", track: "design" });
const onePhase = [{ number: 1, title: "One", weeks: "1 to 9", game: "Test", summary: "" }];

describe("the curriculum graph", () => {
  it("is valid, with 89 nodes in six phases", () => {
    expect(validateGraph(GRAPH)).toEqual([]);
    expect(GRAPH.nodes).toHaveLength(89);
    expect(new Set(GRAPH.nodes.map((n) => n.phase))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it("starts with a single node that needs nothing", () => {
    expect(GRAPH.nodes.filter((n) => n.prereqs.length === 0).map((n) => n.id)).toEqual(["1.01"]);
  });

  it("makes each phase game depend on its whole phase", () => {
    const rainfall = ancestors(GRAPH, "1.18");
    for (const n of GRAPH.nodes.filter((n) => n.phase === 1 && n.id !== "1.18")) {
      expect(rainfall.has(n.id)).toBe(true);
    }
  });

  it("links related ideas in both directions, with notes", () => {
    const related = relatedTo(GRAPH, "3.01").map((r) => r.node.id);
    expect(related).toContain("6.02");
    expect(relatedTo(GRAPH, "6.02").map((r) => r.node.id)).toContain("3.01");
    expect(GRAPH.edges.filter((e) => e.type === "related").every((e) => (e.note ?? "").length > 0)).toBe(true);
    expect(dependants(GRAPH, "1.01").map((n) => n.id)).toEqual(["1.02", "1.18"]);
  });

  it("drops only redundant prerequisite edges from the map", () => {
    const reduced = reducedPrerequisites(GRAPH);
    // 1.04 → 1.18 is implied through 1.05 and others, so it is not drawn.
    expect(reduced.some((e) => e.from === "1.04" && e.to === "1.18")).toBe(false);
    expect(reduced.some((e) => e.from === "1.01" && e.to === "1.02")).toBe(true);
    for (const n of GRAPH.nodes) {
      const drawn = new Set(reduced.filter((e) => e.to === n.id).map((e) => e.from));
      const implied = new Set<string>();
      for (const from of drawn) {
        implied.add(from);
        for (const a of ancestors(GRAPH, from)) implied.add(a);
      }
      for (const p of n.prereqs) expect(implied.has(p)).toBe(true);
    }
  });

  it("lays every node out without overlaps", async () => {
    const layout = await computeLayout(GRAPH);
    expect(layout.nodes).toHaveLength(89);
    const { nodeWidth: w, nodeHeight: h } = layout;
    for (let i = 0; i < layout.nodes.length; i++) {
      for (let j = i + 1; j < layout.nodes.length; j++) {
        const a = layout.nodes[i];
        const b = layout.nodes[j];
        const overlap = a.x < b.x + w && b.x < a.x + w && a.y < b.y + h && b.y < a.y + h;
        expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
  });
});

describe("graph validation", () => {
  it("reports a missing prerequisite", () => {
    const graph = buildGraph([[source("1.01"), source("1.02", ["1.09"]), project("1.03", ["1.01", "1.02"])]]);
    expect(validateGraph(graph, onePhase)).toContain("1.02: prerequisite 1.09 does not exist");
  });

  it("reports a cycle", () => {
    const graph = buildGraph([[source("1.01", ["1.02"]), source("1.02", ["1.01"]), project("1.03", ["1.02"])]]);
    const problems = validateGraph(graph, onePhase);
    expect(problems.some((p) => p.includes("cycle"))).toBe(true);
  });

  it("reports a duplicate link and a phase game that skips a node", () => {
    const graph = buildGraph([
      [
        source("1.01", [], { links: [{ to: "1.02", note: "one" }] }),
        source("1.02", [], { links: [{ to: "1.01", note: "two" }] }),
        project("1.03", ["1.01"]),
      ],
    ]);
    const problems = validateGraph(graph, onePhase);
    expect(problems).toContain("1.02: the link with 1.01 is listed twice");
    expect(problems).toContain("1.03: the phase game does not build on 1.02");
  });

  it("turns a link to a prerequisite into that edge's note", () => {
    const graph = buildGraph([
      [source("1.01", [], { links: [{ to: "1.02", note: "why" }] }), project("1.02", ["1.01"])],
    ]);
    expect(validateGraph(graph, onePhase)).toEqual([]);
    expect(graph.edges).toEqual([{ from: "1.01", to: "1.02", type: "prerequisite", note: "why" }]);
  });
});

describe("node states", () => {
  it("unlocks a node once all of its prerequisites are learnt", () => {
    const empty = deriveStates(GRAPH, new Map());
    expect(empty["1.01"].state).toBe("available");
    expect(empty["1.02"].state).toBe("locked");

    const views = deriveStates(
      GRAPH,
      new Map([
        ["1.01", { status: "learnt" as const, mastery: 0.9 }],
        ["1.02", { status: "learning" as const, mastery: 0.3 }],
        ["1.03", { status: "learnt" as const, mastery: 0.85, reviewDue: true }],
      ]),
    );
    expect(views["1.01"].state).toBe("learnt");
    expect(views["1.02"].state).toBe("learning");
    expect(views["1.03"].state).toBe("review");
    expect(views["1.04"].state).toBe("available");
    expect(views["1.12"].state).toBe("locked");
  });

  it("maps mastery onto four steps", () => {
    expect([0, 0.1, 0.3, 0.6, 0.95].map(masteryStep)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("seeding the database", () => {
  it("copies the graph, updates it in place and retires removed nodes", async () => {
    const db = await testDb();
    const first = await seedCurriculum(db, GRAPH);
    expect(first).toEqual({ nodes: 89, edges: GRAPH.edges.length, retired: 0 });
    expect(await db.$count(node)).toBe(89);
    expect(await db.$count(edge)).toBe(GRAPH.edges.length);

    const smaller = buildGraph([GRAPH.nodes.filter((n) => n.phase === 1)]);
    const second = await seedCurriculum(db, smaller);
    expect(second.retired).toBe(71);
    const [rainfall] = await db.select().from(node).where(eq(node.id, "1.18"));
    expect(rainfall.retired).toBe(false);
    const [drift] = await db.select().from(node).where(eq(node.id, "2.15"));
    expect(drift.retired).toBe(true);
    expect(await db.$count(edge)).toBe(smaller.edges.length);
  });
});

describe("map arrangement", () => {
  it("keeps every idea and never lets two phases overlap, in one, two or three columns", async () => {
    const { computeLayout } = await import("@/curriculum/layout");
    const { arrange, bestColumns } = await import("@/components/map/arrange");
    const layout = await computeLayout(GRAPH);
    const phaseOf = new Map(GRAPH.nodes.map((n) => [n.id, n.phase]));
    for (const columns of [1, 2, 3]) {
      const a = arrange(layout, phaseOf, columns);
      expect(a.nodes).toHaveLength(GRAPH.nodes.length);
      for (const x of a.bands) {
        for (const y of a.bands) {
          if (x === y) continue;
          const apart =
            x.x + x.width <= y.x || y.x + y.width <= x.x || x.y + x.height <= y.y || y.y + y.height <= x.y;
          expect(apart).toBe(true);
        }
      }
    }
    expect(bestColumns(layout, phaseOf, 1400, 650)).toBeGreaterThan(1);
    expect(bestColumns(layout, phaseOf, 360, 560)).toBe(1);
  });
});
