# Handover

This is the living handover for future Codex sessions. Update it when the project state changes materially.

## Current State

- The active rebuild is in `astro-site/`.
- The old reference site is in `app/`.
- The `app/` folder is included on the remote `astro-site` branch so Laptop Codex can continue migrations.
- The old `app/planning & quality assurance/` archive is intentionally not shared because it contains very long Windows paths and is not required for lesson migration.
- Active Codex-maintained dev docs are in `docs/dev/`.
- The dev server should run at `http://127.0.0.1:4321/`.
- The project has been moved out of OneDrive, fixing the Vite/esbuild optimisation issue.
- The remote GitHub branch for the Astro rebuild is `astro-site` in `lbyearwood/csrevision`.
- The live `main` branch and GitHub Pages setup must not be changed for preview work.
- The laptop workspace at `C:\Users\Myron\Documents\Development\csrevision` is a valid `astro-site` checkout as of 2026-06-23.
- There are two Codex sessions working on the project: PC Codex on this PC, and Laptop Codex on the user's laptop.
- Both Codexes should coordinate through the remote `astro-site` branch.

## Current Useful Routes

```text
/
/gcse/
/gcse/computer-systems/cpu-architecture/
/gcse/computer-systems/cpu-architecture/exam/
/gcse/computer-systems/cpu-architecture/quiz/
/gcse/computer-systems/cpu-performance/
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
5. Keep generated files out of Git: `node_modules/`, `.astro/`, `dist/`, nested `.git/`, `*.log`, `*.pid` and `.env*`.
6. Treat `app/` as migration reference only unless the user explicitly asks to change the old site.
7. Use the old `app/courses/`, `app/assets/`, `app/data/`, scripts and styles for migration audits.

## Current Architecture Direction

- Static Astro rebuild.
- Tailwind CSS.
- Single-page lesson model.
- Shared lesson shell.
- Dev dashboard for reusable layout/card/component review.
- Dev dashboard separates Shells from Layouts: the standard numbered slide shell is not counted as a layout.
- Layouts are now structural 2 by 2 card arrangements only, plus the title segment slide exception.
- The reusable module catalogue is accepted as of 2026-06-23: 1 shell, 9 layouts, 25 cards, 20 components and 6 widgets.
- Reusable card examples should compose smaller code-named components where practical. Current examples include InteractiveTableCard and MisconceptionCard using FeedbackState, ExamQuestionCard using LabelBadge, FlashCard and VisualFlashCard using FlipCard, and CodingCard using CodeBlock.
- LearningObjectivesCard now exists as a real wrapper component in `astro-site/src/components/lesson/cards/LearningObjectivesCard.astro`; use that codeName directly rather than treating the card as a SummaryCard variant.
- Structured content/data should drive future lesson creation.
- Lesson creation must follow the staged approval workflow in `docs/dev/LESSON_CREATION_WORKFLOW.md`.

## Current Priorities

1. Continue `1.1.2 CPU performance` with the staged workflow.
2. Review and improve the already-built Part 1 clock speed slides with the user before moving on.
3. Build Part 2 only after Part 1 is accepted: cache size, cache levels L1/L2/L3, and cache scenario checking.
4. Define final lesson data shape once the route-specific lesson page approach has been tested against more lesson parts.
5. Create and use the migration audit template.
6. Fully audit old `1.1.1 Architecture of the CPU`.
7. Complete the full `1.1.1` lesson/resource migration.

## Lesson Creation Workflow

The user has approved a staged lesson creation process. Future Codex sessions must read and follow:

```text
docs/dev/LESSON_CREATION_WORKFLOW.md
```

Current understanding:

1. Codex must not build a whole lesson in one pass.
2. Codex should understand the topic and source material first.
3. Codex should plan the whole lesson arc and get agreement.
4. Codex should create the slide skeleton with titles, layout codeNames, module codeNames and placeholders, then get agreement.
5. Codex should build one lesson part at a time, including text, visuals, models and checks for that part, then get agreement.
6. Codex should complete a whole-lesson coherence pass and Edge QA before marking the lesson complete.

Reference specification added:

```text
docs/reference/specifications/ocr-gcse-computer-science-j277-specification.pdf
```

This OCR J277 PDF was supplied by the user on 2026-06-23. During extraction, the network hardware content appeared under the OCR networks section as hardware needed to connect stand-alone computers into a LAN: wireless access points, routers, switches, NICs and transmission media. The user referred to the practice topic as `1.3.4 Network hardware`; treat that as the user-facing topic label unless they correct it.

Practice proposal for Network hardware:

1. Why Network Hardware Is Needed
2. Connecting A Device To A Network
3. Connecting Devices Inside A LAN
4. Connecting Wireless Devices
5. Connecting Networks Together
6. Choosing Hardware For A Scenario

The next Codex should use the formal workflow rather than improvising a new process.

## Active Lesson Handover: 1.1.2 CPU performance

Date: 2026-06-24

Worker: PC Codex.

User intent:

- The user is testing the formal staged lesson creation workflow.
- The user approved Stage 2 after it was strengthened into a detailed slide blueprint.
- The user said the current Part 1 implementation needs improvements, but asked PC Codex to stop for now, update docs, write this handover and push so Laptop Codex can continue tomorrow.

Workflow state:

1. Stage 0 complete: OCR J277 spec checked and old `app/` lesson, task, quiz and exam routes audited.
2. Stage 1 complete: lesson arc approved with an interesting intro, learning objectives, clock speed, cache, cores, application, summary and exam practice.
3. Stage 2 complete: detailed 15-slide blueprint approved.
4. Stage 3 started: only Part 1 has been built.
5. Do not build the rest of the lesson in one pass. Continue part by part.

Built in Astro:

```text
astro-site/src/pages/gcse/computer-systems/cpu-performance/index.astro
```

Route:

```text
http://127.0.0.1:4321/gcse/computer-systems/cpu-performance/
```

Implemented slides:

1. CPU Performance
2. Upgrade Challenge
3. Learning Objectives
4. The Three CPU Performance Factors
5. Clock Speed Means Cycles Per Second
6. Faster Clock Speed Can Process More Instructions

Part 1 content includes:

1. Clock speed definition.
2. GHz as billions of cycles per second.
3. More cycles per second can allow more instructions per second.
4. Interactive instruction-throughput model with previous, next and reset controls.
5. Misconception correction for "higher clock speed always makes every task faster".
6. Hinge question with correct/incorrect feedback and reset.

Important implementation notes:

1. `1-1-2` lesson is now wired into GCSE topic routing via `astro-site/src/data/routes.ts`, `astro-site/src/data/gcseTopics.ts` and `astro-site/src/data/resourceStatus.ts`.
2. `LearningObjectivesCard` was added as a real component and the Dev dashboard learning objectives example now uses it directly.
3. The lesson page currently uses route-specific Astro composition with accepted reusable card/component codeNames. This was chosen because the older data-driven `LessonPage` renderer does not yet express the accepted 2 by 2 layout/card system strongly enough.
4. Before continuing, Laptop Codex should open the route with the user and record the specific improvements requested for Part 1.
5. Do not proceed to cache until the user accepts Part 1.

QA already run for this work:

```powershell
npm.cmd run build
npm.cmd test
```

Both passed from `astro-site/`.

Browser QA already performed:

1. New route returned HTTP 200 on the local dev server.
2. Desktop screenshot reviewed.
3. Tablet screenshot reviewed.
4. Mobile screenshot reviewed.
5. The screenshot rule caught mobile title overflow; PC Codex fixed it and rechecked.
6. Model next/reset interaction tested.
7. Hinge question correct state tested.
8. Browser console errors checked: 0.

Known follow-up:

1. User has not accepted Part 1 yet.
2. User said improvements are needed but did not list them in this turn.
3. Laptop Codex should start by asking/confirming the Part 1 improvement list, then amend Part 1 and re-run screenshot QA.
4. After Part 1 is accepted, build Part 2: Cache Size and Cache Levels.
5. Keep following `docs/dev/LESSON_CREATION_WORKFLOW.md`.

## Known Limitations

- Edge physical interaction QA must be proven per task; do not infer it from code or screenshots.
- Future GitHub uploads should happen from a proper clone of `lbyearwood/csrevision` on the `astro-site` branch.
