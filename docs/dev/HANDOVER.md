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
- Default GCSE target audience is 11-18, especially 14-16. Lesson design must serve young learners with purposeful icons, symbols, imagery, diagrams, relatable scenarios and interaction rather than adult business-dashboard styling.
- Dev dashboard for reusable layout/card/component review.
- Dev dashboard separates Shells from Layouts: the standard numbered slide shell is not counted as a layout.
- Visible `LessonSlideShell` badge/header labels are restricted to `Lesson introduction`, `Lesson summary`, or `Part [number] - [title]`.
- A single lesson must not reuse one part number with different titles.
- `TitleSegmentSlide` is only for the opening lesson title slide or a between-parts divider. Part dividers must show the full `Part [number] - [title]` label.
- Starter/introduction activity slides must use the fixed heading `Lesson starter`, not custom labels such as `Upgrade challenge`.
- Segue/overview slides that bridge into the lesson parts sit immediately before the first part title and remain labelled as `Lesson introduction`.
- Repeated lesson navigation topics should use short lettered labels, such as `Clock speed (A)` and `Clock speed (B)`.
- `FourEqualCards` is reserved for true quadrant/matrix/four-way comparison content, not typical overview slides or ordinary groups of four cards.
- Layouts are now structural 2 by 2 card arrangements only, plus the title segment slide exception.
- The reusable module catalogue is accepted as of 2026-06-23: 1 shell, 9 layouts, 25 cards, 20 components and 6 widgets.
- Reusable card examples should compose smaller code-named components where practical. Current examples include InteractiveTableCard and MisconceptionCard using FeedbackState, ExamQuestionCard using LabelBadge, FlashCard and VisualFlashCard using FlipCard, and CodingCard using CodeBlock.
- LearningObjectivesCard now exists as a real wrapper component in `astro-site/src/components/lesson/cards/LearningObjectivesCard.astro`; use that codeName directly rather than treating the card as a SummaryCard variant.
- Structured content/data should drive future lesson creation.
- Lesson creation must follow the staged approval workflow in `docs/dev/LESSON_CREATION_WORKFLOW.md`.
- User adjustments must be documented as hardline protocols in `SITE_QA_AND_DEVELOPMENT_RULES.md`, not left as informal thread context.
- Stage 0 must define target audience and engagement needs before Stage 1 planning or component selection.
- For rich learner-facing visuals, prefer OpenAI-generated bitmap images over hand-authored SVG. Keep SVG/code-native drawings for exact diagrams, labels, gates and connector work.
- Advert/poster graphics must be visually checked at card size: no overlapping text/graphics, no cramped copy, and captions should carry explanation where possible.

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
- The user approved the Stage 2 direction but found the Stage 3 implementation too far from the agreed teaching/resource design.
- The user has been turning those corrections into hardline project protocols.
- The user then asked to pause the OpenAI image-generation update and push the current checkpoint to Git.

Workflow state:

1. Stage 0 complete: OCR J277 spec checked and old `app/` lesson, task, quiz and exam routes audited.
2. Stage 1 complete: lesson arc approved with an interesting intro, learning objectives, clock speed, cache, cores, application, summary and exam practice.
3. Stage 2 needs to inform Stage 3 more tightly; future builds must name accepted layout/card/component/widget codeNames and graphic briefs before implementation.
4. Stage 3 started: only the lesson opening, introduction, objectives, overview/segue and Part 1 clock-speed slides have been built.
5. Do not build the rest of the lesson in one pass. Continue part by part after the user accepts the current part.

Built in Astro:

```text
astro-site/src/pages/gcse/computer-systems/cpu-performance/index.astro
```

Route:

```text
http://127.0.0.1:4321/gcse/computer-systems/cpu-performance/
```

Implemented slides:

1. `CPU performance`
2. `Lesson starter`
3. `Learning objectives`
4. `CPU factors`
5. `Part 1 - Clock speed`
6. `Clock speed (A)`
7. `Clock speed (B)`

Current lesson structure:

1. Opening title slide uses `TitleSegmentSlide` with no extra badge/header.
2. Starter slide uses `Lesson starter`, `TwoTopCardsWideBottomCard`, two `ImageCard`s and a prediction `QuestionCard`.
3. Learning objectives use `LearningObjectivesCard`, `LearningObjectiveItem` and `CommandWord`.
4. Overview/segue slide uses ImageCards for clock speed, cache size and number of cores and remains labelled `Lesson introduction`.
5. Part divider uses `TitleSegmentSlide` with `Part 1 - Clock speed`.
6. Part 1 has two teaching slides: `What is clock speed?` and `How does clock speed affect performance?`.

Important implementation notes:

1. `LessonSlideShell` badge/header labels are validated through `astro-site/src/lib/lessonSlideShellLabels.ts`.
2. `LessonPage` now checks for duplicate part numbers with conflicting titles when data-driven lessons provide shell labels.
3. `LessonSideNav` heading now says `Lesson slide navigation`.
4. The CPU performance page currently references SVG visuals in `astro-site/public/images/lessons/cpu-performance/`.
5. OpenAI image-generation work was started and then paused by the user before integration.
6. Draft OpenAI bitmap images have been copied into the repo for review at `astro-site/public/images/lessons/cpu-performance/openai-drafts/`.
7. Do not treat the OpenAI draft images as accepted final assets yet. Review them with the user, choose replacements, then update the lesson image paths.
8. The current preferred direction is: OpenAI-generated bitmap images for rich learner-facing visuals; SVG/code-native visuals only for precise diagrams, gates, connectors or deterministic labels.

OpenAI draft image files now available for review:

```text
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-clock-speed-advert-draft.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-cores-advert-draft.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-clock-speed-visual-draft.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-cache-visual-draft.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-cores-visual-draft.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-clock-pulses-comparison-draft-a.png
astro-site/public/images/lessons/cpu-performance/openai-drafts/openai-clock-pulses-comparison-draft-b.png
```

QA already run for the current checkpoint:

```powershell
npm.cmd run build
```

Build passed from `astro-site/`.

Browser QA already performed:

1. Current route returned HTTP 200 on the local dev server.
2. Slide 2 was opened through the lesson navigation, not only by URL.
3. Lesson starter advert section was visually checked.
4. Target slide images loaded with 0 broken target images.
5. Browser console warnings/errors checked for the slide section: 0.

Known follow-up:

1. Review the OpenAI draft images with the user.
2. Replace the current SVG image references only after the user accepts the draft direction.
3. After replacing images, run `npm.cmd run build` and Edge visual QA at card size.
4. Re-check the lesson against the protocols in `SITE_QA_AND_DEVELOPMENT_RULES.md`.
5. Do not proceed to Part 2 until the user accepts Part 1.
6. After Part 1 is accepted, build Part 2: Cache Size and Cache Levels.
7. Keep following `docs/dev/LESSON_CREATION_WORKFLOW.md`.

## Known Limitations

- Edge physical interaction QA must be proven per task; do not infer it from code or screenshots.
- Future GitHub uploads should happen from a proper clone of `lbyearwood/csrevision` on the `astro-site` branch.
