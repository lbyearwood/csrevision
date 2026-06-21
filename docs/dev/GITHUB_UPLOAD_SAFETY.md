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
2. This local workspace is not currently a valid Git checkout because `.git/` is empty.
3. Future uploads should be done from a proper clone of `lbyearwood/csrevision`, then switched to `astro-site`.

