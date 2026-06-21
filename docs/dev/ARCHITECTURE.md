# Architecture

This document records the current architecture for the CS Revision Astro rebuild.

## Project Split

- `app/` is the old reference site.
- `astro-site/` is the new static Astro rebuild.
- `docs/dev/` is the active Codex-maintained development documentation.

## Technology

- Astro static output.
- Tailwind CSS.
- Astro components.
- Structured TypeScript data where useful.
- Vanilla JavaScript for simple browser interactions.
- Local D3 for modelling visuals where it improves learning.
- React or Svelte islands only for genuinely complex interactive components.

Do not add a traditional backend. Supabase is planned for later but must not be connected until explicitly requested.

## Current Astro Structure

Important folders:

```text
astro-site/src/components/
astro-site/src/components/lesson/
astro-site/src/components/lesson/cards/
astro-site/src/components/layout/
astro-site/src/components/navigation/
astro-site/src/data/
astro-site/src/pages/
astro-site/src/styles/
```

## Lesson Model

Lessons use a single-page model:

- A lesson route contains multiple numbered lesson sections.
- The lesson navigation jumps between sections on the same page.
- Desktop uses a sticky left lesson navigation.
- Tablet and mobile use a compact lesson navigation.
- General lesson tools belong in the lesson header tool pad.

Naming standard:

- `Lesson slide`: the whole numbered lesson section and scroll target.
- `Slide canvas`: the available teaching area inside the lesson slide.
- `Layout`: the whole slide pattern.
- `Card`: a reusable block inside a layout.
- `Component`: a smaller reusable part inside a card or layout.

## Dev Dashboard

The Dev dashboard is the review surface for reusable layouts, cards and components.

```text
/dev-dashboard/
/dev-dashboard/layouts/[slug]/
/dev-dashboard/cards/[slug]/
```

Draft layout routes are not approved teaching patterns until reviewed, amended and accepted.

## Content Principles

- GCSE Computer Science is the first migration priority.
- Rebuild GCSE structure from data or structured content.
- Do not bulk migrate old pages.
- Inspect old `app/` pages before rebuilding.
- Preserve teaching intent and important interactions.
- Public pages must not show developer-only wording.

