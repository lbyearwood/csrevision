# Migration Workflow

Use this workflow when migrating old content from `app/` into `astro-site/`.

## Rule

Do not bulk migrate. Migrate one lesson or resource set at a time.

## GitHub Safety

1. Keep all Astro rebuild uploads on the `astro-site` branch in `lbyearwood/csrevision`.
2. Do not upload rebuild work to `main`.
3. Do not change GitHub Pages settings for preview work.
4. Read `docs/dev/GITHUB_UPLOAD_SAFETY.md` before any GitHub branch, push or Pages task.

## Before Building

1. Read `SITE_QA_AND_DEVELOPMENT_RULES.md`.
2. Complete the Edge pre-amendment gate if the task affects rendered site output.
3. Inspect the old reference page in `app/`.
4. Inspect any related old JavaScript, CSS, assets, quizzes, tasks and exam pages.
5. Identify the teaching purpose and important interactions.
6. Decide whether each old item becomes lesson content, task content, quiz content, exam content, an interactive rebuild, or an intentional omission.

## Audit Fields

Record these for each migration:

- Old route or file.
- New route or file.
- Topic code and title.
- Resource type: Lesson, Tasks, Exam or Quiz.
- Old teaching sections or slides.
- Retained teaching points.
- Omitted content and reason.
- Required images or diagrams.
- Required JavaScript interactions.
- Required D3 or modelling behaviour.
- Required assessment content.
- Chosen reusable layouts.
- Chosen cards/components.
- Accessibility risks.
- QA notes.

## Build Rules

- Build from structured data and reusable components where practical.
- Do not copy old HTML blindly.
- Do not create one-off layout code unless the teaching purpose genuinely needs it.
- Preserve important reveal buttons, steppers, trace tables, quizzes, modals and diagrams.
- Keep public pages free from developer-only wording.
- Keep `app/` unchanged unless explicitly requested.

## First Full Migration Target

The first full migration target is:

```text
1.1.1 Architecture of the CPU
```

Recommended order:

1. Finish reusable card review.
2. Review and accept needed layouts.
3. Define final lesson data shape.
4. Create a migration audit for old `1.1.1`.
5. Complete the full `1.1.1` lesson/resource migration.
6. Then migrate modelling-heavy lessons such as binary addition, characters and sound.

## Definition Of Done

A lesson is not fully migrated until:

- Old lesson page reviewed.
- Old slide deck reviewed where available.
- Old JavaScript reviewed where relevant.
- Old tasks, quiz and exam resources reviewed.
- Every old item has a migration decision.
- Retained teaching points are present in the new lesson/resource set.
- Required diagrams or visual models are rebuilt or intentionally replaced.
- Required interactions are rebuilt as reusable components.
- Lesson uses the shared single-page shell.
- Lesson cards/components are chosen for teaching purpose.
- Edge desktop, tablet and mobile QA passed.
- Edge physical interaction QA passed.
- `npm.cmd run build` passed.
- `app/` remains unchanged.
