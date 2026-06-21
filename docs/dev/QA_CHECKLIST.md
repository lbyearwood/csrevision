# QA Checklist

Use this checklist before claiming a task is complete.

## Edge Pre-Amendment Gate

Required before changes that can affect rendered site output, user-facing behaviour, layout, styling, routing, navigation, browser interactions, build output or public content.

1. Start or confirm the local development server.
2. Open the affected page or route in Microsoft Edge.
3. Confirm the page renders.
4. Confirm Edge can physically interact with the page where relevant.
5. Only then amend user-facing site code.

Not applicable for developer-only documentation, handover notes, troubleshooting logs, internal checklists or code comments that do not alter rendered output.

## Build Check

For Astro implementation work:

```powershell
cd C:\Users\Max\Documents\Development\csrevision\astro-site
npm.cmd run build
```

## Route Checks

Check relevant routes plus any common parent pages:

```text
/
/gcse/
/dev-dashboard/
```

## Visual QA

For user-facing changes, check:

- Page renders without a framework error overlay.
- A screenshot of the affected UI has been captured and manually reviewed before the task is marked complete.
- If screenshot capture fails, try another route before continuing: in-app Browser screenshot, Edge remote-debugging screenshot, Edge headless screenshot, Playwright screenshot, or a normal visible Edge/manual screenshot.
- DOM checks, computed styles and route status checks can support visual QA, but they do not replace screenshot review for QAP or UI design work.
- No developer-only text is visible on public pages.
- QAP and reusable lesson-card examples do not duplicate titles, subtitles or repeated explanatory information.
- Directional relationships use vector/CSS/SVG arrow shapes, not typed arrow text.
- Text does not overlap or clip.
- Cards, diagrams, tables and controls are readable.
- Contrast and spacing are usable.
- Desktop, tablet and mobile widths are checked where relevant.

## Physical Interaction QA

Where relevant, prove:

- Links navigate.
- Buttons activate.
- Modals open and close.
- Lesson navigation scrolls or jumps correctly.
- Quizzes, reveals, steppers and diagrams work.
- Focus states and keyboard access are usable where practical.

## Final Status Format

End every task with:

1. Edge pre-amendment access check: passed/failed/not applicable.
2. Code/build check: passed/failed/not applicable.
3. Edge post-amendment visual QA: passed/failed/not applicable, including screenshot capture path and review result.
4. Edge physical interaction QA: passed/failed/not applicable.
5. Desktop/tablet/mobile check: passed/failed/not applicable.
6. Known limitations.
