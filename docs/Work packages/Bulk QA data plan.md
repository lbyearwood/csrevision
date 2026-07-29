# Bulk QA data plan

## Purpose

Create a realistic local Supabase dataset large enough to assess the teacher and student platform under normal classroom use. All data will be fictional, deterministic, and stored in the existing relational tables.

## Completed foundation

- [x] Added the Pearson BTEC Level 3 National Extended Certificate in IT (AAQ) course to the local Supabase database.
- [x] Added the four mandatory Units and 40 specification-coded content topics.
- [x] Verified the course, unit counts and topic counts in the signed-in student Practice flow.
- [x] Added a published, auto-marked "Essential concepts" practice test and question bank for every BTEC topic.

## Target scope

- Add a second local course: Pearson BTEC Level 3 National Extended Certificate in IT (AAQ).
- Its four Units are Information Technology Systems, Cyber Security and Incident Management, Website Development, and Relational Database Development.
- The BTEC structure is Unit > learning aim > coded content topic. The current product has Unit > Topic > Test, so coded content areas such as A1, A2, B1 and C1 become Topics. Learning aims A/B/C remain in the title and future grouping metadata; they do not become separate Units.
- Ten active classes: GCSE Computing classes in Years 10 and 11, and BTEC IT classes in Years 12 and 13.
- Twenty-five active students per class: 250 active students total.
- Add two archived classes and two archived student accounts, retaining their historical attempts, points and leaderboard records.
- The existing sample cohorts are relabelled as Year 10 GCSE classes. The first grows from five to 25 students, eight further active classes are added, and no Year 7â€“9 data is retained.
- Each student has a starting year group and joined date so the current year calculation continues to roll forward each September.
- BTEC classes use Years 12 and 13; GCSE classes use Years 10 and 11.

## Classroom and assignment mix

For each class, seed a balanced set of assignments across several units and topics:

1. Two current assignments with future deadlines: a mix of not started and in-progress attempts.
2. Three expired assignments with past deadlines: a mix of completed, late, and missing attempts.
3. Two recently completed assignments with feedback released.
4. One scheduled assignment that has not opened yet.

This creates 80 teacher-visible assignments across ten active classes, with additional historical assignments retained for archived classes. Every assignment has a mandatory due date and uses an existing published test version.

## Student learning data

- Generate roughly 3,000–5,000 attempts across the active and historical students.
- Give each student a varied history of practice and assigned attempts over recent weeks.
- Include realistic score bands: strong, secure, developing, and needs-support learners.
- Include a small controlled set of in-progress, submitted, marked, timed-out, abandoned, and late attempts.
- Populate points transactions from completed attempts and generate all-time leaderboard snapshots ranked from those points.
- Add page-view activity events for a representative spread of students, so the teacher activity dialog has useful timelines.

## Data design safeguards

- Use fictional names, identifiers, and local-only login data.
- Generate stable IDs and deterministic score patterns so a reset produces the same useful dataset.
- Reference only existing subjects, units, topics, tests, test versions, and question records.
- Keep attempts linked to the test version actually assigned, preserving the future test-versioning model.
- Do not change production-facing features, layouts, or business logic as part of the data pass.

## Implementation approach

1. [x] Added a repeatable local bulk-fixture SQL script, rather than hand-maintaining hundreds of records.
2. [x] Built the BTEC AAQ course structure and its published test resources before generating cohorts or activity data.
3. [x] Added classes, student profiles, local auth identities, memberships, assignments, attempts, points, snapshots, and activity events.
4. [x] Loaded and checked the local dataset: 10 active classes, 250 active students, 2 archived classes, 92 assignments, 3,442 attempts, and 300 all-time standings.
5. [x] Visually inspected teacher Dashboard, Results, and Leaderboards, plus the representative student Home screen. Fixed the dashboard so its summaries and performance table are scoped to the selected class and its completion indicator cannot exceed 100%.

## Acceptance checks

- Ten active classes and 250 active students are visible in Students and Classes.
- Each class filter returns 25 active students.
- Year group changes are calculated from each stored starting year and join date.
- Active and Expired Assignments both contain varied, descriptive test records.
- Results has enough rows to exercise horizontal scrolling, date filtering, and class/course/unit/topic filters.
- Leaderboards have meaningful rankings for each class, year group, and all-time history.
- Student Home, Assigned, Results, and Leaderboard pages show differing progress and performance states.
