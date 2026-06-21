# CS Revision Astro rebuild

This folder is the new rebuild of the CS Revision site. The old working site remains in `../app` and must be treated as a read-only reference unless a task explicitly says otherwise.

Before starting development, read `../CODEX.md`, then `../docs/dev/START_HERE.md`.

The shared remote development branch is `astro-site`. PC Codex and Laptop Codex both use that branch and should pull before starting work, then push only intentional source/docs changes back to `astro-site`.

The old working site is available in `../app/` for migration reference. Treat it as read-only unless the user explicitly asks for old-site changes.

## Architecture

- Astro renders the static site.
- Tailwind CSS provides the shared styling system.
- Reusable Astro components live under `src/components`.
- Structured course and lesson data starts in `src/data`.
- Future shared logic belongs in `src/lib`.
- Future lesson, quiz, exam and task content belongs in `src/content`.

## Migration rules

- Do not migrate GCSE or BTEC content in bulk.
- Do not copy old pages blindly from `../app`.
- Inspect old pages before migrating them, preserve important teaching behaviour, then rebuild the page with reusable components.
- Keep lessons as single web pages with multiple sections, not slide decks.
- Use the CPU architecture lesson as the first layout target for future structured lessons.

## Current starter routes

The initial routes are:

- `/` homepage
- `/gcse/` GCSE dashboard
- `/gcse/computer-systems/cpu-architecture/` CPU architecture single-page lesson

The lesson layout demonstrates:

- top blue course bar
- left lesson navigation on desktop
- compact lesson navigation on mobile
- two balanced main teaching cards
- full-width support card under the main cards

## Commands

Run commands from this folder:

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the built output |

Do not commit generated or machine-local files such as `node_modules/`, `.astro/`, `dist/`, logs, PID files or `.env*`.

## Future Supabase boundary

Supabase is not connected yet. Static lesson content should stay in files or content collections. Future student/staff data, progress, scores and attempts should live behind adapter-style files such as `src/lib/progress/localProgressAdapter.ts` and later `src/lib/progress/supabaseProgressAdapter.ts`.
