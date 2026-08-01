# Auto-mark Question Types

This is the consolidated list of planned question formats. Question presentation and marking strategy must remain separate: a standard or scenario-based question can use any compatible response type.

## Deterministic and structured question types

1. Single choice.
2. Multiple select.
3. True or false.
4. Short text with explicit accepted variants.
5. Numeric answers with tolerance and required units.
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
16. Structured logic-gate and network diagrams.
17. Predict-the-output questions.
18. Binary, hexadecimal and denary conversions.
19. Boolean-expression evaluation and equivalence.
20. SQL query tasks against a fixed read-only dataset.
21. Code debugging and line replacement.
22. Structured code responses with explicit accepted variants and no code execution.
23. Multi-part questions with marks awarded per part.
24. Extended written responses requiring teacher, self or AI-assisted review.

## Marking boundaries

- Fully deterministic: choice, multiple select, numeric, accepted short text, matching, ordering, categorisation, cloze, fixed-cell tables, conversions and predictable program output.
- Deterministic when structured: truth tables, trace tables, diagram labels, diagram slots, logic/network construction, SQL and approved complete code variants.
- Human or AI-assisted review: misconception corrections, explanations, freehand diagrams and extended written responses.

Selections and explanations within the same prompt must be marked as separate parts. For example, an odd-one-out selection can be auto-marked while its justification remains reviewable.

## Prototype status

- Batches 1–5 are ready for design and behaviour review in [Question Lab](../Prototypes/question-types/README.md): all 24 planned formats, from single choice through code debugging, non-executed structured code responses, independently marked multi-part questions and extended responses submitted for rubric review.
- No prototype is production-approved until its five-item design, functionality, auto-marking, accessibility and QA checklist has been agreed.

## Content ownership

- Questions, accepted answers, marking configurations and feedback will be generated, versioned and maintained by AI.
- Teachers will use assigned assessments and results but will not edit question content or marking rules.
- The AI authoring pipeline must validate every complete question version before publication; later changes create a new version and repeat validation.

## Device acceptance gate

- Every question type must pass desktop, phone portrait and tablet portrait QA before production approval.
- Mobile interactions must not depend on hover, drag-and-drop or fine pointer control; touch targets must be at least 44 by 44 CSS pixels.
- Questions, feedback and navigation must remain usable without horizontal page overflow or automatic input zoom.
