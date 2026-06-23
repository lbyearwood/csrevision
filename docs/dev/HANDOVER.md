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
- Structured content/data should drive future lesson creation.

## Current Priorities

1. Let the user review reusable card routes from the Dev dashboard.
2. Amend and accept cards one by one.
3. Review and accept needed layouts.
4. Practise the topic-to-lesson-parts workflow with the user before documenting it as a final workflow.
5. Define final lesson data shape.
6. Create and use the migration audit template.
7. Fully audit old `1.1.1 Architecture of the CPU`.
8. Complete the full `1.1.1` lesson/resource migration.

## Lesson Planning Conversation In Progress

The user wants Codex to practise a planning workflow before writing a final workflow document.

Current understanding:

1. The user provides a topic/spec.
2. Codex should use any available course specification to understand content requirements.
3. Codex should not use specification bullet-point order as the default lesson order.
4. Codex should propose a logical sequence of lesson parts that supports student understanding and progression.
5. The user should approve, amend or reorder the lesson parts before Codex builds detailed lesson content.
6. Once agreed, each part should include:
   - Part Number and Title
   - Concept Introduction
   - Visual Support
   - Importance and Relevance
   - Teacher Modelling where appropriate
   - Comprehension Check
   - Examination-Style Question
   - Task Sheet Instruction
   - Repeat for each part

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

The next Codex should continue practising this with the user rather than immediately creating a final workflow document.

## Known Limitations

- Draft layout routes are not approved teaching patterns until reviewed and accepted.
- Several reusable components remain missing, including hinge question, process/sequence and vocabulary cards.
- Edge physical interaction QA must be proven per task; do not infer it from code or screenshots.
- Future GitHub uploads should happen from a proper clone of `lbyearwood/csrevision` on the `astro-site` branch.
