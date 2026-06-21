# Handover

This is the living handover for future Codex sessions. Update it when the project state changes materially.

## Current State

- The active rebuild is in `astro-site/`.
- The old reference site is in `app/`.
- Active Codex-maintained dev docs are in `docs/dev/`.
- The dev server should run at `http://127.0.0.1:4321/`.
- The project has been moved out of OneDrive, fixing the Vite/esbuild optimisation issue.
- The remote GitHub branch for the Astro rebuild is `astro-site` in `lbyearwood/csrevision`.
- The live `main` branch and GitHub Pages setup must not be changed for preview work.
- This local workspace has an empty `.git/` directory, so it is not currently a valid Git checkout.
- There are two Codex sessions working on the project: PC Codex on this PC, and Laptop Codex on the user's laptop.
- Both Codexes should coordinate through the remote `astro-site` branch.

## Current Useful Routes

```text
/
/gcse/
/gcse/computer-systems/cpu-architecture/
/gcse/computer-systems/cpu-architecture/exam/
/gcse/computer-systems/cpu-architecture/quiz/
/dev-dashboard/
/dev-dashboard/layouts/[slug]/
/dev-dashboard/cards/[slug]/
```

## Current Commands

Run from `astro-site/`:

```powershell
npm.cmd run build
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

## Two-Codex Workflow

1. PC Codex and Laptop Codex must pull `astro-site` before starting development.
2. PC Codex and Laptop Codex must push only to `astro-site` until the user approves launch.
3. Do not overwrite the other Codex's changes. Inspect conflicts and merge deliberately.
4. Update this handover when a Codex changes project state, branch state, environment setup or major UI/component status.
5. Keep generated files out of Git: `node_modules/`, `.astro/`, `dist/`, `*.log`, `*.pid` and `.env*`.

## Current Architecture Direction

- Static Astro rebuild.
- Tailwind CSS.
- Single-page lesson model.
- Shared lesson shell.
- Dev dashboard for reusable layout/card/component review.
- Structured content/data should drive future lesson creation.

## Current Priorities

1. Let the user review reusable card routes from the Dev dashboard.
2. Amend and accept cards one by one.
3. Review and accept needed layouts.
4. Define final lesson data shape.
5. Create and use the migration audit template.
6. Fully audit old `1.1.1 Architecture of the CPU`.
7. Complete the full `1.1.1` lesson/resource migration.

## Known Limitations

- Draft layout routes are not approved teaching patterns until reviewed and accepted.
- Several reusable components remain missing, including hinge question, process/sequence and vocabulary cards.
- Edge physical interaction QA must be proven per task; do not infer it from code or screenshots.
- Future GitHub uploads should happen from a proper clone of `lbyearwood/csrevision` on the `astro-site` branch.
