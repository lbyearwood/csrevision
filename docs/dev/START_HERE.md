# Start Here

This is the first document future Codex sessions should read before working on CS Revision.

## Naming Rule

Active development documents should use stable, undated filenames. Record dates inside the document for decisions, handovers and incidents. Do not create new dated handover files unless the user explicitly asks for an archive snapshot.

## User Task Shorthand

- When the user writes `Q.` at the start of a request or task, treat it as "add this to the queue of work to do". Add the item to the current task queue/backlog for project workers rather than treating `Q.` as a typo or question marker.

## Read Order

1. `CODEX.md`
2. `docs/dev/START_HERE.md`
3. `SITE_QA_AND_DEVELOPMENT_RULES.md`
4. `docs/dev/GITHUB_UPLOAD_SAFETY.md`
5. `docs/dev/ENVIRONMENT.md`
6. `docs/dev/QA_CHECKLIST.md`
7. `docs/dev/TROUBLESHOOTING.md`
8. `docs/dev/ARCHITECTURE.md`
9. `docs/dev/COMPONENT_REGISTRY.md`
10. `docs/dev/MIGRATION_WORKFLOW.md`
11. `docs/dev/HANDOVER.md`

## Project Boundary

- `app/` is the old working site and must be treated as a read-only reference unless the user explicitly asks for changes there.
- `astro-site/` is the new Astro rebuild. New rebuild work belongs there.
- Active project guidance belongs in `docs/dev/`.
- `astro-site/README.md` may remain as the package-level README beside `package.json`.

## GitHub Upload Boundary

- Production repo: `lbyearwood/csrevision`.
- Remote Astro rebuild branch: `astro-site`.
- Never push the Astro rebuild to `main` unless the user explicitly approves replacing the live site.
- Never change the production repo's GitHub Pages source or deployment settings for preview work.
- Use `docs/dev/GITHUB_UPLOAD_SAFETY.md` before any branch, push or Pages work.

## Current Development Surface

- Main local URL: `http://127.0.0.1:4321/`
- GCSE dashboard: `http://127.0.0.1:4321/gcse/`
- Dev dashboard: `http://127.0.0.1:4321/dev-dashboard/`
- Build command: run `npm.cmd run build` from `astro-site/`
- Dev command: run `npm.cmd run dev -- --host 127.0.0.1 --port 4321` from `astro-site/`
- Test command: run `npm.cmd test` from `astro-site/`
- Unit tests: run `npm.cmd run test:unit` from `astro-site/`
- Browser tests: run `npm.cmd run test:e2e` from `astro-site/`
- Test tooling: Playwright (`@playwright/test`) and Vitest are project dev dependencies. Run `npm.cmd install` in `astro-site/` on a fresh setup to install them.

## Core Rules

- Use UK English.
- Keep the rebuilt site static Astro and Tailwind.
- Do not add a traditional backend.
- Do not connect Supabase until explicitly requested.
- Keep public pages free from developer-only wording.
- Use Edge for required browser QA on user-facing changes.
- Update `docs/dev/TROUBLESHOOTING.md` whenever a new development, build, server, browser-control, QA or tooling error is discovered.
