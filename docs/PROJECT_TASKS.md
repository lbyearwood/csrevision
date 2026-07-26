# Project Tasks

Last updated: 2026-07-26

Audience: Codex agents. The user does not plan to read this. Keep this file terse, current, and action-oriented.

This is the active project state file for `csrevision`. Future Codex agents should read this first, then `PROJECT_BRIEF.md`, then the specific docs for the area being changed.

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
- `[~]` Move the frontend from demo/in-memory data toward real Supabase-backed flows.
- `[ ]` Convert the RLS checklist into executable database tests.
- `[ ]` Continue backend wiring beyond assignments: student creation, password reset, result detail, suspicious activity detail, answer save/submit hardening, and full regression QA.

## Recently Completed

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
- `[x]` Added placeholder OCR resource data: 8 units, 41 numbered topics, 41 practice tests, and 205 five-option MCQs across frontend demo data and local Supabase seed.
- `[x]` Added `docs/DEVELOPMENT_SETUP.md` with fresh-machine dependencies, frontend-only mode, full local Supabase setup, seed verification, and Codex run commands.
- `[x]` Added `docs/HANDOVER.md` for continuing on a different PC.
- `[x]` Implemented persistent teacher assignment creation in local Supabase.
- `[x]` Split Teacher Assignments into `Create assignment` and `Existing assignments`.
- `[x]` Added assignment history by selected class/course with unit/topic rows, available test, times assigned, and last five due dates.
- `[x]` Verified newly created assignments appear on the student Assigned page.
- `[x]` Removed due-date deadline enforcement from `start-test-attempt`; due dates are planning metadata only.
- `[x]` Diagnosed stopped local Edge Runtime; `docker start supabase_edge_runtime_csrevision` restored function calls.
- `[x]` Browser QA verified a past-due assigned assessment can start and load the active test screen.

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
- `[ ]` Confirm seed data can be recreated from a clean local reset.
- `[ ]` Convert `supabase/tests/rls_policies.sql` from checklist notes into executable pgTAP tests.
- `[ ]` Test that students cannot read other students' data.
- `[ ]` Test that students cannot read correct answers, mark schemes, or hidden feedback.
- `[ ]` Test that teachers cannot read classes/students/attempts outside their ownership.
- `[ ]` Test assigned one-attempt enforcement at the database/function layer.
- `[ ]` Test test-version immutability after attempts exist.
- `[ ]` Investigate `supabase_vector_csrevision` restart loop and decide whether to exclude it locally or fix Docker log access.
- `[x]` Document local Supabase start/stop/reset workflow.
- `[x]` Document when a second development computer needs local Supabase versus frontend-only demo mode.
- `[ ]` Document backup and restore approach for production data.

## Backend: Edge Functions

- `[ ]` Review each Edge Function against current frontend flows.
- `[ ]` Test `create-student-account` locally.
- `[ ]` Test `suggest-usernames` locally.
- `[ ]` Test `reset-student-password` locally.
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
- `[x]` Load current profile from Supabase after login.
- `[ ]` Load student navigation/dashboard data from Supabase.
- `[ ]` Load Practice courses, units, topics, and available tests from Supabase.
- `[ ]` Start test attempts through the Edge Function.
- `[ ]` Save answers through the Edge Function.
- `[ ]` Submit attempts through the Edge Function.
- `[ ]` Load student results from Supabase.
- `[ ]` Load student leaderboard from Supabase.
- `[ ]` Load teacher dashboard metrics from Supabase.
- `[~]` Load teacher students/classes/tests/assignments/results from Supabase. Assignment create/history is now persisted; remaining teacher views still need deeper backend wiring.
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
- `[ ]` Submit confirmation flow.
- `[ ]` Timeout auto-submit flow.
- `[ ]` Offline/interrupted-attempt handling.
- `[ ]` Accessibility pass for quiz and mobile navigation.

## Frontend: Teacher/Admin Experience

- `[x]` Teacher/admin shell and navigation.
- `[x]` Dashboard.
- `[x]` Classes page.
- `[x]` Students page.
- `[x]` Tests page.
- `[x]` Assignments page.
- `[x]` Results page.
- `[x]` Leaderboards page.
- `[ ]` Student creation UI.
- `[ ]` Student edit UI.
- `[ ]` Password reset flow wired to backend.
- `[ ]` Class creation/editing UI.
- `[x]` Assignment creation UI.
- `[ ]` Test/content management UI.
- `[ ]` Teacher result detail view.
- `[ ]` Suspicious activity detail view.
- `[ ]` CSV import/export later-stage plan.

## Design And Visual QA

- `[x]` Establish theme rule: light page background, dark top-level cards/chrome, light nested cards/rows.
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
- `[x]` Frontend unit tests pass.
- `[x]` Frontend production build passes.
- `[ ]` Database pgTAP tests pass.
- `[ ]` Full Edge Function local test suite passes.
- `[~]` Browser QA passes with local Supabase data. Targeted assignment persistence and past-due start QA passed; full regression remains open.
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
- `[ ]` Create first production-ready CPU test.
- `[ ]` Create additional Hardware topic tests.
- `[ ]` Replace placeholder tests with authored/reviewed production question content.
- `[ ]` Define content import workflow for tests/questions/options.
- `[ ]` Plan future resource types: revision lessons, tutorials, worksheets.

## Decisions Needed

- `[!]` Decide whether local Supabase should exclude the Vector/log collector service if it keeps restarting.
- `[!]` Decide seed-user password rules for local development.
- `[!]` Decide whether teacher/admin accounts are manually seeded for MVP or created through admin-only UI first.
- `[!]` Decide the minimum database test set required before connecting real student data.

## Notes

- Supabase cloud should host the backend, but Git-tracked SQL migrations should remain the source of truth for schema.
- Use `docs/SUPABASE_SETUP.md` before local or cloud Supabase work.
- Real student data needs backups; migrations only recreate structure, not production data.
- Avoid dashboard-only schema changes. Make schema changes in SQL migrations so they can be reviewed, tested, repeated, and restored.
