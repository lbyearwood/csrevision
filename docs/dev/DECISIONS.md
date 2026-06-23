# Decisions

Use this file for durable architecture, tooling and design decisions. Add dates to entries, not filenames.

## 2026-06-20: Active Dev Docs Use Stable Filenames

Decision:

- Active Codex-maintained dev docs live in `docs/dev/`.
- Filenames should not be dated.
- Date individual decisions, incidents and handover notes inside the relevant file.

Reason:

- Future Codex sessions need stable paths.
- Dated filenames create stale parallel sources of truth.

## 2026-06-21: Astro Rebuild Uses `astro-site` Branch

Decision:

- The Astro rebuild branch in `lbyearwood/csrevision` is `astro-site`.
- Do not use `astro-preview` as the branch name.
- Do not push the Astro rebuild to `main` until the user explicitly approves replacing the live site.
- Do not alter the production repository's GitHub Pages deployment settings for preview work.
- Use a separate preview repository if a hosted GitHub Pages preview is needed.

Reason:

- `main` already backs the live GitHub Pages site.
- A separate branch keeps the rebuild available for review without changing the public site.
- A separate preview repository avoids hijacking the production repo's one GitHub Pages deployment.

## 2026-06-20: Troubleshooting Must Be Maintained

Decision:

- Development, build, server, browser-control, QA and tooling errors must be recorded in `docs/dev/TROUBLESHOOTING.md`.
- Entries must include symptoms, cause, workflow, solution and limitations.

Reason:

- Solved environment problems should not be rediscovered by every future Codex session.

## 2026-06-20: Move Project Out Of OneDrive

Decision:

- The project should run from a normal local folder such as `<repo>`, not OneDrive.

Reason:

- OneDrive caused Vite/esbuild dependency optimisation failures when Astro dev server started.

## 2026-06-20: QAP And Slide Content Must Avoid Duplication

Decision:

- QAP and reusable lesson-card examples must not duplicate slide information, including repeated titles, subtitles or explanatory headings that say the same thing twice.
- Directional relationships must use rendered vector/CSS shapes or SVG icons, not typed arrow text such as ASCII arrows.
- QAP and UI design tasks cannot be marked complete until a screenshot of the affected UI has been captured and reviewed.
- If one screenshot method fails, try another capture method before deciding the task is complete.

Reason:

- Repeated labels make lesson slides feel noisy and less polished.
- Arrow characters are inconsistent across fonts and do not meet the visual standard for diagrams or QAP flows.
- DOM checks can prove structure and state, but they cannot reliably catch visual quality problems.

## 2026-06-19: Edge Is Required For Site QA

Decision:

- Microsoft Edge is the required browser for site testing.
- Chrome is not the default QA browser.
- Physical interaction QA must not be claimed unless clicks, navigation and relevant controls are proven.

Reason:

- The project has a hard QA rule for Edge-based user-facing checks.

## Current: `app` Is Reference, `astro-site` Is Rebuild

Decision:

- `app/` remains the old working site and reference source.
- New rebuild work belongs in `astro-site/`.

Reason:

- The rebuild must be gradual, component-led and safe.

## 2026-06-23: Specifications Inform Content, Not Lesson Order

Decision:

- Where available, Codex should use official course specifications to understand content requirements, vocabulary and exam expectations.
- If the specification is not available locally, Codex should search online or ask the user to provide it.
- Specification bullet-point order must not automatically determine lesson order.
- Lesson parts should be sequenced for student understanding and progression.
- The user wants to practise the topic-to-lesson-parts workflow before documenting a final workflow.

Reason:

- Specifications are often not written in the most logical teaching order.
- Lessons should be co-designed and checked with the user before detailed lesson content is built.
