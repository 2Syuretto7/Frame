@AGENTS.md

# Frame: notes for Claude

Frame is Arnav's personal university for learning game development. The approved plan lives in the project
thread; this file records the rules that every change must keep.

- Write all user-facing text in Indian English with British spelling (colour, centre, practise as a verb), in
  sentence case, with plain words, for a learner and never for a developer: no milestones, tokens, frameworks or
  "coming in a later update" notes. No emojis, no exclamation marks, and no external images or third-party diagrams.
- Frame mirrors its sister apps, Frontier and Polymath (github.com/2Syuretto7/Frontier and /Polymath): the same
  design system, top bar, home, course map, lesson layout and settings. Game-specific parts, such as the code
  editor and the playable diagrams, are Frame's own but use the same tokens and classes.
- Style only through the family design system in `src/styles/family.css`. Everything above its "Frame additions"
  marker is copied verbatim from Polymath's `globals.css`; put Frame-only rules below that marker. Tailwind can only
  use the colours mapped from it in `src/app/globals.css`. Shared components live in `src/components/ui/` and
  `src/components/shell/`, copied from the sister apps where they exist.
- The site follows the device's light or dark setting, as the sister apps do. There is no theme selector.
- Colour means state: `accent` for in progress or in focus, `success` for learnt, `warning` for a review due,
  `danger` for a failed check or a destructive action, `muted` pills (always with a text label) for locked.
- One primary button per view. Hairlines, not shadows. Corners 2px and 6px; pills are the only rounded element.
- Layout: signed-in pages use `Page`, the family `.shell` with the top bar and the 720px `.page` column. The map
  table and the knowledge map use `<Page wide>` (the 1280px frame). Lessons use the family `.lesson-layout` with
  the section rail. Text is left-aligned.
- The top bar is identical on every signed-in page: the Frame mark and wordmark, Home and Map links with the
  current section marked, and the account menu holding Settings and Sign out.
- Buttons say exactly what they do ("Start 1.01: Programs and output", not "Learn"). The home page's primary
  button goes straight to the next lesson. No placeholder pages in the main flow.
- Destructive actions (signing out, deleting, resetting) always ask once, in place, before they happen.
- Text meets WCAG AA contrast, focus is always visible, and everything works with a keyboard, including the map.
- Test every page you change on laptop (1440 by 900), tablet (iPad) and phone (iPhone) before opening a pull request.
- Secrets live only in Vercel environment variables, never in the repository.
- Before opening a pull request, run `npm run check` (lint, typecheck, tests and build).
- Claude merges every pull request once CI is green. Arnav does not merge.
- Database migrations must stay additive (new tables or nullable columns) until the code that needs them is merged.
