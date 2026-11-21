# Frame

Frame is a personal university for learning game development: a single Learn button that plans each day's
session, a curriculum organised as a knowledge graph, interactive lessons, an in-browser code editor with a live
game preview, fresh AI-generated practice with spaced repetition, and a Feynman-style tutor.

It runs at frame.arnavraja.in.

## Stack

- Next.js (App Router) with TypeScript, deployed on Vercel
- Tailwind CSS, configured to use only the Midnight design system's tokens
- Neon Postgres and Claude, from Milestone 2 onwards

## Working on it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint, typecheck, tests and production build
```

## Layout

| Path | What it holds |
| --- | --- |
| `src/app` | Pages, the root layout, the web app manifest and icons |
| `src/components/midnight` | The Midnight components, ported to typed React |
| `src/components/frame` | Frame's own shell: header, wordmark, greeting, progress |
| `src/styles/midnight-tokens.css` | Midnight's tokens, exactly as supplied |
| `src/components/auth` | Setup, sign-in, reset and the signed-in devices list |
| `src/components/map` | The knowledge map: pannable SVG, list view and node panel |
| `src/curriculum` | The curriculum graph: one file per phase, with goals, links and generation briefs |
| `src/db` | Drizzle schema and database client; migrations live in `drizzle/` |
| `src/server` | Server-only code: authentication and copying the curriculum into the database |
| `scripts` | Steps run before each build: migrations, then graph validation and seeding |
| `src/lib` | Small shared helpers |

## The curriculum

The curriculum is a graph of 89 nodes in six phases, kept in `src/curriculum/phase-*.ts` and reviewed like code.
Every build validates it and stops if anything is wrong: a missing or later prerequisite, a cycle, a duplicated
link, an empty generation brief, or a phase game that does not build on its whole phase. Production builds then
copy the graph into the `node` and `edge` tables for the planner. Preview builds only validate, because they
share the database.

`/design` is a private reference page that shows every Midnight token and component in both themes.

## Design

Frame follows the Midnight design system: dark first, hairlines instead of shadows, near-square corners, and a
single navy accent that only marks state. Midnight's typeface, PP Neue Montreal, is commercially licensed and
not bundled, so Frame self-hosts the named fallbacks, Inter Tight and JetBrains Mono.
