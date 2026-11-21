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
npm run check      # lint, typecheck and production build
```

## Layout

| Path | What it holds |
| --- | --- |
| `src/app` | Pages, the root layout, the web app manifest and icons |
| `src/components/midnight` | The Midnight components, ported to typed React |
| `src/components/frame` | Frame's own shell: header, wordmark, greeting, progress |
| `src/styles/midnight-tokens.css` | Midnight's tokens, exactly as supplied |
| `src/lib` | Small shared helpers |

`/design` is a private reference page that shows every Midnight token and component in both themes.

## Design

Frame follows the Midnight design system: dark first, hairlines instead of shadows, near-square corners, and a
single navy accent that only marks state. Midnight's typeface, PP Neue Montreal, is commercially licensed and
not bundled, so Frame self-hosts the named fallbacks, Inter Tight and JetBrains Mono.
