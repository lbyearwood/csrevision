# Development Checklist

This is the tracked worklist for getting the reusable Astro lesson system ready for full lesson migration.

Keep this document current as work is completed, revised or superseded. It is not a changelog. It is the live checklist for the remaining lesson shell, slide layout, component, activity, diagram and migration-foundation work.

Before starting any item, read `SITE_QA_AND_DEVELOPMENT_RULES.md` and complete the Edge pre-amendment access gate when the work can affect the rendered site or user-facing behaviour.

## Status Key

- `[ ]` Not started
- `[x]` Complete enough for the current reusable shell

## 1. Lesson Architecture Model

The reusable lesson system should use this naming standard:

- [x] `Lesson slide`: the whole numbered lesson section and scroll target
- [x] `Slide canvas`: the available teaching area inside the lesson slide
- [x] `Layout`: the whole slide pattern
- [x] `Card`: a reusable block inside a layout
- [x] `Component`: a smaller reusable part inside a card or layout
- [ ] Make the lesson data shape identify the slide layout separately from the card and component content
- [ ] Keep slide layouts flexible so not every lesson slide is forced into two columns
- [ ] Keep card components reusable without making topic-specific content generic
- [ ] Ensure each layout route uses only agreed card modules from the Dev dashboard Cards list
- [x] Create a Dev dashboard for reusable layouts, cards and components
- [ ] Add agreed slide layout examples through the Dev dashboard
- [x] Create the Dev dashboard route for the standard numbered lesson slide shell
- [x] Create the Dev dashboard route for the two-column teaching with support layout
- [x] Create draft Dev dashboard review routes for all listed Layout modules
- [x] Reduce draft Layout routes to the two-slide `Purpose` and `Example` review model
- [ ] Review, amend and accept each draft Layout route before using it as an approved lesson pattern

## 2. Reusable Lesson Layouts

Draft review routes exist for every Layout in this list. Checked items are already extracted as bespoke shared modules; unchecked items still need user review, amendment and acceptance before they become approved lesson patterns.

- [x] Standard numbered lesson slide shell
- [x] Two-column teaching layout with full-width support card
- [ ] Two-column teaching layout without support card
- [ ] Single teaching-card layout
- [ ] Full-width visual/title layout
- [ ] Full-width visual with prompt layout
- [ ] Comparison/table layout
- [ ] Process/sequence layout
- [ ] Vocabulary/key terms layout
- [ ] Question/check layout
- [ ] Activity layout
- [ ] Summary/recap layout
- [ ] Apply-it scenario layout
- [ ] Minimal title/image layout
- [ ] End-of-lesson next steps layout
- [ ] Match activity layout
- [ ] Hinge question layout
- [ ] Misconception check layout
- [ ] Exam-practice layout
- [ ] Teacher-led discussion layout
- [ ] Interactive model layout

## 3. Reusable Lesson Cards

- [x] Explanation card component
- [x] Add Dev dashboard review routes for all listed card modules
- [x] Diagram card component
- [x] Image card component
- [x] Support card component
- [x] Table card component
- [x] Interactive table card component
- [x] Modelling card component
- [x] Question card component
- [x] Answer card component
- [x] Prompt card component
- [x] Exam-practice card component
- [x] Summary card component
- [x] Feedback card component
- [x] Instruction card component
- [x] Matching area card component
- [x] Mark scheme card component
- [x] Misconception card component
- [ ] Hinge question component
- [ ] Process/sequence card component
- [ ] Vocabulary card component
- [ ] Define which components can appear in which slide layouts
- [ ] Add accepted card examples through the Dev dashboard

## 4. Activity Component System

- [ ] Shared activity data format
- [ ] Reveal answer component
- [ ] Multiple-choice question component for in-lesson checks
- [ ] Match terms to definitions component
- [ ] Sort/sequence steps component
- [ ] Drag or click-to-order activity
- [ ] Misconception card component
- [ ] Check-your-understanding component
- [ ] Model answer reveal component
- [ ] Mark scheme reveal component
- [ ] Self-assessment checklist component
- [ ] Correct feedback state
- [ ] Incorrect feedback state
- [ ] Try-again feedback state
- [ ] Activity reset button
- [ ] Activity accessibility rules

## 5. Content Audit Workflow

- [ ] Create a reusable migration audit template
- [ ] Read old lesson page before migration
- [ ] Read old slide deck before migration
- [ ] Read old JavaScript before migration
- [ ] Identify every old slide or section
- [ ] Mark each old item as `lesson`, `task`, `quiz`, `exam`, `omit` or `rebuild interactive`
- [ ] Identify required images and diagrams
- [ ] Identify required interactions
- [ ] Identify embedded exam questions
- [ ] Identify duplicated or low-value content
- [ ] Preserve teaching intent, not just text
- [ ] Record migration decisions in the audit
- [ ] Check whether content belongs in the lesson or a separate resource
- [ ] Confirm the final lesson structure before building
- [ ] Build from structured data and reusable components
- [ ] Edge QA the migrated lesson against the old reference

## 6. Visual Model And Diagram Standard

- [ ] Decide which diagrams are reusable patterns
- [ ] Create shared process diagram component
- [ ] Create shared comparison diagram component
- [ ] Create shared CPU/component diagram component
- [ ] Create shared memory/register model component
- [ ] Create shared step-flow visual component
- [ ] Decide when to use SVG, CSS, image or interactive JavaScript
- [ ] Avoid one-off diagrams unless the teaching requires it
- [ ] Make diagrams responsive
- [ ] Make diagram text readable on mobile
- [ ] Add accessible diagram labels and descriptions
- [ ] Avoid repeated generic diagrams
- [ ] Preserve important old visual explanations
- [ ] Rebuild animated diagrams cleanly where useful
- [ ] Edge QA diagrams on desktop, tablet and mobile

## 7. Teacher And Tool Decisions

- [x] Keep lesson slide navigation for slides only
- [x] Keep lesson tools in the header tool pad
- [x] Keep Print as the only current working tool
- [x] Do not show inactive tools
- [ ] Audit old teacher tools before rebuilding
- [ ] Decide whether countdown timer is needed
- [ ] Decide whether stopwatch is needed
- [ ] Decide whether draw board is needed
- [ ] Decide whether sound board is needed
- [ ] Decide whether glossary belongs in the tool pad
- [ ] Build each approved tool as a reusable Astro/JavaScript component
- [ ] Keep teacher tools separate from lesson content
- [ ] Make tools keyboard accessible
- [ ] Test tools in Edge before release
- [ ] Avoid copying old tool code directly unless it is reviewed and cleaned up

## 8. Extra Foundation Tasks

- [ ] Define final lesson data shape
- [ ] Define final slide layout data shape
- [ ] Define activity data shape
- [ ] Define diagram data shape
- [ ] Define assessment-in-lesson data shape
- [ ] Create migration checklist template
- [ ] Create QA checklist template
- [x] Create a dedicated Dev dashboard for reusable module testing
- [x] List reusable layouts, cards and components in the Dev dashboard
- [x] Remove reusable modules from the GCSE dashboard
- [ ] Add a full-lesson-migrated definition of done
- [ ] Apply the complete process first to `1.1.1 Architecture of the CPU`
- [ ] Migrate modelling-heavy lessons only after `1.1.1` proves the full process
- [x] Keep `app` as reference only throughout

## 9. Full Lesson Migration Definition Of Done

A lesson should not be called fully migrated until all relevant checks below are complete.

- [ ] Old lesson page reviewed
- [ ] Old slide deck reviewed
- [ ] Old JavaScript reviewed
- [ ] Old tasks, quiz and exam resources reviewed
- [ ] Every old slide has a migration decision
- [ ] Every retained teaching point has a place in the new lesson/resource set
- [ ] Required diagrams or visual models are rebuilt or intentionally replaced
- [ ] Required interactions are rebuilt as reusable components
- [ ] Lesson data uses the agreed structured format
- [ ] Lesson uses the shared single-page shell
- [ ] Lesson slides use agreed reusable slide layouts
- [ ] Lesson cards/components are chosen for teaching purpose, not forced into one layout
- [ ] Lesson navigation tracks the visible slide
- [ ] Section titles show slide numbers
- [ ] Dashboard resource buttons reflect actual availability
- [ ] Edge desktop QA passed
- [ ] Edge tablet QA passed
- [ ] Edge mobile QA passed
- [ ] Edge physical interaction QA passed
- [ ] `npm run build` passed
- [ ] `app` remains unchanged

## 10. First Full Migration Target

- [ ] Complete the shell/activity/diagram checklist items needed for `1.1.1 Architecture of the CPU`
- [ ] Audit the old full `1.1.1` deck slide by slide
- [ ] Decide which old slides remain lesson content
- [ ] Decide which old slides move to tasks, exam or quiz resources
- [ ] Rebuild required CPU/FDE/Von Neumann diagrams
- [ ] Rebuild required CPU/FDE activities
- [ ] Rebuild or migrate required misconception checks
- [ ] Rebuild or migrate required embedded exam-practice content
- [ ] QA the completed `1.1.1` lesson against the old reference
