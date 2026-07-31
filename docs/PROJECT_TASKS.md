# Project Tasks

Last updated: 2026-07-31

Audience: Codex agents. The user does not plan to read this. Keep this file terse, current, and action-oriented.

This is the active project state file for `csrevision`. Future Codex agents should follow `docs/CODEX_START_PROCESS.md` first, then read this file, then `PROJECT_BRIEF.md`, then the specific docs for the area being changed. After each development task, follow `docs/CODEX_DEVELOPMENT_PROCESS.md`. Only follow `docs/CODEX_END_PROCESS.md` when the user explicitly says to end or wrap up development.

Status key:

- `[x]` Done
- `[ ]` Not started
- `[~]` In progress
- `[!]` Blocked or needs a decision

Codex update protocol:

- Before starting project work, read this file and preserve any user-owned changes.
- When starting a task, mark it `[~]`.
- When completing a task, mark it `[x]` and add verification if useful.
- When blocked, mark it `[!]` and write the unblock action.
- Update `Last updated` whenever this file changes.
- Keep long-term product/architecture direction in `PROJECT_BRIEF.md`; keep backend commands in `docs/SUPABASE_SETUP.md`.

## Current Focus

- `[~]` Build the local Supabase/Postgres backend into the source of truth for the project.
- `[~]` Roll out the approved collapsed, numbered revision-objectives design to all 41 OCR topics using `docs/OCR_J277_SPEC_TO_APP_STRUCTURE_BREAKDOWN.txt`; retain every practice test and include gate diagrams/truth tables in `4.3 Logic gates and Truth tables`.
- `[x]` Execute and fix Stage 7 of the standalone sequential regression test plan; all 24 tests are recorded with 21 pass, 0 fail, and 3 blocked.
- `[x]` Execute and fix Stage 8 performance and scale tests; all 7 tests are recorded with 7 pass, 0 fail, and 0 blocked.
- `[x]` Execute and fix Stage 9 release regression and UAT; all 24 tests are recorded with 24 pass, 0 fail, and 0 blocked.
- `[!]` Address the 22 blocked tests recorded in `docs/OUTSTANDING_BLOCKED_TESTS.md`; prioritise P0 admin/multi-teacher fixtures, historical versioning, and the deterministic missing-config harness.
- `[x]` Keep development and QA Supabase-only until launch; no frontend demo fallback.
- `[x]` Add BTEC AAQ Extended Certificate course content alongside OCR GCSE Computer Science, with class-course access controls.
- `[x]` Add high-volume local QA data for Years 10–13 only, including active and archived classes, assignments, attempts, results, activity, and leaderboards.
- `[x]` Support multiple-tests-per-topic naming and topic-level bulk selection in teacher assignment creation.
- `[ ]` Merge teacher `Courses` and `Assignments` into one `Resources` workflow for viewing resource contents and assigning to classes.
- `[ ]` Plan class performance views by assigned resources, unit, and topic.
- `[x]` Confirm seed data can be recreated from a clean local reset.
- `[ ]` Continue backend wiring beyond assignments: student creation, result detail, suspicious activity detail, answer save/submit hardening, and full regression QA.
- `[x]` Run a clean local reset and replay the bulk QA seed before wider regression testing.
- `[ ]` Design and build teacher-facing test-version drafting/publishing so content changes never alter historic attempts.

## Recently Completed

- `[x]` Read and visually reviewed all 49 pages of OCR J277 specification Version 3.1 (May 2026), then mapped its required content, boundaries, practical programming requirements, assessment structure and command words into the existing 8-unit, 41-topic app structure in `docs/OCR_J277_SPEC_TO_APP_STRUCTURE_BREAKDOWN.txt`.
- `[x]` User approved the `1.1 Programming fundamentals` revision-objectives presentation: collapsed by default, numbered when expanded, with the existing practice test retained below it.
- `[x]` Assigned logic-gate diagrams and truth tables to `4.3 Logic gates and Truth tables` after the binary topics; rollout must include labelled AND/OR/NOT diagrams, a combined-gate example and complete truth tables.
- `[x]` Completed Stage 9 release regression and UAT. Added the selected-recipient service grant and pgTAP regression, verified the complete assignment journey and historical reporting, passed all automated/browser/responsive gates, rehearsed logical restore, audited frontend secrets, updated release docs, and removed exact UAT rows.
- `[x]` Added `docs/PRODUCTION_RELEASE_RUNBOOK.md` with backup, single-deployer migration, verification, rollback, and restore steps; local restore rehearsal matched five critical source/restored counts.
- `[x]` Fixed Stage 8 Test 211: assigned assessment actions now show a scoped Starting badge and disabled busy button immediately, prevent parallel starts, restore controls after timeout, and navigate normally after success.
- `[x]` Completed Stage 8 performance/scale QA against the 250-student bulk dataset. Results filtering and student search remained responsive, Dashboard/Leaderboards rendered cleanly, build and PDF generation checks passed, and the disposable assigned-test attempt was removed.
- `[x]` Fixed all seven Stage 7 failures: actionable local-service errors, bounded assessment hydration, pessimistic/retryable answer saves, stale-tab conflict detection, Enter sign-in, modal focus/Escape handling, and reduced-motion support. The previously blocked assessment-keyboard test now passes.
- `[x]` Added bounded test watchdog rules and `scripts/run-with-watchdog.ps1`; commands now emit heartbeats, self-detect timeout, terminate their owned process, and return exit code 124 instead of waiting indefinitely.
- `[x]` Added standalone read-only sequential test plan artifact at `docs/planning/csrevision-full-test-plan-checklist.html` with 236 discrete tests in dependency-aware execution order.
- `[x]` Completed Stage 4 fixes and updated the test-plan artifact: Stage 4 is now 37 pass, 1 blocked, 0 fail. Remaining blocker is PDF file inspection after browser download because the in-app browser did not expose the downloaded file.
- `[x]` Made student Practice a real Course -> Unit -> Topic -> Test drilldown without visible future-resource buttons.
- `[x]` Fixed in-progress practice resume/reload by rehydrating questions and saved answers from local Supabase through `start-test-attempt`.
- `[x]` Added unanswered-question submit warning, keyboard answer selection, per-topic Points in My Results, Profile class-code join validation, and public-ID labels in all-time leaderboard rows.
- `[x]` Updated bulk QA seed to be rerunnable and to include Stage 4 fixtures for no-learning-gaps, completed open selected-recipient assignment, and past-due outstanding selected-recipient assignment.
- `[x]` Added the BTEC Level 3 National Extended Certificate in IT AAQ structure: four units, coded topics, and placeholder practice resources.
- `[x]` Added repeatable high-volume local QA data across Years 10–13, including ten active classes, archived class history, varied assignment states, attempts, scores, points, all-time standings, and student activity.
- `[x]` Added class-course entitlement management in Teacher Classes and enforced it across student Practice and My Results.
- `[x]` Added student activity logging and a teacher-only per-student activity history viewer.
- `[x]` Added persisted test marking methods: Auto-marked, AI-reviewed, Self-marked, and Teacher-marked; existing placeholder tests default to Auto-marked.
- `[x]` Added a secure student end-of-test summary and downloadable PDF review, showing score, percentage, answers, and feedback after completion.
- `[x]` Removed test timers and attempt-expiry behaviour from the current product flow.
- `[x]` Updated student My Results to show unit-level summaries first, with topic details collapsed by default.
- `[x]` Improved teacher Results for high-volume use: fixed columns, top and vertical scrollbars, sticky headers, collapsible filters, due-date filtering, and sortable score columns.
- `[x]` Added teacher assignment management: recipient counts, safe delete/archive behaviour, and a per-assignment student progress summary with scores, deadline outcomes, and points earned.
- `[x]` Added clickable student performance reports from Teacher Results, with course-wide marks, percentages, completion, best score, points, unit summaries, and PDF download.
- `[x]` Segmented the Teacher Results matrix into unit summary rows, showing class and per-student unit averages before detailed test rows.

- `[x]` Pulled and inspected the project branch.
- `[x]` Read the main project documentation and MVP scope.
- `[x]` Ran the React/Vite site locally.
- `[x]` Built student Practice navigation around Course -> Unit -> Topic -> Test.
- `[x]` Kept future resource architecture open for `revision_lesson`, `tutorial`, and `worksheet` without showing unavailable buttons.
- `[x]` Moved the student leaderboard out of Profile and into its own page/menu item.
- `[x]` Updated student quiz selection styling so blue means selected and green is reserved for correctness/success.
- `[x]` Updated quiz progress bar to blue and timer text to white.
- `[x]` Applied the light-background/dark-card theme rule across student-facing pages.
- `[x]` Applied the light-background/dark-card theme rule across teacher/admin pages.
- `[x]` Installed Docker Desktop and confirmed Docker is running.
- `[x]` Installed Supabase CLI as a pinned project dev dependency.
- `[x]` Started local Supabase successfully.
- `[x]` Verified local Supabase Studio at `http://127.0.0.1:54323`.
- `[x]` Verified local Supabase API at `http://127.0.0.1:54321`.
- `[x]` Verified local Postgres on `127.0.0.1:54322`.
- `[x]` Verified the MVP migration creates 23 public tables.
- `[x]` Verified RLS is enabled on all 23 public tables.
- `[x]` Verified 29 public RLS policies exist.
- `[x]` Renamed `PROJECT_INITIATION_DOCUMENT.md` to `PROJECT_BRIEF.md`.
- `[x]` Added project brief change log and change-control process.
- `[x]` Created this Codex-facing project state tracker.
- `[x]` Restored `docs/SUPABASE_SETUP.md` as a Codex-facing local Supabase runbook.
- `[x]` Created ignored `.env.local` with frontend-safe local Supabase URL and publishable key.
- `[x]` Added deterministic `supabase/seed.sql` for local Auth users, profiles, classes, content, attempts, points, and leaderboard data.
- `[x]` Applied `supabase/seed.sql` to the running local Supabase database.
- `[x]` Verified seeded teacher and student Auth sign-ins through Supabase JS.
- `[x]` Verified seeded teacher and student sessions can read published course data through RLS.
- `[x]` Updated frontend sign-in helpers to return the active Supabase profile role/display name when Supabase is configured.
- `[x]` Updated local login defaults to use seeded development credentials.
- `[x]` Added placeholder OCR resource data: 8 units, 41 numbered topics, 41 practice tests, and 205 five-option MCQs in local Supabase seed data.
- `[x]` Added `docs/DEVELOPMENT_SETUP.md` with fresh-machine dependencies, local Supabase setup, seed verification, and Codex run commands.
- `[x]` Added `docs/HANDOVER.md` for continuing on a different PC.
- `[x]` Added `docs/CODEX_START_PROCESS.md` defining the required Codex startup sequence: sync Git, read docs, install dependencies, run the site, and report the next task.
- `[x]` Added `docs/CODEX_END_PROCESS.md` defining the user-triggered end-of-day sequence: final checks, update dev docs, write handover, commit locally, push, and report next task.
- `[x]` Implemented persistent teacher assignment creation in local Supabase.
- `[x]` Split Teacher Assignments into `Create assignment`, `Active Assignments`, and `Expired Assignments`.
- `[x]` Added Active/Expired assignment tables with shared class/course/unit/topic filters, columns for date created/class/topic/assignment deadline, and deadline-based separation.
- `[x]` Verified newly created assignments appear on the student Assigned page.
- `[x]` Removed due-date deadline enforcement from `start-test-attempt`; due dates are planning metadata only.
- `[x]` Diagnosed stopped local Edge Runtime; `docker start supabase_edge_runtime_csrevision` restored function calls.
- `[x]` Browser QA verified a past-due assigned assessment can start and load the active test screen.
- `[x]` Converted `supabase/tests/rls_policies.sql` from checklist notes into an executable pgTAP suite.
- `[x]` Verified 25 local RLS/integrity database tests pass with `npx.cmd supabase test db --local supabase\tests`.
- `[x]` Fixed teacher Assignments contrast so light dropdowns, date inputs, topic cards, and test rows reset to dark text inside dark panels.
- `[x]` Removed frontend demo fallback: deleted `src/data/demoData.ts`, removed fake auth returns, and made missing Supabase config block sign-in.
- `[x]` Renamed generated placeholder tests from generic/check wording to `<topic> test 1` and changed generated slugs to `*-test-1`.
- `[x]` Added topic-level `Select all` / `Clear topic` controls in teacher assignment creation.
- `[x]` Added teacher Classes inline editing for class name, academic year, year group, and status, persisted through local Supabase.
- `[x]` Expanded local pgTAP database tests to 25 checks, including teacher class update ownership.
- `[x]` Added teacher Students edit panel for first name, surname, class memberships, account status, password reset, generated temporary password, and archive-style delete.
- `[x]` Added `update-student-account` Edge Function for server-side student updates, multi-class membership reconciliation, inactive/archive status, active-membership changes, and audit logs.
- `[x]` Tightened `reset-student-password`: teacher-owned student check, server-side Auth Admin password update, optional manual password, exact 8-character generated password, and audit log.
- `[x]` Added migration enforcing one active class membership per student while preserving historical membership rows. Superseded by multi-class membership migration on 2026-07-27.
- `[x]` Updated teacher dashboard/results logic so class summaries use `test_attempts.class_id_at_attempt`; current rosters and leaderboards use active class membership.
- `[x]` Expanded local pgTAP database tests to 28 checks and frontend unit tests to 12 checks.
- `[x]` Added a Development/QA completion gate: functional work cannot be marked complete until the changed workflow is tested and the result is recorded.
- `[x]` Split the per-task development QA process from the end-of-day process. End now only runs when the user says `end` and includes pushing.
- `[x]` Added the selected-state design principle and strengthened the Teacher Students selected-row highlight.
- `[x]` Added the form-control surface design principle and changed teacher light form controls to use tinted input backgrounds inside white cards.
- `[x]` Added the status-indicator design principle and changed shared status labels to inline dot/text indicators instead of button-like pills. Status indicators must sit separately from action buttons.
- `[x]` Added the action hierarchy design principle and restyled the teacher panel so filters, routine actions, utility actions, and destructive actions no longer share the same priority treatment.
- `[x]` Added the non-duplication design principle: do not repeat visible filter selections/page scope, exact active-nav page headings, or hierarchy text when nearby UI already shows that context.
- `[x]` Added the fluid desktop layout design principle and removed desktop max-width caps from the teacher shell, student shell, active test surface, and student profile panels.
- `[x]` Renamed the teacher `Tests` navigation/page title to `Courses`.
- `[x]` Added Teacher Students roster filtering by all/classes and search across name, username, Student ID, class, and status.
- `[x]` Replaced the Teacher Students single class dropdown with real class membership checkboxes; saving persists multiple class memberships and uses `Non-class` when no real class is selected.
- `[x]` Replaced one-active-class-per-student with multi-class memberships and duplicate active same-class blocking.
- `[x]` Added protected teacher-owned `Non-class` holding classes.
- `[x]` Added `archive-class`, `join-class-by-code`, and `regenerate-class-code` Edge Functions.
- `[x]` Added Teacher Classes join code controls: visible non-button joining status, accepting checkbox under Edit details, copy code, copy join link, regenerate code, protected `Non-class`, archive-to-Non-class behavior, and class filters by year group/status.
- `[x]` Added Student Profile class-code join and join-link routing through sign-in.
- `[x]` Updated the Codex start process to run `npx.cmd supabase migration up --local` after every pull and verify schema when new code expects new columns.
- `[x]` Updated Student Assigned/Results/Home to use assignments from every active class membership.
- `[x]` Reworked Teacher Results into a class/course/unit/topic-filtered test matrix with class averages and one student column per roster/historical-attempt student.
- `[x]` Redesigned the Teacher Courses course and unit entries with stronger hierarchy, clear content counts, and explicit forward cues; browser QA confirmed both drill-down steps still work.
- `[x]` Redesigned Teacher Leaderboards as a class standings view and removed MVP/developer-facing copy from the product UI.

## Backend: Supabase And Postgres

- `[x]` Confirm local Supabase can run on the development machine.
- `[x]` Confirm the existing MVP migration applies locally.
- `[x]` Confirm RLS is enabled across public tables.
- `[x]` Create `.env.local` or `.env` values for local Supabase frontend development.
- `[x]` Decide the local seed strategy for auth users, teacher accounts, and student accounts.
- `[x]` Seed local teacher/admin user.
- `[x]` Seed local student users.
- `[x]` Seed classes and class memberships.
- `[x]` Seed subjects, units, topics, tests, test versions, questions, and options.
- `[x]` Seed assigned assessment data.
- `[x]` Seed practice test data.
- `[x]` Seed one placeholder five-question multiple-choice practice test for every confirmed OCR GCSE Computer Science topic.
- `[x]` Confirm seed data can be recreated from a clean local reset.
- `[x]` Convert `supabase/tests/rls_policies.sql` from checklist notes into executable pgTAP tests.
- `[x]` Test that students cannot read other students' data.
- `[x]` Test that students cannot read staff-only question and option content.
- `[x]` Test that teachers cannot read classes/students/attempts/answers outside their ownership.
- `[x]` Test that teachers can update owned classes and cannot update classes owned by another teacher.
- `[x]` Test that teachers cannot update student profiles directly through RLS.
- `[x]` Test that teachers cannot directly move a student into another teacher's class through RLS.
- `[x]` Test multiple active class memberships and duplicate active same-class blocking at the database layer.
- `[x]` Test assigned one-attempt enforcement at the database layer.
- `[x]` Test test-version/question/option immutability after attempts exist.
- `[ ]` Investigate `supabase_vector_csrevision` restart loop and decide whether to exclude it locally or fix Docker log access.
- `[x]` Document local Supabase start/stop/reset workflow.
- `[x]` Document that every development computer needs local Supabase until launch.
- `[x]` Document backup and restore approach for production data; rehearse the logical mechanism locally and require a separate non-production Supabase rehearsal before launch.

## Backend: Edge Functions

- `[ ]` Review each Edge Function against current frontend flows.
- `[ ]` Test `create-student-account` locally.
- `[ ]` Test `suggest-usernames` locally.
- `[x]` Test `reset-student-password` locally.
- `[x]` Test `update-student-account` locally.
- `[x]` Test `archive-class` locally, including protected `Non-class` rejection and moving a classless temp student to `Non-class`.
- `[x]` Test `join-class-by-code` locally, including accepting-off rejection, successful join, and idempotent repeat join.
- `[x]` Test `regenerate-class-code` locally.
- `[x]` Test `start-test-attempt` locally for assigned attempts, resume behaviour, and informational due dates.
- `[ ]` Test `save-answer` locally.
- `[ ]` Test `submit-test-attempt` locally.
- `[ ]` Test `log-attempt-event` locally.
- `[ ]` Test `reset-assigned-attempt` locally.
- `[ ]` Confirm no service-role key or private marking logic is exposed to the frontend.

## Frontend: Supabase Integration

- `[x]` Add Supabase client dependency.
- `[x]` Point local frontend env to local Supabase.
- `[x]` Replace demo student login with Supabase Auth.
- `[x]` Replace demo teacher/admin login with Supabase Auth.
- `[x]` Remove frontend demo fallback data and fake sign-in paths.
- `[x]` Load current profile from Supabase after login.
- `[ ]` Load student navigation/dashboard data from Supabase.
- `[ ]` Load Practice courses, units, topics, and available tests from Supabase.
- `[x]` Start test attempts through the Edge Function.
- `[x]` Save answers through the Edge Function.
- `[x]` Submit attempts through the Edge Function.
- `[ ]` Load student results from Supabase.
- `[ ]` Load student leaderboard from Supabase.
- `[ ]` Load teacher dashboard metrics from Supabase.
- `[~]` Load teacher students/classes/tests/assignments/results from Supabase. Assignment creation, Active/Expired assignment tables, class editing, and student edit/password/archive flows are now persisted; remaining teacher views still need deeper backend wiring.
- `[ ]` Add loading, empty, and error states for every Supabase-backed page.

## Frontend: Student Experience

- `[x]` Home/dashboard shell.
- `[x]` Practice Course -> Unit -> Topic -> Test drilldown.
- `[x]` Assigned assessments page.
- `[x]` Active quiz screen.
- `[x]` Results page.
- `[x]` Profile page.
- `[x]` Leaderboard page.
- `[ ]` Student result detail page.
- `[ ]` Better test intro/start screen for practice and assigned tests.
- `[x]` Submit confirmation flow for unanswered questions.
- `[ ]` Timeout auto-submit flow.
- `[ ]` Offline/interrupted-attempt handling.
- `[ ]` Accessibility pass for quiz and mobile navigation.

## Frontend: Teacher/Admin Experience

- `[x]` Teacher/admin shell and navigation.
- `[x]` Dashboard.
- `[x]` Classes page.
- `[x]` Students page.
- `[x]` Courses page.
- `[x]` Assignments page.
- `[x]` Results page.
- `[x]` Leaderboards page.
- `[ ]` Student creation UI.
- `[x]` Student edit UI.
- `[x]` Student roster class filter and search.
- `[x]` Password reset flow wired to backend.
- `[x]` Student class membership editing, active/inactive status, and archive-style delete wired to backend.
- `[x]` Class editing UI for existing classes.
- `[ ]` Class creation UI.
- `[x]` Assignment creation UI.
- `[x]` Topic-level bulk select/clear controls for assignment creation.
- `[ ]` Single Resources workflow replacing separate Tests/Assignments navigation.
- `[ ]` Test/content management UI.
- `[ ]` Teacher result detail view.
- `[ ]` Suspicious activity detail view.
- `[ ]` CSV import/export later-stage plan.

## Design And Visual QA

- `[x]` Establish theme rule: light page background, dark top-level cards/chrome, light nested cards/rows.
- `[x]` Establish selected-state rule: selected rows/items must be clearly stronger than hover/rest states.
- `[x]` Establish form-control surface rule: inputs/selects/textareas inside white cards must use a distinct control background.
- `[x]` Establish action hierarchy rule: filters, routine actions, utility actions, and destructive actions must be visually distinct.
- `[x]` Apply theme to student pages.
- `[x]` Apply theme to teacher/admin pages.
- `[x]` Desktop browser QA for teacher/admin routes.
- `[x]` Mobile spot check for teacher/admin routes.
- `[ ]` Full mobile browser QA for student routes.
- `[ ]` Full mobile browser QA for teacher/admin routes after backend data integration.
- `[ ]` Review empty/error/loading states once Supabase is connected.

## Testing

- `[x]` Frontend typecheck passes.
- `[x]` Frontend lint passes.
- `[x]` Frontend unit tests pass: 16 tests.
- `[x]` Frontend production build passes.
- `[x]` Database pgTAP tests pass: 29 tests.
- `[~]` Standalone sequential regression plan: Stage 4 is 37 pass, 1 blocked, 0 fail; Stage 5 is next.
- `[ ]` Full Edge Function local test suite passes.
- `[~]` Browser QA passes with local Supabase data. Targeted assignment persistence, past-due start, topic bulk-select, class editing, student edit/password/archive, teacher-panel route visual QA, Active/Expired Assignments deadline/filter interaction, and Courses drill-down QA passed; full regression remains open.
- `[ ]` Regression checklist documented before deployment.

## Deployment

- `[ ]` Confirm GitHub Pages frontend deployment settings.
- `[ ]` Confirm production Supabase project setup.
- `[ ]` Link local Supabase project to production project when ready.
- `[ ]` Apply migrations to production Supabase.
- `[ ]` Deploy Edge Functions to production Supabase.
- `[ ]` Configure production frontend env values.
- `[ ]` Confirm no service-role or secret keys are in frontend/public files.
- `[ ]` Run production smoke test.

## Content

- `[x]` Confirm first live course: OCR GCSE Computer Science.
- `[x]` Confirm unit list.
- `[x]` Confirm topic list.
- `[x]` Create placeholder tests for every confirmed OCR topic: 41 tests, 5 MCQs each, non-production content.
- `[x]` Rename placeholder tests to `<topic> test 1` so additional tests can become `test 2`, `test 3`, etc.
- `[ ]` Create first production-ready CPU test.
- `[ ]` Create additional Hardware topic tests.
- `[ ]` Add a second placeholder test under one topic to prove the multi-test-per-topic UI once the Resources workflow is merged.
- `[ ]` Replace placeholder tests with authored/reviewed production question content.
- `[ ]` Define content import workflow for tests/questions/options.
- `[ ]` Plan future resource types: revision lessons, tutorials, worksheets.

## Decisions Needed

- `[!]` Decide whether local Supabase should exclude the Vector/log collector service if it keeps restarting.
- `[!]` Decide seed-user password rules for local development.
- `[!]` Decide whether teacher/admin accounts are manually seeded for MVP or created through admin-only UI first.
- `[!]` Decide the next database/Edge Function test set required before connecting real student data.

## Notes

- Supabase cloud should host the backend, but Git-tracked SQL migrations should remain the source of truth for schema.
- Use `docs/SUPABASE_SETUP.md` before local or cloud Supabase work.
- Real student data needs backups; migrations only recreate structure, not production data.
- Avoid dashboard-only schema changes. Make schema changes in SQL migrations so they can be reviewed, tested, repeated, and restored.
