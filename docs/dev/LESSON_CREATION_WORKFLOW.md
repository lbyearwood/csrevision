# Lesson Creation Workflow

Use this workflow whenever Codex creates or migrates a lesson in `astro-site/`.

## Core Rule

Do not build a whole lesson in one pass.

Lessons must be developed in staged approval gates so Codex can focus on one level of quality at a time and the user can redirect before too much work is built in the wrong direction.

Before building, read and follow the hardline lesson development protocols in `SITE_QA_AND_DEVELOPMENT_RULES.md`. They are mandatory project rules, not optional style guidance.

When a lesson needs generated bitmap visuals, also read and follow `docs/dev/IMAGE_GENERATION_STANDARDS.md`. The CPU performance upgrade advert PNGs named in that document are the current accepted visual benchmark for OpenAI-generated advert-style images.

## Required Workflow

### Stage 0: Understand The Lesson

Before proposing lesson content:

1. Identify the topic, course and exam board.
2. Define the target audience before making design choices.
3. Check for an official specification in `docs/reference/specifications/`, online, or from the user.
4. Use the specification to understand required content, vocabulary and exam expectations.
5. Do not copy the specification order automatically.
6. If migrating, inspect the relevant old `app/` lesson, assets, scripts, styles, tasks, quiz and exam material.
7. Identify any diagrams, models, images, tasks, comprehension checks, quiz items or exam questions that must be retained, rebuilt or intentionally omitted.

Stage 0 output must include a source audit before any lesson plan is proposed:

1. Topic, course, exam board and specification source.
2. Target audience profile and engagement needs.
3. Specification scope in plain language.
4. Old-site lesson route status.
5. Old-site lesson script status.
6. Old-site task route status.
7. Old-site quiz material worth retaining or rebuilding.
8. Old-site exam questions or mark schemes worth retaining or rebuilding.
9. Old-site images, diagrams, models, scripts or styles worth retaining or rebuilding.
10. Gaps, risks or intentional omissions.

Default GCSE Computer Science target audience:

- Learners aged 11 to 18, with the core GCSE audience usually aged 14 to 16.
- Mixed prior knowledge, mixed confidence and varied reading stamina.
- Likely to engage with concrete examples, relatable scenarios, icons, symbols, diagrams, images, visual metaphors, prediction questions and interactive models.
- Less likely to engage with adult-facing dashboard layouts, dense text panels or purely abstract explanations.

Do not assume an empty or placeholder old lesson means there is no reusable material. The quiz, exam, task and asset routes may contain the real content spine.

Approval gate:

- Confirm the topic scope and source material before planning the lesson.

### Stage 1: Plan The Whole Lesson

Codex should propose the whole lesson arc before building slides.

The plan must include:

1. Lesson starter.
2. Learning objectives.
3. Main teaching parts in a logical order for understanding and progression.
4. How the plan responds to the target audience profile.
5. Any likely visual support, models, interactions or assessment moments.
6. Any old-site material that will be retained, changed or omitted.

Approval gate:

- Ask the user to approve, amend or reorder the lesson plan.
- Do not build detailed slide content before this is agreed.

### Stage 2: Create The Detailed Slide Blueprint

After the plan is agreed, create the full lesson blueprint.

This stage must be detailed enough for the user to judge the teaching structure before Codex writes polished slide content or builds complex visuals.

The blueprint must include:

1. Slide numbers.
2. Slide titles written as questions for teaching slides.
3. Chosen layout codeNames.
4. Chosen card/component/widget codeNames where known.
5. The lesson part each slide belongs to.
6. The precise teaching purpose of each slide.
7. The key idea the slide must communicate.
8. Any vocabulary that must appear.
9. Any misconception or exam trap the slide should address.
10. Placeholders for text, diagrams, images, models and questions.
11. A short brief for each placeholder, not just a label.
12. The interaction expected on the slide, if any.
13. The check for understanding or exam skill being tested, if any.
14. Why the design choice fits the target audience.
15. Notes for any unresolved design or content decision.

The blueprint should not contain polished final teaching text yet, but it must contain enough detail to prevent generic slides.

Formal assessment content must be planned as its own slide. Do not place `ExamQuestionCard`, `SingleMultipleChoiceCard`, `SeveralMultipleChoiceCard` or `HingeQuestionCard` underneath teaching content on the same slide. Prefer one dedicated slide for several related exam questions where they assess the same idea or exam skill. Multiple-choice assessment slides may be single-question or several-question slides, but they should remain question-only. Use `Multiple choice` as the visible title for multiple-choice slides, and `Exam Questions` as the visible title for exam-question slides.

Use this per-slide format:

1. Slide number and title.
2. Lesson part.
3. Layout codeName.
4. Cards/components/widgets.
5. Teaching purpose.
6. Key idea.
7. Placeholder briefs.
8. Interaction or task.
9. Check for understanding.
10. Target audience fit.
11. Notes or risks.

Approval gate:

- Ask the user to approve the slide order, layout choices, placeholder briefs and teaching coverage.
- Do not fill the whole lesson with final content before this is agreed.

Teaching slide titles must normally be phrased as questions. Use question forms such as `What is clock speed?`, `How does clock speed affect performance?` and `What are three factors that impact CPU performance?` rather than statement-style headings. The exceptions are opening lesson title slides, `Lesson starter`, part-divider `TitleSegmentSlide`s, learning objectives and lesson summaries.

### Stage 3: Build One Lesson Part At A Time

After the skeleton is agreed, build one main lesson part at a time.

For each lesson part, complete the relevant items together:

1. Teaching text.
2. Diagram or visual explanation.
3. OpenAI-generated image, drawn diagram or other visual asset, where applicable.
4. Model or interaction, where applicable.
5. Comprehension check.
6. Exam-style question or applied question, where useful.
7. Task sheet instruction, where relevant.

Do not write all lesson text first, then all diagrams, then all questions across the whole lesson. Visuals, models and checks often change what the text should say. Each part should become coherent before moving on.

When adding formal assessment to a part, create a separate assessment slide for it instead of attaching the question card below a teaching layout. Keep teaching explanation slides for teaching, and keep exam or multiple-choice slides focused on the question, options, feedback and reset/reveal controls. Title these slides `Multiple choice` or `Exam Questions` rather than inventing topic-specific check titles.

For rich learner-facing visuals, use OpenAI image generation as the preferred default and follow `docs/dev/IMAGE_GENERATION_STANDARDS.md`. Use SVG/code-native diagrams only where exact labels, geometry, connectors or deterministic educational notation matter more than visual richness.

Generated images must be copied into the project before use. Do not reference images directly from a local Codex cache path.

Approval gate:

- Ask the user to approve each completed part before building the next part.
- If the user requests changes, finish those changes and re-check that part before continuing.

### Stage 4: Whole-Lesson Coherence Pass

After all parts are built, review the complete lesson.

Check for:

1. Repetition between slides.
2. Missing concept bridges.
3. Weak or duplicated explanations.
4. Overlong slides.
5. Diagrams or models that do not match the text.
6. Questions that do not test the intended understanding.
7. Public pages showing developer-only wording.
8. Slide titles, subtitles or card titles duplicating the same information.

Approval gate:

- Ask the user to approve the complete lesson before treating it as final.

### Stage 5: QA And Completion

Before marking a lesson complete:

1. Run `npm.cmd run build` from `astro-site/`.
2. Run relevant tests if behaviour, routing, shared components or interactions changed.
3. Complete Microsoft Edge visual QA.
4. Capture and review screenshots.
5. Check desktop, tablet and mobile where relevant.
6. Prove physical interactions in Edge where relevant.
7. Update `docs/dev/TROUBLESHOOTING.md` if a new development, build, server, browser-control, QA or tooling error was discovered.
8. Update `docs/dev/HANDOVER.md` if project state changed materially.

## Lesson Shape Standard

Every full lesson should follow this broad sequence:

1. Opening lesson title.
2. Lesson starter.
3. Learning objectives.
4. Segue/overview slide into the main parts, where useful.
5. Part title segment.
6. Main teaching parts.
7. Comprehension and application moments throughout the lesson.
8. Summary or consolidation.
9. Exam-style or task-sheet follow-up where appropriate.

## Lesson Part Standard

Each main teaching part should normally include:

1. Part number and title.
2. Concept introduction.
3. Visual support.
4. Importance and relevance.
5. Teacher modelling where appropriate.
6. Comprehension check.
7. Examination-style question where useful.
8. Task sheet instruction where relevant.

## Component Use Standard

Use accepted reusable modules from `docs/dev/COMPONENT_REGISTRY.md` wherever practical.

Rules:

1. Choose layouts for structure, not teaching purpose.
2. Choose cards for teaching purpose.
3. Choose components for repeated controls, labels, feedback states, code blocks, flashcards and other smaller parts.
4. Do not create custom lesson layouts, custom cards or one-off card markup unless the user has explicitly authorised that custom work first.
5. If an existing accepted module cannot support the teaching purpose, stop and ask the user for permission to create a new reusable layout, card, component or widget before building it.
6. If the user approves a new reusable module, add it to the Dev dashboard and `docs/dev/COMPONENT_REGISTRY.md`.
7. Stage 2 slide blueprints must name accepted layout/card/component/widget codeNames. If a required codeName does not exist yet, mark it as needing user approval rather than silently inventing it during Stage 3.
8. The Dev dashboard example is the visual contract for a module. Screenshot the agreed module and the final lesson slide implementation, then compare them before accepting the build.
9. Do not use page-specific CSS or markup to imitate a reusable module when the accepted module already exists.
10. Use `FourEqualCards` only for true quadrant, matrix or four-way comparison content where equal visual weight is the teaching purpose. Prefer the other accepted layouts for ordinary groups, overviews and segue slides.
11. When content implies a visual object, such as an advert, screenshot, poster, interface, diagram, device, icon, symbol or model, choose a visual card/component such as `ImageCard` before considering text-only cards. If a text-only card is still chosen, explain why and ask the user to approve that choice.
12. Advert/poster graphics must follow `docs/dev/IMAGE_GENERATION_STANDARDS.md`: use modern raster educational card style, big symbols, short readable copy, clear contrast and deliberate spacing. Inspect the rendered card and fix any overlapping, clipped, crowded, artefacted or tiny in-graphic text before presenting it.
13. Exam-question and multiple-choice cards must be placed on dedicated assessment slides, not mixed into teaching slides.
14. Dedicated assessment slide titles must be `Multiple choice` for multiple-choice cards or `Exam Questions` for exam-question cards.
15. Apply the hardline typography rule from `SITE_QA_AND_DEVELOPMENT_RULES.md`: unless text is a title or subtitle, it must be normal weight (`400`). Do not make question prompts, answer options, feedback, helper text, list text, captions, table text, button labels or normal card copy heavy.

## Lesson Slide Shell Badge Standard

The visible `LessonSlideShell` badge/header label must be one of these approved forms:

1. `Lesson introduction`
2. `Part [number] - [title]`, for example `Part 1 - Clock speed`
3. `Lesson summary`

Do not use hook names, objective names, bare part numbers such as `Part 1`, `Overview`, `Card`, `Component`, `Widget` or other free-form labels as the slide-shell badge. Put the specific teaching title in the part label, shell heading or approved card content instead.

Each part number must have exactly one title within a lesson. If Part 1 is `Part 1 - Clock speed`, every Part 1 slide must use that same badge. Do not create `Part 1 - Clock speed` and `Part 1 - CPU performance factors` in the same lesson.

`TitleSegmentSlide` has only two valid uses: the opening lesson title slide, or a divider between lesson parts. On the opening slide, its visible title must be the lesson title. Between parts, its visible title must be the full part label, such as `Part 2 - Cache size`. Do not use `TitleSegmentSlide` for the introduction hook, learning objectives, normal teaching content or summary.

Starter/introduction activity slides must use the fixed title `Lesson starter`. Do not invent custom starter titles such as `Upgrade challenge`, `Hook` or `Warm-up`.

Teaching slide titles must normally be phrased as questions. Use question forms such as `What is clock speed?`, `How does clock speed affect performance?` and `What are three factors that impact CPU performance?` rather than statement-style headings. The exceptions are opening lesson title slides, `Lesson starter`, part-divider `TitleSegmentSlide`s, learning objectives and lesson summaries.

When a lesson needs a segue/overview slide to bridge from the introduction into the parts, place it immediately before the first part-title `TitleSegmentSlide`. Treat this segue as `Lesson introduction`, not as Part 1.

Lesson navigation labels must be short and low-effort to name. If two or more slides cover the same topic, use the topic plus a letter suffix, such as `Clock speed (A)` and `Clock speed (B)`, rather than inventing longer bespoke navigation titles.

## Why This Workflow Exists

Codex produces better lessons when it has a narrow quality target. Building everything at once tends to create generic explanations, weak diagrams and disconnected questions. This staged process keeps the whole lesson visible while giving each part enough focused attention to become strong.
