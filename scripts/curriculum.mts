// Runs before every build. It refuses to continue if the curriculum graph is invalid,
// and on production deploys it copies the graph into the database. Preview builds
// share the database, so they validate only and never overwrite it.
import { buildGraph, validateGraph } from "../src/curriculum/graph";

const graph = buildGraph();
const problems = validateGraph(graph);
if (problems.length > 0) {
  console.error(`[curriculum] The graph has ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
console.log(`[curriculum] ${graph.nodes.length} nodes and ${graph.edges.length} edges are valid.`);

const url = process.env.DATABASE_URL;
const vercelEnv = process.env.VERCEL_ENV;
if (!url) {
  console.log("[curriculum] DATABASE_URL is not set; skipping the database copy.");
} else if (vercelEnv && vercelEnv !== "production") {
  console.log(`[curriculum] This is a ${vercelEnv} build; skipping the database copy.`);
} else {
  const { getDb } = await import("../src/db/client");
  const { seedCurriculum } = await import("../src/server/curriculum/seed");
  const result = await seedCurriculum(getDb(), graph);
  console.log(
    `[curriculum] Copied ${result.nodes} nodes and ${result.edges} edges to the database` +
      (result.retired ? `, and retired ${result.retired}.` : "."),
  );
  process.exit(0);
}
