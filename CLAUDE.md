@AGENTS.md

# Frame: notes for Claude

Frame is Arnav's personal university for learning game development. The approved plan lives in the project
thread; this file records the rules that every change must keep.

- Write all user-facing text in Indian English, in sentence case, with plain words. No emojis, no exclamation
  marks, and no external images or third-party diagrams.
- Style only through the Midnight design system. Tokens live in `src/styles/midnight-tokens.css` (unchanged
  from the supplied package) and Tailwind can only use colours mapped from them in `src/app/globals.css`.
  Components live in `src/components/midnight/` and follow the supplied READMEs.
- Colour means state: `accent` for in progress or in focus, `success` for learnt or passed, `warning` for a
  review due, `error` for a failed check or misconception, `idle` (always with a text label) for locked.
- One primary Button per view. Hairlines, not shadows. Corners 2px, 4px, 6px.
- Secrets live only in Vercel environment variables, never in the repository.
- Before opening a pull request, run `npm run check` (lint, typecheck, tests and build).
- Claude merges every pull request once CI is green. Arnav does not merge.
- Database migrations must stay additive (new tables or nullable columns) until the code that needs them is merged.
