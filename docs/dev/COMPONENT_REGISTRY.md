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
| 16 | Flash card | review | Replaces matching area card with a 2 by 2 keyword-front, definition-back flip interaction. |
| 17 | Mark scheme card | review | Intended for lightbox/modal reveal contexts. |
| 18 | Misconception card | accepted | Complete red misconception and green correction example. |
| 19 | Hinge question card | missing | Still required. |
| 20 | Process/sequence card | missing | Still required. |
| 21 | Vocabulary card | missing | Still required. |

## Components

| No. | Component | Status | Notes |
| --- | --- | --- | --- |
| 1 | Reveal button | missing | Listed on Dev dashboard for future component work. |
| 2 | Reset button | review | First implemented inside C9 and C10 multiple-choice cards. |
| 3 | Multiple-choice option | review | First implemented inside C9 single multiple choice card. |
| 4 | Correct marker | review | First implemented inside C9 single multiple choice card. |
| 5 | Incorrect marker | review | First implemented inside C9 single multiple choice card. |
| 6 | Feedback state | missing | Listed on Dev dashboard for future component work. |
| 7 | Hint toggle | missing | Listed on Dev dashboard for future component work. |
| 8 | Expand/collapse panel | missing | Listed on Dev dashboard for future component work. |
| 9 | Step connector | missing | Listed on Dev dashboard for future component work. |
| 10 | Flow connector | missing | Listed on Dev dashboard for future component work. |
| 11 | Label badge | missing | Listed on Dev dashboard for future component work. |
| 12 | Tooltip | missing | Listed on Dev dashboard for future component work. |
| 13 | Diagram label | missing | Listed on Dev dashboard for future component work. |
| 14 | Image hotspot | missing | Listed on Dev dashboard for future component work. |
| 15 | Drag handle | missing | Listed on Dev dashboard for future component work. |
| 16 | Timer display | missing | Listed on Dev dashboard for future component work. |
| 17 | Progress indicator | missing | Listed on Dev dashboard for future component work. |
| 18 | Score counter | missing | Listed on Dev dashboard for future component work. |
| 19 | Audio play button | missing | Listed on Dev dashboard for future component work. |
| 20 | Mark scheme bullet | missing | Listed on Dev dashboard for future component work. |

## Open Registry Work

- Define which cards/components can appear in which slide layouts.
- Mark modules as `accepted` only after user review.
- Keep the Dev dashboard Cards list aligned with this registry.
- Avoid creating duplicate components when an existing card can be extended.
