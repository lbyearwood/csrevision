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
| 1 | LessonSlideShell | accepted | Shared outer wrapper for slide number, label, heading, scroll target spacing and canvas rhythm. Visible badge/header labels are restricted to `Lesson introduction`, `Lesson summary`, or `Part [number] - [title]`; each part number can only have one title per lesson. Not a 2 by 2 card layout. |

## Layouts

Layouts are structural 2 by 2 card arrangements only, except for the title segment slide. Teaching purposes such as comparison, recap, process, model or exam practice belong in cards, components or widgets placed inside these layouts.

| No. | Layout | Status | Notes |
| --- | --- | --- | --- |
| 1 | OneFullSpanCard | accepted | One card spans the full 2 by 2 card area. |
| 2 | TwoVerticalCards | accepted | Two cards side by side, each spanning a full column. |
| 3 | TwoHorizontalCards | accepted | Two cards stacked, each spanning a full row. |
| 4 | WideTopCardTwoBottomCards | accepted | One wide setup card over two smaller cards. |
| 5 | TwoTopCardsWideBottomCard | accepted | Two smaller cards over one wide synthesis card. |
| 6 | TallLeftCardTwoRightCards | accepted | One tall left card with two stacked cards on the right. |
| 7 | TwoLeftCardsTallRightCard | accepted | Two stacked cards on the left with one tall right card. |
| 8 | FourEqualCards | accepted | Specialist 2 by 2 quadrant/matrix/four-way comparison layout. Not a general-purpose default and not for ordinary groups of four cards. |
| 9 | TitleSegmentSlide | accepted | Title-only slide outside the 2 by 2 card system. Use for the opening lesson title slide or between lesson parts. Part dividers must contain the full `Part [number] - [title]` label. |

## Cards

| No. | Card | Status | Notes |
| --- | --- | --- | --- |
| 1 | ExplanationCard | accepted | Complete concrete explanation example. |
| 2 | DiagramCard | accepted | Complete vector Venn diagram example. |
| 3 | InteractiveDiagramCard | accepted | Complete selectable class dependency diagram; detail/support panel follows the selected object colour. |
| 4 | ImageCard | accepted | Complete CPU chip PNG example with descriptive caption. |
| 5 | SupportCard | accepted | Complete white card, blue border, thick left border. |
| 6 | TableCard | accepted | Complete real table, centered title and brief purpose explanation. |
| 7 | InteractiveTableCard | accepted | Complete row-selection behaviour, centered intro text and blue hover/support state. Uses FeedbackState for the live row explanation. |
| 8 | ModellingCard | accepted | Complete fetch-decode-execute model, previous/next/reset controls and live step status. |
| 9 | SingleMultipleChoiceCard | accepted | Complete clickable A-D question with normal-weight question/answer text, green tick/red cross states, feedback strip and reset control. Uses `MultipleChoiceOption` for every visible answer button. |
| 10 | SeveralMultipleChoiceCard | needs work | Not currently preferred by the user. Do not use for lesson-part multiple-choice checks unless this card is redesigned and explicitly re-approved. |
| 11 | AnswerCard | accepted | Complete lightbox/modal reveal context example. |
| 12 | PromptCard | accepted | Complete concrete prompt example. |
| 13 | ExamQuestionCard | accepted | Complete concrete example; marks are appended to the question text in bold. Uses LabelBadge for the command word. |
| 14 | SummaryCard | accepted | Complete lesson summary example with introductory sentence and numbered points. |
| 15 | LearningObjectivesCard | accepted | Complete lesson objectives example matching the summary card structure with future-tense wording. Uses LearningObjectiveItem and CommandWord. |
| 16 | InstructionCard | accepted | Complete concrete numbered instruction example. |
| 17 | FlashCard | accepted | Complete 2 by 2 keyword-front, definition-back flip interaction. Uses FlipCard. |
| 18 | VisualFlashCard | accepted | Complete logic-gate visual front, definition-back flip interaction. Uses FlipCard. |
| 19 | LogicGateCard | accepted | Complete Boolean expression diagram card. |
| 20 | CodingCard | accepted | Complete numbered, colour-coded code snippet card. Uses CodeBlock. |
| 21 | MarkSchemeCard | accepted | Complete lightbox/modal reveal context example with reusable MarkSchemeBullet items. |
| 22 | MisconceptionCard | accepted | Complete red misconception and green correction example. Uses FeedbackState for each state. |
| 23 | HingeQuestionCard | accepted | Complete diagnostic A-D question with answer-state feedback and reset. |
| 24 | ProcessSequenceCard | accepted | Complete numbered process sequence with solid connectors. |
| 25 | VocabularyCard | accepted | Complete key-term and definition list using reusable LabelBadge. |

## Components

| No. | Component | Status | Notes |
| --- | --- | --- | --- |
| 1 | RevealButton | accepted | Reusable component file with blue reveal trigger design. |
| 2 | PreviousButton | accepted | Reusable component file with rounded blue previous-step control. |
| 3 | NextButton | accepted | Reusable component file with rounded blue next-step control in a different shade. |
| 4 | ResetButton | accepted | Reusable component file used by relevant card examples. |
| 5 | MultipleChoiceOption | accepted | Reusable component file used by multiple-choice card examples. Use explicit `marker` props for A-D labels; do not recreate option letters with list pseudo-elements or one-off button markup. Standalone Dev dashboard example uses four A-D options with normal-weight answer text and the current hover/focus styling. |
| 6 | ResultMarkerCorrect | accepted | Reusable marker component supports correct state. |
| 7 | ResultMarkerIncorrect | accepted | Reusable marker component supports incorrect state. |
| 8 | FeedbackState | accepted | Reusable feedback component with neutral, correct and incorrect variants. |
| 9 | HintToggle | accepted | Reusable native details hint component. |
| 10 | DisclosurePanel | accepted | Reusable native details disclosure component. |
| 11 | StepConnector | accepted | Reusable numbered process connector component. |
| 12 | FlowConnector | accepted | Reusable elbow arrow connector component. |
| 13 | LabelBadge | accepted | Reusable badge component with default, success and warning variants. |
| 14 | Tooltip | accepted | Reusable accessible icon help label component. |
| 15 | DiagramLabel | accepted | Reusable leader-line label component. |
| 16 | ImageHotspot | accepted | Reusable numbered hotspot component. |
| 17 | DragHandle | accepted | Reusable compact reorder handle component. |
| 18 | MarkSchemeBullet | accepted | Reusable mark-value badge and point text component. |
| 19 | FlipCard | accepted | Reusable front/back flip component used by FlashCard and VisualFlashCard examples. |
| 20 | CodeBlock | accepted | Reusable numbered code block component used by CodingCard examples. |
| 21 | CommandWord | accepted | Reusable inline command-word emphasis used in objectives, exam questions and task instructions. |
| 22 | LearningObjectiveItem | accepted | Reusable numbered objective row with blue number marker and objective text. Uses CommandWord where appropriate. |

## Widgets

| No. | Widget | Status | Notes |
| --- | --- | --- | --- |
| 1 | TimerDisplay | accepted | Live countdown with editable time, start, pause/resume, reset and size controls. |
| 2 | Stopwatch | accepted | Live stopwatch with start, pause/resume, reset and size controls. |
| 3 | DrawBoard | accepted | Live canvas with pen, text, line, eraser, image paste, transparent mode, background toggle, swatches, custom colour and clear-board controls. |
| 4 | ProgressIndicator | accepted | Live progress bar with range, next/back and reset controls. |
| 5 | ScoreCounter | accepted | Floating two-screen team scoreboard with setup screen, 1-5 teams, per-team increment/decrement controls, reset and size controls. |
| 6 | AudioPlayButton | accepted | Live play/pause control using a browser-generated sample tone. |

## Open Registry Work

- Define which cards/components can appear in each structural 2 by 2 layout.
- Keep the Dev dashboard Cards list aligned with this registry.
- Avoid creating duplicate components when an existing card can be extended.
- Review the reusable CPU performance support components introduced during the page-specific-class cleanup:
  `DisplayValue`, `ClockCycleComparison` and `InstructionThroughputModel`. They replace old page-local
  `cpu-*` classes, but still need Dev dashboard examples before they should be treated as accepted general modules.
