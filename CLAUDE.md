@AGENTS.md

# Frame: notes for Claude

Frame is Arnav's personal university for learning game development. The approved plan lives in the project
thread; this file records the rules that every change must keep.

- Write all user-facing text in Indian English with British spelling (colour, centre, practise as a verb), in
  sentence case, with plain words, for a learner and never for a developer: no milestones, tokens, frameworks or
  "coming in a later update" notes. No emojis, no exclamation marks, and no external images or third-party diagrams.
- Style only through the Midnight design system. Tokens live in `src/styles/midnight-tokens.css` (unchanged
  from the supplied package) and Tailwind can only use colours mapped from them in `src/app/globals.css`.
  Components live in `src/components/midnight/` and follow the supplied READMEs.
- Colour means state: `accent` for in progress or in focus, `success` for learnt or passed, `warning` for a
  review due, `error` for a failed check or misconception, `idle` (always with a text label) for locked.
- One primary Button per view. Hairlines, not shadows. Corners 2px, 4px, 6px.
- Layout: every page uses the one centred column (`--column`, 960px, via `Page`), with the header in the same
  column so the wordmark and navigation never move. Text is left-aligned. Only the knowledge map uses the full
  window width (`<Page wide>`).
- The header is identical on every signed-in page: wordmark, then labelled Home, Map and Settings links with the
  current section marked. Icons in navigation always carry a visible text label.
- Buttons say exactly what they do ("Start 1.01: Programs and output", not "Learn"). The home page's primary
  button goes straight to the next lesson. No placeholder pages in the main flow.
- Destructive actions (signing out, deleting, resetting) always ask once, in place, before they happen.
- Text meets WCAG AA contrast, focus is always visible, and everything works with a keyboard, including the map.
- Test every page you change on laptop (1440 by 900), tablet (iPad) and phone (iPhone) before opening a pull request.
- Secrets live only in Vercel environment variables, never in the repository.
- Before opening a pull request, run `npm run check` (lint, typecheck, tests and build).
- Claude merges every pull request once CI is green. Arnav does not merge.
- Database migrations must stay additive (new tables or nullable columns) until the code that needs them is merged.
