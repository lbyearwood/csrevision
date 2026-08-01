# Prototypes

This directory contains runnable mock designs, interaction experiments and disposable mini-sites used to evaluate ideas before production implementation.

## Suggested structure

```text
Prototypes/
  shared/
  teacher-portal/
  student-portal/
  question-types/
```

Create a separate folder for each prototype. Include a short README describing its purpose, how to run it, its status and any decisions made from it.

## Current prototypes

- [Question Lab](./question-types/README.md) — Batches 1–2 review site for the first ten deterministic auto-mark question types.

## Boundaries

- Treat everything here as non-production unless it is explicitly promoted into the application.
- Do not connect prototypes to production Supabase projects or real user data.
- Keep approved screenshots and static visual references in `Planning/Design/`.
- Keep production components and application behaviour in `src/`.
- Remove or archive superseded experiments so it remains clear which prototype is current.
