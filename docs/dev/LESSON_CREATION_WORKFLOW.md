# Lesson Creation Workflow

Use this workflow whenever Codex creates or migrates a lesson in `astro-site/`.

## Core Rule

Do not build a whole lesson in one pass.

Lessons must be developed in staged approval gates so Codex can focus on one level of quality at a time and the user can redirect before too much work is built in the wrong direction.

## Required Workflow

### Stage 0: Understand The Lesson

Before proposing lesson content:

1. Identify the topic, course and exam board.
2. Check for an official specification in `docs/reference/specifications/`, online, or from the user.
3. Use the specification to understand required content, vocabulary and exam expectations.
4. Do not copy the specification order automatically.
5. If migrating, inspect the relevant old `app/` lesson, assets, scripts, styles, tasks, quiz and exam material.
6. Identify any diagrams, models, images, tasks, comprehension checks, quiz items or exam questions that must be retained, rebuilt or intentionally omitted.

Stage 0 output must include a source audit before any lesson plan is proposed:

1. Topic, course, exam board and specification source.
2. Specification scope in plain language.
3. Old-site lesson route status.
4. Old-site lesson script status.
5. Old-site task route status.
6. Old-site quiz material worth retaining or rebuilding.
7. Old-site exam questions or mark schemes worth retaining or rebuilding.
8. Old-site images, diagrams, models, scripts or styles worth retaining or rebuilding.
9. Gaps, risks or intentional omissions.

Do not assume an empty or placeholder old lesson means there is no reusable material. The quiz, exam, task and asset routes may contain the real content spine.

Approval gate:

- Confirm the topic scope and source material before planning the lesson.

### Stage 1: Plan The Whole Lesson

Codex should propose the whole lesson arc before building slides.

The plan must include:

1. Interesting intro or hook.
2. Learning objectives.
3. Main teaching parts in a logical order for understanding and progression.
4. Any likely visual support, models, interactions or assessment moments.
5. Any old-site material that will be retained, changed or omitted.

Approval gate:

- Ask the user to approve, amend or reorder the lesson plan.
- Do not build detailed slide content before this is agreed.

### Stage 2: Create The Detailed Slide Blueprint

After the plan is agreed, create the full lesson blueprint.

This stage must be detailed enough for the user to judge the teaching structure before Codex writes polished slide content or builds complex visuals.

The blueprint must include:

1. Slide numbers.
2. Slide titles.
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
14. Notes for any unresolved design or content decision.

The blueprint should not contain polished final teaching text yet, but it must contain enough detail to prevent generic slides.

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
10. Notes or risks.

Approval gate:

- Ask the user to approve the slide order, layout choices, placeholder briefs and teaching coverage.
- Do not fill the whole lesson with final content before this is agreed.

### Stage 3: Build One Lesson Part At A Time

After the skeleton is agreed, build one main lesson part at a time.

For each lesson part, complete the relevant items together:

1. Teaching text.
2. Diagram or visual explanation.
3. Generated or drawn image, where applicable.
4. Model or interaction, where applicable.
5. Comprehension check.
6. Exam-style question or applied question, where useful.
7. Task sheet instruction, where relevant.

Do not write all lesson text first, then all diagrams, then all questions across the whole lesson. Visuals, models and checks often change what the text should say. Each part should become coherent before moving on.

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

1. Interesting intro or hook.
2. Learning objectives.
3. Main teaching parts.
4. Comprehension and application moments throughout the lesson.
5. Summary or consolidation.
6. Exam-style or task-sheet follow-up where appropriate.

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
4. Do not create one-off layout or card code unless existing modules cannot support the teaching purpose.
5. If a new reusable card/component/widget is needed, add it to the Dev dashboard and `docs/dev/COMPONENT_REGISTRY.md`.

## Why This Workflow Exists

Codex produces better lessons when it has a narrow quality target. Building everything at once tends to create generic explanations, weak diagrams and disconnected questions. This staged process keeps the whole lesson visible while giving each part enough focused attention to become strong.
