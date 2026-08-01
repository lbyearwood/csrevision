# Question Lab: Batches 1–5

Status: ready for stakeholder review; not production code.

This isolated mini-site prototypes all twenty-four planned question types before they are added to the main csrevision application:

1. Single choice.
2. Multiple select.
3. True or false.
4. Short text with explicit accepted variants.
5. Numeric answers with tolerance and a required unit.
6. Matching.
7. Ordering.
8. Categorisation.
9. Paragraph fill-in-the-blanks.
10. Code fill-in-the-blanks.
11. Table completion.
12. Truth-table completion.
13. Trace-table completion.
14. Diagram labelling with fixed hotspots.
15. Slot-based diagram completion.
16. Structured logic diagrams.
17. Predict-the-output questions.
18. Binary, hexadecimal and denary conversions.
19. Boolean-expression evaluation and equivalence.
20. SQL query tasks against a fixed read-only dataset.
21. Code debugging and line replacement.
22. Structured code responses matched against approved complete variants.
23. Multi-part questions with marks awarded per part.
24. Extended written responses submitted for rubric review.

## Run it

From the repository root, run:

```powershell
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/Planning/Prototypes/question-types/index.html
```

Use **Student preview** to answer and mark each example, with adjacent Back and Next type controls for moving through the sequence. Use **AI authoring spec** to inspect the read-only generation and marking contract. Approval checklist choices are stored only in the browser's local storage.

Back and Next are prototype navigation between response types, not the approved assigned-test journey. The proposed one-way timed assessment flow is deferred in [Assigned test delivery](../../Work%20Packages/Assigned%20test%20delivery.md) until the question types are approved.

## What approval covers

Each question type must be reviewed for:

- Design: prompt, response and feedback hierarchy.
- Functionality: input, reset, marking and navigation behaviour.
- Auto-marking: deterministic rules and appropriate partial credit.
- Accessibility: native controls, labels, keyboard access, focus and status text.
- QA: correct, incorrect, blank and boundary cases.

Selected answers use neutral emphasis before marking. Correctness icons and strong semantic colours appear only after `Check answer` produces feedback.

The prototype intentionally has no Supabase connection, authentication, production routes or real learner data. Questions will be generated, versioned and maintained by AI; teachers will not edit question content or marking configuration. Marking logic is kept in `marking.mjs` and verified with `marking.node-test.mjs`.

## Mobile acceptance gate

Mobile and tablet usability is required for approval. Every response control and action must work without hover, drag-and-drop or precise pointer input. Interactive targets must be at least 44 by 44 CSS pixels, inputs must avoid automatic mobile zoom, the question body must not overflow horizontally, and the active question type must stay discoverable in the horizontal navigation. Phone portrait and tablet portrait are both included in browser QA.

## Proposed rules demonstrated

- Single choice and true/false use exact option identifiers.
- Multiple select requires an exact set for full marks. Optional partial marks award proportional credit, with an incorrect selection cancelling one correct selection.
- Short text collapses whitespace and ignores case by default, but only accepts complete configured variants. It never uses substring matching.
- Numeric answers use an inclusive tolerance and an exact normalised unit.
- Matching and categorisation award proportional credit per correct mapping.
- Ordering compares each item with the expected position and supports keyboard-operable move controls.
- Paragraph and code blanks mark each configured answer independently; code tokens can preserve case sensitivity. AI-authored code blanks must enumerate every valid equivalent answer or fix enough surrounding code that only one token can complete each blank.
- Table, truth-table and trace-table cells award marks independently and use native labelled controls within semantic tables.
- Fixed-hotspot and diagram-slot questions use numbered, keyboard-operable selectors instead of drag-and-drop, so the same interaction works with mouse, keyboard and touch.
- Structured logic diagrams keep wiring fixed while students choose whitelisted gates; the accessible SVG updates as the circuit is built.
- Program-output questions use syntax-highlighted fixed code and exact validated outputs.
- Base conversions and Boolean questions award marks independently per explicit field.
- SQL answers are normalised and compared with validated query variants. The prototype never executes student SQL, and production execution would require parsing, whitelisting and a read-only sandbox.
- Code-debugging questions mark the faulty line and its complete whitelisted replacement independently.
- Structured code responses are compared with explicitly approved complete variants. Student code is never executed in the browser, Supabase or another service.
- Multi-part questions preserve distinct labels, controls and marks for every part, so one wrong answer cannot block credit elsewhere.
- Extended responses validate submission completeness but remain pending until rubric review. The interface never presents an estimated review mark as authoritative.
