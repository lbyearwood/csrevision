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
/dev-dashboard/components/[slug]/
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
- The reusable module catalogue is accepted as of 2026-06-23: 1 shell, 9 layouts, 25 cards, 22 components and 6 widgets.
- Reusable card examples should compose smaller code-named components where practical. Current examples include InteractiveTableCard and MisconceptionCard using FeedbackState, ExamQuestionCard using LabelBadge, FlashCard and VisualFlashCard using FlipCard, and CodingCard using CodeBlock.
- LearningObjectivesCard now exists as a real wrapper component in `astro-site/src/components/lesson/cards/LearningObjectivesCard.astro`; use that codeName directly rather than treating the card as a SummaryCard variant.
- Structured content/data should drive future lesson creation.
- Lesson creation must follow the staged approval workflow in `docs/dev/LESSON_CREATION_WORKFLOW.md`.
- User adjustments must be documented as hardline protocols in `SITE_QA_AND_DEVELOPMENT_RULES.md`, not left as informal thread context.
- Hardline typography rule: unless text is a title or subtitle, use normal font weight (`400`). Question prompts, answer options, feedback, helper text, captions, button labels, table text, list text and normal card copy must not be heavy.
- Stage 0 must define target audience and engagement needs before Stage 1 planning or component selection.
- For rich learner-facing visuals, prefer OpenAI-generated bitmap images over hand-authored SVG. Keep SVG/code-native drawings for exact diagrams, labels, gates and connector work.
- OpenAI-generated lesson visuals must follow `docs/dev/IMAGE_GENERATION_STANDARDS.md`. The accepted benchmark style is the CPU performance starter advert pair: `upgrade-advert-ghz-openai.png` and `upgrade-advert-cores-openai.png`.
- Advert/poster graphics must be visually checked at card size: no overlapping text/graphics, no cramped copy, no artefacts, and captions should carry explanation where possible.

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

Date: 2026-06-25

Worker: PC Codex.

User intent:

- The user is testing the formal staged lesson creation workflow and wants quality gates to prevent rushed, generic lesson output.
- Part 1 is being refined before moving on to cache size/cache levels.
- Rich lesson visuals should use accepted OpenAI-generated bitmap images rather than hand-authored SVG when the aim is engagement rather than deterministic geometry.
- Multiple-choice and exam-question cards must sit on dedicated assessment slides.
- Typography is now strict: only titles/subtitles should use heavy weight. Question prompts, options, helper text and feedback must be normal weight.

Workflow state:

1. Stage 0 complete: OCR J277 spec checked and old `app/` lesson, task, quiz and exam routes audited.
2. Stage 1 complete: lesson arc approved with an interesting intro, learning objectives, clock speed, cache, cores, application, summary and exam practice.
3. Stage 2 was improved after the user rejected the first version for lack of detail. Future Stage 2 outputs must be detailed enough to drive excellent implementation.
4. Stage 3 is in progress part by part. Current implementation covers the opening, starter, objectives, CPU factors/segue and Part 1 clock-speed slides.
5. Do not build the rest of the lesson in one pass. Continue only after the user accepts the current part.

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
8. `Multiple choice`

Current lesson structure:

1. Opening title slide uses `TitleSegmentSlide` with no extra badge/header.
2. Starter slide uses `Lesson starter`, `TwoTopCardsWideBottomCard`, two `ImageCard`s and a prediction `QuestionCard`.
3. Learning objectives use `LearningObjectivesCard`, `LearningObjectiveItem` and `CommandWord`.
4. Overview/segue slide uses `ImageCard`s for clock speed, cache size and number of cores and remains labelled `Lesson introduction`.
5. Part divider uses `TitleSegmentSlide` with `Part 1 - Clock speed`.
6. Part 1 teaching slide A explains clock speed and cycles per second.
7. Part 1 teaching slide B explains that a higher clock speed can allow more sequential instructions to be processed per second.
8. Slide 8 is a dedicated assessment slide titled `Multiple choice`; it uses `OneFullSpanCard`, `SingleMultipleChoiceCard` and four reusable `MultipleChoiceOption variant="lesson"` buttons.

Important implementation notes:

1. `LessonSlideShell` badge/header labels are validated through `astro-site/src/lib/lessonSlideShellLabels.ts`.
2. `LessonPage` checks for duplicate part numbers with conflicting titles when data-driven lessons provide shell labels.
3. `LessonSideNav` heading says `Lesson slide navigation`.
4. Current CPU performance rich visuals use accepted OpenAI PNG assets from `astro-site/public/images/lessons/cpu-performance/`.
5. The original SVG versions still exist as fallback/reference assets but should not be preferred for rich learner-facing visuals.
6. `WideTopCardTwoBottomCards` exists and is used for slide 7.
7. `SingleMultipleChoiceCard` exists at `astro-site/src/components/lesson/cards/SingleMultipleChoiceCard.astro`.
8. The standalone Dev dashboard route `http://127.0.0.1:4321/dev-dashboard/components/multiple-choice-option/` has been updated to show the current four-option style with normal-weight text.
9. The accepted OpenAI image style benchmark remains `upgrade-advert-ghz-openai.png` and `upgrade-advert-cores-openai.png`; follow `docs/dev/IMAGE_GENERATION_STANDARDS.md`.
10. Do not reintroduce heavy answer-option or question-prompt text.

Accepted OpenAI lesson image files currently referenced or available:

```text
astro-site/public/images/lessons/cpu-performance/upgrade-advert-ghz-openai.png
astro-site/public/images/lessons/cpu-performance/upgrade-advert-cores-openai.png
astro-site/public/images/lessons/cpu-performance/factor-clock-speed-openai.png
astro-site/public/images/lessons/cpu-performance/factor-cache-openai.png
astro-site/public/images/lessons/cpu-performance/factor-cores-openai.png
astro-site/public/images/lessons/cpu-performance/clock-speed-pulses-openai.png
astro-site/public/images/lessons/cpu-performance/clock-speed-instructions-openai.png
```

QA already run for the current checkpoint:

```powershell
npm.cmd run build
```

Build passed from `astro-site/`.

Browser/visual QA already performed:

1. Dev server route probes returned HTTP 200 for the checked surfaces.
2. `SingleMultipleChoiceCard` was checked on the Dev dashboard and CPU performance slide 8.
3. `MultipleChoiceOption` standalone component route was screenshot-reviewed on desktop, hover and mobile.
4. Slide 8 screenshot confirmed it renders `SingleMultipleChoiceCard` with four reusable `MultipleChoiceOption` buttons.
5. Computed font weights for the multiple-choice prompt, options and reset button were checked as `400`.
6. Correct and incorrect answer states were checked: green tick/correct state and red cross/incorrect state.
7. No relevant console errors or framework overlays were found during the Playwright/Edge checks.

Known follow-up:

1. Review Part 1 with the user before moving to Part 2.
2. Do not proceed to Part 2 until the user accepts Part 1.
3. After Part 1 is accepted, build Part 2: cache size, cache levels L1/L2/L3 and a cache scenario check.
4. Keep following `docs/dev/LESSON_CREATION_WORKFLOW.md`.
5. Re-check any touched UI with screenshot review before marking it complete.
6. Known UI issue observed during automated hash navigation: the lesson side-nav active highlight can lag and still show slide 7 active while slide 8 is visible. Do not hide this if it appears again; either fix it as a focused task or report it as a remaining issue.

## Known Limitations

- Edge physical interaction QA must be proven per task; do not infer it from code or screenshots.
- Future GitHub uploads should happen from a proper clone of `lbyearwood/csrevision` on the `astro-site` branch.
