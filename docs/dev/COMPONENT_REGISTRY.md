# Component Registry

This registry tracks reusable layouts, cards and smaller components. Keep statuses current as modules are reviewed, amended and accepted.

Status values:

- `draft`: route or component exists but is not accepted.
- `review`: ready for user review.
- `accepted`: approved for normal lesson use.
- `needs work`: known gaps remain.
- `missing`: not built yet.

## Layouts

| No. | Layout | Status | Notes |
| --- | --- | --- | --- |
| 1 | Standard numbered lesson slide shell | review | Extracted as shared shell. |
| 2 | Two-column teaching with support | review | Uses balanced main areas and full-width support area. |
| 3 | Two-column teaching without support | draft | Needs review before lesson use. |
| 4 | Single teaching-card | draft | Needs review before lesson use. |
| 5 | Full-width visual/title | draft | Needs review before lesson use. |
| 6 | Full-width visual with prompt | draft | Needs review before lesson use. |
| 7 | Comparison/table | draft | Needs review before lesson use. |
| 8 | Process/sequence | draft | Needs review before lesson use. |
| 9 | Vocabulary/key terms | draft | Needs review before lesson use. |
| 10 | Question/check | draft | Needs review before lesson use. |
| 11 | Activity | draft | Needs review before lesson use. |
| 12 | Summary/recap | draft | Needs review before lesson use. |
| 13 | Apply-it scenario | draft | Needs review before lesson use. |
| 14 | Minimal title/image | draft | Needs review before lesson use. |
| 15 | End-of-lesson next steps | draft | Needs review before lesson use. |
| 16 | Match activity | draft | Needs review before lesson use. |
| 17 | Hinge question | draft | Needs review before lesson use. |
| 18 | Misconception check | draft | Needs review before lesson use. |
| 19 | Exam-practice | draft | Needs review before lesson use. |
| 20 | Teacher-led discussion | draft | Needs review before lesson use. |
| 21 | Interactive model | draft | Needs review before lesson use. |

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
| 15 | Instruction card | accepted | Complete concrete numbered instruction example. |
| 16 | Flash card | accepted | Complete 2 by 2 keyword-front, definition-back flip interaction. |
| 17 | Visual Flashcard | accepted | Complete logic-gate visual front, definition-back flip interaction. |
| 18 | Logic gate card | accepted | Complete Boolean expression diagram card. |
| 19 | Coding card | accepted | Complete numbered, colour-coded code snippet card. |
| 20 | Mark scheme card | review | Intended for lightbox/modal reveal contexts. |
| 21 | Misconception card | accepted | Complete red misconception and green correction example. |
| 22 | Hinge question card | missing | Still required. |
| 23 | Process/sequence card | missing | Still required. |
| 24 | Vocabulary card | missing | Still required. |

## Components

| No. | Component | Status | Notes |
| --- | --- | --- | --- |
| 1 | Reveal button | review | New review route with blue reveal trigger design. |
| 2 | Reset button | review | New review route plus existing use inside C9 and C10 multiple-choice cards. |
| 3 | Multiple-choice option | review | New review route plus existing use inside C9 single multiple choice card. |
| 4 | Correct marker | review | New review route plus existing use inside C9 single multiple choice card. |
| 5 | Incorrect marker | review | New review route plus existing use inside C9 single multiple choice card. |
| 6 | Feedback state | review | New review route with neutral, correct and incorrect variants. |
| 7 | Hint toggle | review | New review route using native details disclosure. |
| 8 | Expand/collapse panel | review | New review route using native details disclosure. |
| 9 | Step connector | review | New review route with numbered process connector. |
| 10 | Flow connector | review | New review route with elbow arrow connector. |
| 11 | Label badge | review | New review route with default, success and warning variants. |
| 12 | Tooltip | review | New review route with accessible icon help label. |
| 13 | Diagram label | review | New review route with leader-line label pattern. |
| 14 | Image hotspot | review | New review route with numbered hotspot marker. |
| 15 | Drag handle | review | New review route with compact reorder handle. |
| 16 | Mark scheme bullet | review | New review route with mark-value badge and point text. |

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

- Define which cards/components can appear in which slide layouts.
- Mark modules as `accepted` only after user review.
- Widgets should be functional review sandboxes, not static visual-only previews.
- Keep the Dev dashboard Cards list aligned with this registry.
- Avoid creating duplicate components when an existing card can be extended.
