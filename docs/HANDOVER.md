# Codex Handover

Last updated: 2026-07-30

Audience: a new Codex agent continuing `csrevision` on a different development computer.

## Start Here

Read these files in order:

1. `docs/CODEX_START_PROCESS.md`
2. `docs/CODEX_DEVELOPMENT_PROCESS.md`
3. `docs/CODEX_END_PROCESS.md`
4. `docs/HANDOVER.md`
5. `docs/PROJECT_TASKS.md`
6. `PROJECT_BRIEF.md`
7. `docs/DEVELOPMENT_SETUP.md`
8. `docs/TESTING.md`
9. `docs/SUPABASE_SETUP.md`
10. `docs/TROUBLESHOOTING.md`
11. `docs/planning/csrevision-full-test-plan-checklist.html` if continuing staged QA or fixing staged-test failures

The active branch is:

```powershell
agent/csrevision-accounts-mvp
```

Current user instruction:

- Run per-task QA after each development task.
- Run the end process only when the user explicitly says `end` or asks to wrap up development.
- The end process includes committing and pushing the active branch.
- Do not push unless the user explicitly says `push`.

## Session update - 2026-07-30

### Current local working mode

- Local Supabase is still mandatory. There is no frontend demo fallback and no browser-only fixture fallback.
- Active branch: `agent/csrevision-accounts-mvp`.
- The standalone sequential QA artifact is now part of the Codex workflow: `docs/planning/csrevision-full-test-plan-checklist.html`.
- The test-plan page is read-only for the user. Codex must update status/evidence by editing the HTML artifact.

### Completed in this session

- Fixed Stage 4 failures from the standalone sequential test plan.
- Student Practice now follows `Course -> Unit -> Topic -> Test`. Topic pages show available tests only; no hidden future `revision_lesson`, `tutorial`, or `worksheet` buttons are visible.
- In-progress practice attempts now survive browser reload and Continue Practice. `start-test-attempt` returns safe questions plus the current student's saved answers for an owned/resumable attempt.
- `AppState` restores returned answers into local state so answered count and selected options rehydrate correctly.
- Active test option selection supports keyboard Enter/Space and uses blue selected styling. Green remains reserved for correct/success states.
- Submitting with unanswered questions now shows an explicit warning and requires `Submit anyway`.
- Student My Results topic rows now include points earned.
- Student Profile now has class-code join UI and handles invalid, disabled, and valid class codes through local Supabase.
- Student all-time leaderboard rows now include public IDs in the visible label so same-name bulk-seed students are distinguishable.
- `supabase/qa_bulk_seed.sql` is safely rerunnable and now includes deterministic fixtures for no-current-learning-gaps, completed open selected-recipient, and past-due outstanding assignment checks.
- Temporary browser-QA attempts and temporary class-code membership changes were cleaned from the local database after verification.

### Standalone test-plan state

- Artifact: `docs/planning/csrevision-full-test-plan-checklist.html`.
- Total tests: 236.
- Stage 4 recorded state after fixes: 37 pass, 1 blocked, 0 fail.
- Remaining Stage 4 blocker: Test 94. The PDF download button clicked successfully and produced no console errors, but the in-app browser did not expose the downloaded PDF file for visual inspection.
- Next staged QA task: begin Stage 5 only when the user asks; do not skip ahead.

### Latest verification on 2026-07-30

```text
npm.cmd run lint: passed
npm.cmd run typecheck: passed
npm.cmd test: passed, 5 files / 16 tests
npm.cmd run build: passed, existing Vite >500 kB chunk warning only
git diff --check: passed, Windows CRLF warnings only
App health: http://127.0.0.1:5173/ HTTP 200
Edge health: http://127.0.0.1:54321/functions/v1/start-test-attempt OPTIONS HTTP 200
```

Local bulk QA seed verification:

```text
active_students=250
active_real_classes=10
test_assignments=94
test_attempts=3142
assignment_recipients=51
bulk_seed_audits=1
```

Targeted browser QA:

- `qa10acomputing07` Home showed the no-learning-gaps state.
- Practice opened OCR GCSE Computer Science, Unit 1, topic `1.1 Programming fundamentals`, then `1.1 Programming fundamentals test 1`.
- Reload/Continue restored an in-progress practice attempt with saved answer state; no `Attempt not found`.
- Keyboard answer selection changed the selected option and answered count.
- Unanswered submit warning appeared before submission.
- `qa10acomputing12` My assignments excluded the completed open selected-recipient `1.11 IDEs test 1`.
- `qa10acomputing07` My assignments showed the past-due outstanding `1.5 Procedures and functions test 1`.
- My Results displayed per-topic points.
- Profile class-code join rejected invalid/disabled codes and accepted a temporarily enabled valid code; temporary membership was removed.
- All-time leaderboard displayed public IDs, e.g. `Ava Ahmed (ID Q01104)` and `Ava Ahmed (ID Q01204)`.

### Recommended next work

1. Continue the standalone sequential test plan at Stage 5 when the user asks.
2. Resolve or externally verify Stage 4 Test 94 PDF-file inspection if the user wants zero blockers before Stage 5.
3. After staged QA, resume product work: merge teacher Courses and Assignments into one Resources workflow, then design Class performance views by assigned resources/unit/topic.

## Session update — 2026-07-29

### Current local working mode

- Local Supabase remains the development source of truth for Auth, Postgres, RLS, assignments, attempts, results, activity history, and seeded QA data.
- The active branch remains `agent/csrevision-accounts-mvp`.

### End-of-session update - 2026-07-29

- Teacher Assignments now shows the number of recipients and a `View students` modal for both Active and Expired assignments. The modal lists every recipient, status, score, points earned, and whether a completed attempt met the deadline. Delete permanently removes assignments with no attempts; assignments with attempt history are archived so Results history remains intact. Migration `20260729145825_allow_delete_unused_assignments.sql` grants the required owner/admin delete policy locally.
- Teacher Results date fields keep their default last-seven-days values but are always editable. The checkbox only controls whether the date range is applied.
- Teacher Results now includes a lavender unit-summary row before each unit's tests. It shows the unit class average and each student's unit average, while retaining every detailed test row below it.
- Clicking a student name in Teacher Results now opens a course-performance modal: overall average, raw marks, tests completed, best score, points earned, plus a unit-by-unit test breakdown. The modal downloads a matching browser-generated PDF. `src/lib/studentPerformancePdf.test.ts` directly verifies the PDF blob, filename, and download trigger.
- Latest targeted browser QA: custom Due from/Due to values were accepted; assignment progress was opened with seeded class data; Results unit rows rendered; and the student performance report rendered with grouped unit summaries.
- End-process verification on 2026-07-29: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test` (5 files, 16 tests), `npm.cmd run build`, and `git diff --check` all passed. The production build retains the existing Vite chunk-size warning only. `npx.cmd supabase status` passed; imgproxy and pooler remain stopped but are non-blocking for this local app.
- Next recommended product task: continue reshaping the Teacher Dashboard around actionable class and unit performance, using the new Results summaries as the drill-down reference.

### Completed in this session

- Added the BTEC Level 3 National Extended Certificate in IT AAQ course structure: Information Technology Systems, Cyber Security and Incident Management, Website Development, and Relational Database Development, with coded content topics and practice resources.
- Added a repeatable large local QA data set: ten active classes across Years 10–13, archived history, class-course entitlement data, assignments in different states, attempts, scores, points, leaderboard data, and activity events. Do not create Years 7–9 data while the available courses remain KS4/KS5 only.
- Added class-course entitlements. Teachers choose permitted courses in Edit Class; student Practice and My Results now respect those permissions.
- Added student activity logging and the teacher-only Student Activity viewer.
- Added test marking-method metadata. Existing placeholder MCQ tests default to Auto-marked; supported labels are Auto-marked, AI-reviewed, Self-marked, and Teacher-marked.
- Improved teacher Courses, assignment selection, Results, classes, student editing, dashboard filtering, and leaderboard filtering for the larger seed set.
- Improved student navigation, class/all-time leaderboards, profile, Home visuals, and assignment handling. Completed work is excluded from My assignments; attempts are no longer artificially limited.
- Added secure completed-attempt review and PDF download. Students now receive an end-of-test summary with score, percentage, answer review, and feedback before returning to My Results.
- Removed test timers for now. New and in-progress local attempts have no timer or automatic expiry. Removed the distracting anti-cheating footer from the active test page.
- Updated My Results: unit summaries are shown by default and each topic-level breakdown is collapsed until the student expands it.

### Latest verification

- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run test`: passed (4 files, 12 tests).
- Browser QA passed for the current student test flow without timers, the completed-test summary/review, and My Results unit summaries in both collapsed and expanded states.

### Important local-only state and risks

- The bulk QA records live in the local database until recreated from `supabase/qa_bulk_seed.sql`; do not treat browser-created attempts or activity as Git-tracked data.
- Run a clean local reset plus bulk seed replay before relying on the fixture for broader regression testing.
- The GitHub CLI token is currently invalid. A normal `git push` may still use configured Git credentials; if it does not, re-authenticate GitHub before retrying.
- Test-version authoring remains a planned workflow. Existing IDs protect historic links, but teacher-facing draft/publish version management is not yet built.

### Recommended next work

- Run a clean local Supabase reset and bulk seed replay, then complete a cross-role regression pass on class-course access, assignments, test review, Results, and leaderboards.
- Next product decision: design the teacher workflow for editing and publishing new test versions without changing historic attempts.

Current local Git state on 2026-07-28:

- Branch: `agent/csrevision-accounts-mvp`.
- Working tree is dirty and local changes are not pushed.
- Modified project docs: `PROJECT_BRIEF.md`, `docs/CODEX_DEVELOPMENT_PROCESS.md`, `docs/CODEX_END_PROCESS.md`, `docs/CODEX_START_PROCESS.md`, `docs/DEVELOPMENT_SETUP.md`, `docs/HANDOVER.md`, `docs/PROJECT_TASKS.md`, `docs/SUPABASE_SETUP.md`, `docs/TESTING.md`.
- Modified app files: `src/features/teacher/TeacherApp.tsx`, `src/features/student/StudentApp.tsx`.
- The user requested docs/handover updates after the Teacher Assignments Active/Expired tab work. Preserve these local changes; do not revert unrelated earlier edits.

Clone and enter the branch:

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git checkout agent/csrevision-accounts-mvp
git pull
```

## Current Product State

`csrevision` is a React/Vite/TypeScript/Tailwind app backed by local Supabase for real persistence during development.

Current working mode is persist mode:

- Use local Supabase for Auth, Postgres, RLS, seed data, Edge Functions, assignments, attempts, answers, points, and results.
- Do not treat teacher actions as UI-only mocks.
- There is no frontend-only/demo fallback. Missing `.env.local` or local Supabase config must block sign-in and surface a local Supabase required message.

Recent completed work:

- `supabase/tests/rls_policies.sql` is now an executable pgTAP suite with 29 passing local database tests.
- The RLS suite verifies student isolation, staff-only question/option protection, teacher ownership boundaries, teacher class-update ownership, teacher direct student-update denial, teacher direct cross-class student move denial, multi-class membership with duplicate active membership blocking, anon denial, assigned-attempt uniqueness, and immutability after attempts exist.
- Class archive/join-code work is implemented in local Supabase and frontend state: `classes.join_code`, `classes.accepting_students`, `classes.is_system`, protected teacher-owned `Non-class`, multi-class `student.classIds`, and server-managed join code regeneration.
- New Edge Functions: `archive-class`, `join-class-by-code`, and `regenerate-class-code`.
- Student join links use `/#/join/<CODE>`. If the student is not signed in, the code is stored through login and applied after student sign-in.
- Teacher Classes now shows class codes, a visible non-button joining status, an accepting-students checkbox under Edit details, copy code/link, regenerate code, protected `Non-class`, archive-with-move-to-Non-class behavior, and checkbox filters for year group/status.
- Student Profile now supports manual class-code join. Students cannot unenrol themselves.
- Teacher Students now supports selected-student editing for first name, surname, class memberships, active/inactive status, server-side password reset, generated 8-character temporary password, and archive-style delete.
- `supabase/functions/update-student-account` performs staff-only student updates, multi-class membership reconciliation, inactive/archive changes, active membership changes, and audit logs.
- `supabase/functions/reset-student-password` is locally tested for manual and generated password resets through Supabase Auth Admin.
- `supabase/migrations/20260726223830_add_student_account_management.sql` briefly added a one-active-class-membership-per-student invariant; `20260727140326_class_archive_non_class_join_codes.sql` supersedes it with multi-class membership and duplicate active same-class blocking.
- Teacher dashboard summaries and Results rows now use `test_attempts.class_id_at_attempt` for historical class reporting. Current rosters and default leaderboards use active class membership and hide archived students.
- Teacher Classes now supports inline editing for class name, academic year, year group, and status. Saves go through local Supabase `public.classes`; no frontend-only fallback is allowed.
- Frontend demo fallback was removed. `src/data/demoData.ts` was deleted, auth no longer returns fake users, and `scripts/generate-placeholder-resources.mjs` now writes only `supabase/seed.sql`.
- Placeholder test resources now use `<topic> test 1` titles and `*-test-1` slugs. There should be zero generated `*-check` test slugs.
- Teacher assignment creation has topic-level `Select all` / `Clear topic` controls for all tests under a topic.
- Teacher Assignments contrast was fixed: light dropdowns/date inputs and light nested topic/test rows now explicitly use dark `text-ink` inside dark panels.
- Codex process docs now split development QA from end-of-day wrapping: per-task QA happens after each development task; the end process only runs when the user says `end` and includes update docs, handover, local commit, and push.
- Teacher Courses page is organized like the student Practice page. The route still uses `/teacher/tests` for now.
- Teacher Assignments page is split into `Create assignment`, `Active Assignments`, and `Expired Assignments`.
- Teachers can select a class, course, one or more published tests, and an optional due date.
- Assignment creation inserts real rows into `public.test_assignments`.
- `Active Assignments` filters by class, course, unit, and topic; shows date created, class, topic, and assignment deadline; includes assignments with no deadline and assignments whose `due_at` has not passed.
- `Expired Assignments` uses the same filters and columns, but includes only assignments whose `due_at` deadline is in the past.
- Student Assigned page shows persisted assignments for the student's class.
- Assignment due dates are planning metadata for student access. They do not block starting or completing a test; the teacher Active/Expired tabs use them only to separate current and expired rows.
- `start-test-attempt` no longer checks `due_at`.
- `update-student-account` archives students instead of hard-deleting. It ends active class memberships and keeps results/audit history.
- Development/QA docs now require targeted behavioural testing before any functional task is marked complete. Static checks alone are not enough for feature work. This rule lives in the development process, not the end process.
- Selected rows/items must be visually stronger than hover/rest states. The Teacher Students selected row now uses a dark selected fill with a blue left accent instead of the previous pale blue.
- Form controls inside white cards must use a distinct control surface. Teacher light inputs/selects/textareas now use a tinted `bg-mist` surface with a clear border/focus state instead of white-on-white styling.
- Status labels must not look like buttons or sit inline beside action buttons. The shared status component now uses inline coloured dot/text indicators instead of filled pill controls, and class-card action buttons sit under the year-group detail rather than beside status text.
- Action hierarchy is now a design principle: filters must look like filters, routine actions use restrained outline styling, utility actions are lower-emphasis and grouped separately, and destructive actions use danger styling. Teacher Classes, Students, Courses, Assignments, Results, Leaderboards, Dashboard, and Settings have been visually checked against this rule.
- Non-duplication is now a design principle: do not repeat selected filter values or page scope in a separate visible card when the filter controls already show those values. Do not show a visible page heading that exactly repeats an already-visible active navigation item unless it adds context or navigation is hidden. Do not repeat course/unit/topic hierarchy text in dense table rows when the row title already contains the same wording/numbering.
- Fluid desktop layout is now a design principle: desktop teacher/student app shells and primary work surfaces should use the available browser width. Do not reintroduce generic desktop `max-w-*` shell caps except for compact auth/forms/modals or intentionally narrow reading surfaces.
- Teacher Students now supports `All classes` by default, class filtering, and search across student name, username, public Student ID, class, and status.
- Teacher Students class editing uses real-class checkboxes. Saving adds missing checked memberships, ends unchecked teacher-owned memberships, and keeps the student in `Non-class` when no real class is selected.
- Teacher Classes archive now uses `archive-class`. It archives the class, ends memberships, and moves affected students to `Non-class` where needed. It no longer requires moving students first.
- Teacher Courses now opens with a full-width course entry rather than a sparse card. It includes a course icon, content counts, and a clear exploration cue; unit cards now use a distinct accent rail, clearer title hierarchy, separate content counts, and a forward action while retaining the existing drill-down.
- Teacher Leaderboards now uses a class-specific standings header, student count, visually distinct rank markers, and compact points/status rows. The developer-facing MVP note was removed from the visible UI.

## Fresh PC Bootstrap

Install prerequisites:

- Git
- Node.js 22 LTS or newer
- Docker Desktop with Linux containers / WSL 2 enabled
- A Chromium-based browser

Install packages:

```powershell
npm.cmd install
```

Start local Supabase:

```powershell
npx.cmd supabase start
```

Create `.env.local` from `npx.cmd supabase status` output:

```text
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<PUBLISHABLE_KEY from npx.cmd supabase status>
VITE_APP_NAME=csrevision
```

Do not put service-role keys, secret keys, AI keys, or production credentials in frontend env files.

Reset database from migrations and seed:

```powershell
npx.cmd supabase db reset --local
```

Run the frontend:

```powershell
npm.cmd run dev -- --port 5173
```

If new Edge Function folders return `Function not found`, restart the local Supabase stack without `--no-backup`:

```powershell
npx.cmd supabase stop
npx.cmd supabase start
```

Open:

```text
http://127.0.0.1:5173/
```

## Seed Accounts

Password for all seeded accounts:

```text
Localdev1!
```

Teacher:

```text
j.doe@school.example
```

Students use username login in the UI:

```text
asingh5827
rmehta4120
dpatel9144
vkumar3021
mkhan7712
```

## Required Local Service Check

Before testing Edge Functions, run:

```powershell
npx.cmd supabase status
```

The output must include:

```text
FUNCTIONS_URL: http://127.0.0.1:54321/functions/v1
```

If `supabase_edge_runtime_csrevision` is listed as stopped, start it:

```powershell
docker start supabase_edge_runtime_csrevision
```

This fixed `Edge Function returned a non-2xx status code` with response body:

```text
{"message":"name resolution failed"}
```

After adding a new Edge Function, prefer a full local stack restart if Kong returns 502/host-unreachable errors:

```powershell
npx.cmd supabase stop
npx.cmd supabase start
```

`supabase_imgproxy_csrevision` and `supabase_pooler_csrevision` being stopped did not block the app during the latest QA. Edge Runtime being stopped did block test starts.

## Validation Commands

Run before committing functional changes:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Latest verified checks on this branch:

```text
2026-07-28 Handover/dev-doc refresh:
git diff --check: passed, with existing Windows CRLF warnings
Case-insensitive stale-label sweep: previous assignment-tab labels no longer appear in docs or the Teacher Assignments page.

2026-07-28 Teacher Assignments Active/Expired tab update:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
npm.cmd run test: passed, 4 files / 12 tests
npm.cmd run build: passed, with existing Vite chunk-size warning
git diff --check: passed, with existing Windows CRLF warnings
Browser QA against local Supabase: `Active Assignments` and `Expired Assignments` rendered as separate tabs; filters rendered for class/course/unit/topic; table headers were `Date created`, `Class`, `Topic`, `Assignment deadline`; Active showed current/no-deadline rows; Expired showed the empty state because no local rows currently have a past deadline.

2026-07-27 end-of-day verification:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
npm.cmd run test: passed, 4 files / 12 tests
npm.cmd run build: passed, with existing Vite chunk-size warning
git diff --check: passed, with existing Windows CRLF warnings
npx.cmd supabase status: passed; FUNCTIONS_URL present; imgproxy/pooler stopped and still non-blocking locally
npx.cmd supabase test db --local supabase\tests: passed, 1 file / 29 pgTAP tests
Browser QA against local Supabase: Teacher Dashboard, Classes, Students, Courses, Assignments, Results, Leaderboards, and Settings all rendered expected content with no framework overlay and no console warnings/errors. Assignment tab interaction and Courses drill-down also passed.

2026-07-27 Teacher Students filter/search update:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
git diff --check: passed
Browser QA against local Supabase: default `All classes` showed 5 of 5 students; selecting `8A Computing` kept only 8A rows; searching `Diya` showed 1 of 5 and selected Diya Patel; searching `zzzz` showed 0 of 5 with the no-match message.

2026-07-27 Teacher Students visual design update:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
git diff --check: passed
Browser QA against local Supabase: Teacher Students selected row computed as dark `rgb(34, 54, 83)` with white text and blue left border; selected-student form controls computed as `rgb(244, 248, 251)` inside a white `rgb(255, 255, 255)` card.

2026-07-27 Development/end process split:
git diff --check: passed
npm.cmd run test: passed, 4 files / 12 tests

2026-07-26 student account management update:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
npm.cmd run test: passed, 4 files / 12 tests
npm.cmd run build: passed
```

Latest diff hygiene verification on 2026-07-28:

```text
git diff --check: passed
```

Latest backend verification on 2026-07-27:

```text
npx.cmd supabase test db --local supabase\tests: passed, 29 tests
Coverage includes multi-class membership, duplicate active same-class blocking, teacher direct student edit denial, and teacher direct cross-class move denial.
```

Latest frontend visual QA on 2026-07-28:

```text
Teacher Classes in in-app Browser with local Supabase data: `Archive class` replaced `Delete class`; archiving `8A Computing` was blocked with the move-students-first message and no database change; a temporary no-student `QA Delete Class` row archived through the inline confirmation, disappeared from active class cards/dropdowns, persisted as `public.classes.status = archived`, and was then removed from the local database; no console warnings/errors.
Teacher Assignments in in-app Browser with local Supabase data: `1.1 Programming fundamentals test 1` rendered; topic `Select all` changed the summary to `1 tests selected`, topic state to `1/1 selected`, checkbox to checked, and the row to blue; `Clear topic` returned the summary to `0 tests selected`, topic state to `0/1 selected`, and create button to disabled; no console warnings/errors.
Teacher Classes in in-app Browser with local Supabase data: editing `8A Computing` to temporary details saved, the edited value persisted after re-sign-in, and the seed values were restored to `8A Computing`, `2026/27`, Year `8`; no console warnings/errors.
Teacher Students in in-app Browser with local Supabase data: page loaded with visible students, selected edit panel rendered name inputs, class membership checkboxes, status dropdown, password buttons, and archive button; no console errors. Targeted QA verified multi-class membership save, unchecked-membership removal, Non-class fallback, inactive login block, manual password login, generated 8-character password generation, and archive-style delete. Seed roster was restored after QA.
Teacher Results in in-app Browser with local Supabase data: class/course/unit/topic filters rendered once, the visible `Results` page heading was removed because the active sidebar item already supplies route context, repeated row subtitles such as `1. Programming / 1.1 Programming fundamentals` were removed, no repeated summary card/`dt` scope values were present, `1. Programming` narrowed the topic dropdown to 1.x topics, `1.1 Programming fundamentals` narrowed the matrix to one row, the 5-student table fit without horizontal overflow at desktop width, and no console warnings/errors were recorded.
Fluid width QA in in-app Browser with local Supabase data: Teacher Results shell measured against a 1265px document width with ~24px left and right gutters, confirming the desktop shell uses available width rather than `max-w-7xl`; Student shell measured 1280px wide in a 1280px viewport. No console warnings/errors were recorded.
Teacher Assignments Active/Expired QA on 2026-07-28 passed; see the verification block above for the exact filter and row observations.
```

Browser QA that passed:

- Teacher created assignments for `8A Computing`.
- Assignment rows persisted after reload/login.
- Active Assignments table showed only current/no-deadline assignments.
- Expired Assignments table rendered the empty state when no past-deadline assignments matched.
- Student `asingh5827` saw newly created assignments.
- A deliberately past-due assignment for `1.10 Translators and facilities` could start.
- Active test screen loaded with five questions.

The QA-created local rows are only in this machine's local Supabase database. They are not in Git and will not appear after a fresh `db reset` unless added to `supabase/seed.sql`.

Local-only class join codes may differ from a fresh reset because Regenerate was exercised during QA. A fresh reset uses the deterministic `supabase/seed.sql` values.

## Important Code Hotspots

- App state and persistence:
  - `src/app/AppState.tsx`
  - `src/lib/supabaseData.ts`
- Student UI:
  - `src/features/student/StudentApp.tsx`
- Teacher UI:
  - `src/features/teacher/TeacherApp.tsx`
- Domain types:
  - `src/types/domain.ts`
- Supabase schema and seed:
  - `supabase/migrations/20260707202000_mvp_v1_schema.sql`
  - `supabase/seed.sql`
  - `supabase/qa_bulk_seed.sql`
- Edge Functions:
  - `supabase/functions/update-student-account/index.ts`
  - `supabase/functions/reset-student-password/index.ts`
  - `supabase/functions/start-test-attempt/index.ts`
  - `supabase/functions/save-answer/index.ts`
  - `supabase/functions/submit-test-attempt/index.ts`
- QA artifact:
  - `docs/planning/csrevision-full-test-plan-checklist.html`

## Current Known Gaps

- The standalone test plan is not complete. Stage 5 is next; Stage 4 has one blocked PDF-inspection test.
- Browser QA is targeted per stage, not a full completed regression suite until all 236 tests are run.
- Student result detail, timeout auto-submit, offline/interrupted-attempt handling, and accessibility pass are still open.
- Teacher student creation, class creation, result detail, and suspicious activity detail need more real backend wiring.
- Placeholder tests are not production content. They exist to exercise the data shape.
- Production Supabase setup, Edge Function deployment, GitHub Pages env wiring, and production smoke testing are not done.

## Next Recommended Task

Continue the standalone sequential test plan at Stage 5. After staged QA, merge teacher `Courses` and `Assignments` into one `Resources` workflow, then plan/build Class views for assigned resources and class performance by unit/topic.

## Development Rules To Preserve

- Use `npm.cmd` and `npx.cmd` in PowerShell.
- Use local Supabase for backend/security/persistence work.
- Do not mark functional work complete until the changed workflow has been tested successfully with relevant browser, Edge Function, database/RLS, or persistence QA.
- Run the end process only when the user explicitly says `end`; it includes pushing the active branch.
- Selected rows, cards, tabs, and list items must be visibly stronger than hover/rest states.
- Inputs, selects, and textareas inside white cards must use a distinct background from the containing card.
- Do not repeat visible filter selections, active navigation labels, page scope, or hierarchy text when nearby UI already shows the same context.
- Desktop app shells and primary work surfaces must be fluid-width; avoid generic desktop max-width caps around dashboards, filters, tables, and work panels.
- Do not reintroduce frontend-only/demo fallback data or demo login paths before launch.
- Keep migrations as the schema source of truth.
- Keep RLS enabled on all exposed `public` tables.
- Do not authorize from user-editable metadata.
- Frontend must never receive service-role keys, hidden answers, correct answers, mark schemes, or privileged marking logic.
- Due dates are informational only unless the product owner explicitly changes that rule.
