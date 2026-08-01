# Assigned Test Delivery

Status: deferred until the question-type prototypes have completed functionality and aesthetic review.

## Proposed student flow

- Tests contain either 10 or 20 questions according to topic depth.
- Present one question at a time without backwards navigation.
- The primary action starts as `Check answer`.
- Checking records the student's first submitted answer for that question.
- Reveal strong correct, partial, incorrect or unanswered feedback and the correct answer after checking.
- Change the primary action to `Next question` after feedback is shown.
- Apply a countdown to every question. The current proposal is 60 seconds.
- When time expires without a submitted response, record zero marks, show `No answer received` feedback and allow the student to continue.
- End with a report summarising score, answers, feedback and specification coverage.

## Practice and assigned tests

- Practice keeps a stable set of questions so students can deliberately revisit the same material.
- Assigned topic tests come from a pool of separately validated test forms.
- Each student receives one immutable form for an attempt.
- Every form must use the same assessment blueprint while varying wording, order and question type where equivalent.
- Balance every form across revision objectives, specification coverage, difficulty, marks and expected completion time.
- Do not reuse practice questions verbatim in assigned-test forms.

## Decisions required before implementation

- Decide whether immediate correct-answer feedback creates unacceptable answer sharing between students.
- Decide whether 60 seconds applies only to short recall questions or becomes configurable by marks, complexity and access arrangements.
- Define equivalence rules where forms use different response types; true/false, multiple choice and free response have different guessing probabilities.
- Define when an answer becomes final, how accidental submissions are handled and whether an unanswered `Check answer` is permitted.
- Define server-authoritative deadlines, reconnect behaviour, idempotent submissions and prevention of client-clock manipulation.
- Define how many validated forms each topic requires and how forms are retired, replaced and versioned.

## Implementation safeguards

- Fetch only the current question during an attempt and never send future answer keys to the browser.
- Enforce timing, first-submission locking and zero-on-timeout on the server.
- Autosaved draft responses do not count as submitted answers.
- Keep selection indicators neutral before checking; reserve ticks, crosses, green and red for revealed results.
- Provide accessible time warnings and configurable extra-time multipliers.
- Store the allocated form and question order so refreshes and reconnects cannot generate a different test.

## Deferred acceptance tests

- No Back action is available during an assigned test.
- The first completed submission remains the scored answer after refresh, reconnect or repeated requests.
- `Check answer` becomes `Next question` only after a response is marked or time expires.
- Timeout records zero and shows an explicit unanswered result.
- Ten- and twenty-question forms meet the same topic blueprint rules.
- Students assigned the same topic can receive different but equivalent forms.
- The end report reconciles exactly with the stored first submissions.
- Timer and controls remain usable with keyboard, screen reader, phone and tablet access arrangements.
