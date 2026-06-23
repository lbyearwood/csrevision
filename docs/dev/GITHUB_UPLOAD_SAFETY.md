# GitHub Upload Safety

Last updated: 2026-06-21

Use this document before creating branches, pushing code, or changing GitHub Pages settings.

## Target Repository

- Production repository: `https://github.com/lbyearwood/csrevision`
- Main live site branch: `main`
- Astro rebuild branch: `astro-site`

## Branch Rule

1. Upload Astro rebuild work to the `astro-site` branch only.
2. Do not call the branch `astro-preview`.
3. Do not push Astro rebuild files to `main`.
4. Do not merge `astro-site` into `main` unless the user explicitly says the Astro rebuild is ready to replace the live site.

## GitHub Pages Rule

1. The existing `lbyearwood/csrevision` GitHub Pages site is the live main site.
2. Do not change the Pages source, build workflow, custom domain or deployment settings for `lbyearwood/csrevision` unless the user explicitly approves a launch.
3. Do not deploy `astro-site` from the production repository's Pages settings while the main site is still live.
4. If a GitHub Pages preview is needed, use a separate preview repository so the live Pages site is not affected.

## Preview Repository

1. Use a separate repository for hosted previews, for example `lbyearwood/csrevision-astro-site-preview`.
2. Treat the preview repository as disposable and non-production.
3. When deploying Astro to a project Pages preview repository, check whether `astro.config.mjs` needs a `base` value matching the repository name.
4. Keep preview deployment notes in this document or `docs/dev/HANDOVER.md`.

## Current Status

1. The remote `astro-site` branch was created from `main` on 2026-06-21.
2. The Astro rebuild source should live in the `astro-site/` folder on that branch.
3. The old working/reference site should live in the `app/` folder on that branch.
4. `app/` is required for migration reference and must be treated as read-only unless the user explicitly requests old-site changes.
5. The shared `app/` reference includes the old site courses, assets, data, scripts, styles, readme and wireframe PDF.
6. The old `app/planning & quality assurance/` archive is not part of the shared branch because it contains very long Windows paths and is not required for lesson migration.
7. Future uploads should be done from a proper clone of `lbyearwood/csrevision`, then switched to `astro-site`.
8. The laptop workspace at `C:\Users\Myron\Documents\Development\csrevision` is a valid `astro-site` checkout as of 2026-06-23.

## Two-Codex Coordination

1. PC Codex and Laptop Codex are separate Codex sessions working from separate local clones.
2. Known workspace examples include `C:\Users\Max\Documents\Development\csrevision` on the PC and `C:\Users\Myron\Documents\Development\csrevision` on the laptop.
3. Both Codexes must use the same remote branch: `astro-site`.
4. Before starting work, each Codex should pull the latest `astro-site` branch.
5. Before pushing, each Codex should check what it changed and update `docs/dev/HANDOVER.md` if the project state changed materially.
6. Do not overwrite the other Codex's work. If the same file changed in both places, inspect and merge intentionally.
7. Keep generated folders and machine-local files out of Git: `node_modules/`, `.astro/`, `dist/`, nested `.git/`, `*.log`, `*.pid` and `.env*`.

## Laptop Codex Start

1. Clone the repo.
2. Switch to `astro-site`.
3. Install dependencies from `astro-site/package-lock.json`.
4. Run build and dev commands from `astro-site/`.

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git switch astro-site
cd astro-site
npm.cmd install
npm.cmd run build
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

The old site reference for migration is available at `../app/` from inside `astro-site/`.
