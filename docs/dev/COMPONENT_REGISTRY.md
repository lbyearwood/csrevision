# Component Registry

This registry tracks reusable shells, layouts, cards and smaller components. Keep statuses current as modules are reviewed, amended and accepted.

Status values:

- `draft`: route or component exists but is not accepted.
- `review`: ready for user review.
- `accepted`: approved for normal lesson use.
- `needs work`: known gaps remain.
- `missing`: not built yet.

Review page order:

- Reusable module review routes should show `Example` as slide 1 and `Brief` as slide 2.

## Shells

| No. | Shell | Status | Notes |
| --- | --- | --- | --- |
| 1 | Standard numbered lesson slide shell | review | Shared outer wrapper for slide number, label, heading, scroll target spacing and canvas rhythm. Not a 2 by 2 card layout. |

## Layouts

Layouts are structural 2 by 2 card arrangements only, except for the title segment slide. Teaching purposes such as comparison, recap, process, model or exam practice belong in cards, components or widgets placed inside these layouts.

| No. | Layout | Status | Notes |
| --- | --- | --- | --- |
| 1 | One full-span card | draft | One card spans the full 2 by 2 card area. |
| 2 | Two vertical cards | draft | Two cards side by side, each spanning a full column. |
| 3 | Two horizontal cards | draft | Two cards stacked, each spanning a full row. |
| 4 | Wide top card + two bottom cards | draft | One wide setup card over two smaller cards. |
| 5 | Two top cards + wide bottom card | draft | Two smaller cards over one wide synthesis card. |
| 6 | Tall left card + two right cards | draft | One tall left card with two stacked cards on the right. |
| 7 | Two left cards + tall right card | draft | Two stacked cards on the left with one tall right card. |
| 8 | Four equal cards | draft | Standard 2 by 2 card grid. |
| 9 | Title segment slide | draft | Segment break slide outside the 2 by 2 card system. |

## Cards

| No. | Card | Status | Notes |
| --- | --- | --- | --- |
| 1 | Explanation card | review | Exists with concrete Dev dashboard example. |
| 2 | Diagram card | review | Complete vector Venn diagram example. |
| 3 | Interactive diagram card | review | Complete selectable class dependency diagram; detail/support panel follows the selected object colour. |
| 4 | Image card | review | Complete CPU chip PNG example with descriptive caption. |
| 5 | Support card | review | Complete white card, blue border, thick left border. |
| 6 | Table card | review | Complete real table, centered title and brief purpose explanation. |
| 7 | Interactive table card | accepted | Complete row-selection behaviour, centered intro text and blue hover/support state. |
| 8 | Modelling card | accepted | Complete fetch-decode-execute model, previous/next/reset controls and live step status. |
| 9 | Single multiple choice card | accepted | Complete clickable A-D question with thick borders, green tick/red cross states and reset control. |
| 10 | Several multiple choice card | accepted | Complete reference-style Q1-Q3 structure with four-option rows and reset control. |
| 11 | Answer card | review | Intended for lightbox/modal reveal contexts. |
| 12 | Prompt card | accepted | Complete concrete prompt example. |
| 13 | Exam question card | accepted | Complete concrete example; marks are appended to the question text in bold. |
| 14 | Summary card | accepted | Complete lesson summary example with introductory sentence and numbered points. |
| 15 | Learning objectives card | accepted | Complete lesson objectives example matching the summary card structure with future-tense wording. |
| 16 | Instruction card | accepted | Complete concrete numbered instruction example. |
| 17 | Flash card | accepted | Complete 2 by 2 keyword-front, definition-back flip interaction. |
| 18 | Visual Flashcard | accepted | Complete logic-gate visual front, definition-back flip interaction. |
| 19 | Logic gate card | accepted | Complete Boolean expression diagram card. |
| 20 | Coding card | accepted | Complete numbered, colour-coded code snippet card. |
| 21 | Mark scheme card | review | Intended for lightbox/modal reveal contexts. |
| 22 | Misconception card | accepted | Complete red misconception and green correction example. |
| 23 | Hinge question card | missing | Still required. |
| 24 | Process/sequence card | missing | Still required. |
| 25 | Vocabulary card | missing | Still required. |

## Components

| No. | Component | Status | Notes |
| --- | --- | --- | --- |
| 1 | Reveal button | accepted | Reusable component file with blue reveal trigger design. |
| 2 | Previous button | accepted | Reusable component file with rounded blue previous-step control. |
| 3 | Next button | accepted | Reusable component file with rounded blue next-step control in a different shade. |
| 4 | Reset button | accepted | Reusable component file used by relevant card examples. |
| 5 | Multiple-choice option | accepted | Reusable component file used by multiple-choice card examples. |
| 6 | Correct marker | accepted | Reusable marker component supports correct state. |
| 7 | Incorrect marker | accepted | Reusable marker component supports incorrect state. |
| 8 | Feedback state | accepted | Reusable feedback component with neutral, correct and incorrect variants. |
| 9 | Hint toggle | accepted | Reusable native details hint component. |
| 10 | Expand/collapse panel | accepted | Reusable native details disclosure component. |
| 11 | Step connector | accepted | Reusable numbered process connector component. |
| 12 | Flow connector | accepted | Reusable elbow arrow connector component. |
| 13 | Label badge | accepted | Reusable badge component with default, success and warning variants. |
| 14 | Tooltip | accepted | Reusable accessible icon help label component. |
| 15 | Diagram label | accepted | Reusable leader-line label component. |
| 16 | Image hotspot | accepted | Reusable numbered hotspot component. |
| 17 | Drag handle | accepted | Reusable compact reorder handle component. |
| 18 | Mark scheme bullet | accepted | Reusable mark-value badge and point text component. |

## Widgets

| No. | Widget | Status | Notes |
| --- | --- | --- | --- |
| 1 | Timer display | functional review | Live countdown with editable time, start, pause/resume, reset and size controls. |
| 2 | Stopwatch | functional review | Live stopwatch with start, pause/resume, reset and size controls. |
| 3 | Draw board | functional review | Live canvas with pen, text, line, eraser, image paste, transparent mode, background toggle, swatches, custom colour and clear-board controls. |
| 4 | Progress indicator | functional review | Live progress bar with range, next/back and reset controls. |
| 5 | Score counter | functional review | Floating two-screen team scoreboard with setup screen, 1-5 teams, per-team increment/decrement controls, reset and size controls. |
| 6 | Audio play button | functional review | Live play/pause control using a browser-generated sample tone. |

## Open Registry Work

- Define which cards/components can appear in each structural 2 by 2 layout.
- Mark modules as `accepted` only after user review.
- Widgets should be functional review sandboxes, not static visual-only previews.
- Keep the Dev dashboard Cards list aligned with this registry.
- Avoid creating duplicate components when an existing card can be extended.
