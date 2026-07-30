# Project Brief: Student Knowledge Testing Platform

**Document type:** Project Brief  
**Prepared for:** Codex project build  
**Prepared by:** ChatGPT  
**Date:** 07 July 2026  
**Current brief version:** 0.5
**Recommended project name:** Student Knowledge Testing Platform  
**Primary deployment model:** GitHub Pages frontend + Supabase backend  
**Primary local development model:** Docker Desktop + local Supabase/Postgres via pinned Supabase CLI  
**Primary design rule:** Mobile-first, tablet-second, desktop-adapted  
**Codex audience note:** Future agents should treat this as product constraints and decision history. Follow `docs/CODEX_START_PROCESS.md` first, then read `docs/PROJECT_TASKS.md` for live state.

---

## Change Log

This section records material project direction changes, architecture decisions, and major feature-scope changes. Routine implementation progress belongs in `docs/PROJECT_TASKS.md`; exact file history belongs in Git.

| Date | Version | Change | Reason |
| --- | --- | --- | --- |
| 2026-07-07 | 0.1 | Initial project brief created. | Establish MVP scope, architecture, roles, testing model, and security boundaries. |
| 2026-07-25 | 0.2 | Renamed this document from `PROJECT_INITIATION_DOCUMENT.md` to `PROJECT_BRIEF.md`. | Make the document easier to understand and maintain as the long-term product brief. |
| 2026-07-25 | 0.2 | Added `docs/PROJECT_TASKS.md` as the active running task tracker. | Separate day-to-day delivery tracking from the long-term project brief. |
| 2026-07-25 | 0.2 | Confirmed local Supabase/Postgres development as the backend source-of-truth workflow. | Reduce reliance on cloud-only schema management and make the backend reproducible from Git-tracked migrations. |
| 2026-07-25 | 0.2 | Installed and verified Docker Desktop, pinned Supabase CLI, and local Supabase stack. | Allow local database, Auth, API, Studio, migrations, and RLS testing before cloud deployment. |
| 2026-07-25 | 0.2 | Updated student Practice architecture to Course -> Unit -> Topic -> Test, while reserving space for future resource types. | Support tests now and future `revision_lesson`, `tutorial`, and `worksheet` resources later without showing unavailable student UI. |
| 2026-07-25 | 0.2 | Added generated placeholder OCR GCSE Computer Science resource data for 8 units, 41 topics, and one 5-question MCQ practice test per topic. | Enable end-to-end UI and local Supabase testing before authored production question content is ready. |
| 2026-07-25 | 0.2 | Moved student leaderboard out of Profile into its own page and menu item. | Keep Profile focused on account information and give leaderboard its own navigation surface. |
| 2026-07-25 | 0.2 | Established the current visual theme rule: light page background, dark top-level cards/chrome, light nested rows/cards. | Improve contrast and visual consistency across student and teacher/admin pages. |
| 2026-07-25 | 0.2 | Added fresh-machine development setup documentation for Codex, including dependency and local Supabase requirements. | Make the project reproducible when pulled onto another development computer. |
| 2026-07-25 | 0.2 | Reframed project docs for Codex handoff rather than user reading. | User explicitly wants persistent docs to guide future Codex agents. |
| 2026-07-26 | 0.2 | Added a required Codex start process: sync Git, read docs, refresh dependencies, run the site, and report the next task. | Make every new Codex session begin from the same verified project state. |
| 2026-07-26 | 0.2 | Added a required Codex end process: verify work, update docs, write handover, commit locally, push when instructed, and report next task. | Make every completed Codex session leave the repository and handover state ready for another computer while preserving user control over remote updates. |
| 2026-07-26 | 0.2 | Converted the local RLS checklist into executable pgTAP database tests. | Make student isolation, teacher ownership boundaries, staff-only content protection, assigned-attempt uniqueness, and attempted-content immutability repeatably verifiable. |
| 2026-07-26 | 0.2 | Removed frontend demo fallback and made local Supabase mandatory for development and QA until launch. | Ensure every visible workflow uses Auth, RLS, seed data, Edge Functions, and persistent backend behaviour. |
| 2026-07-26 | 0.2 | Adopted generated test naming as `<topic> test 1` and added topic-level bulk selection in teacher assignment creation. | Support multiple tests per topic without using `check` wording or forcing teachers to select each topic test one by one. |
| 2026-07-26 | 0.2 | Added teacher class details editing backed by local Supabase and RLS tests for class update ownership. | Let teachers maintain class metadata from the Classes page while preserving teacher ownership boundaries. |
| 2026-07-26 | 0.3 | Added teacher-side student account editing for name, class membership, active/inactive status, server-side password reset, and archive-style delete. | Let teachers manage active rosters through local Supabase Edge Functions while preserving historical attempt/results data. |
| 2026-07-26 | 0.3 | Temporarily documented a local-commit-only end process, now superseded by the 2026-07-27 v0.4 process split. | Historical note; current Codex process is defined by v0.4. |
| 2026-07-27 | 0.4 | Split Codex process docs into per-task development QA and user-triggered end-of-day wrapping. The end process only runs when the user says `end` and includes pushing. | Keep feature proof close to each development task while reserving handover, commit, and push for the deliberate end-of-day workflow. |
| 2026-07-27 | 0.4 | Added a selected-state design principle: selected rows/items must be clearly darker or otherwise strongly distinct from hover/rest states. | Prevent important selections from being lost in subtle low-contrast table or card styling. |
| 2026-07-27 | 0.4 | Added a form-control surface design principle: inputs/selects/textareas inside white cards must use a distinct background from the card surface. | Make editable fields obvious and prevent white controls disappearing into white cards. |
| 2026-07-27 | 0.4 | Added a status-indicator design principle: status labels must not look like buttons. | Keep read-only state visually distinct from actions so users do not try to click non-interactive labels. |
| 2026-07-27 | 0.4 | Added a non-duplication design principle: visible filter selections must not be repeated in a separate summary card on the same screen. | Prevent dense teacher/admin pages from wasting space and forcing users to read the same context twice. |
| 2026-07-27 | 0.4 | Added a fluid desktop layout principle: app shells and primary work surfaces should use the available browser width. | Avoid narrow desktop layouts with unused side space on teacher/admin and student app screens. |
| 2026-07-28 | 0.4 | Split teacher assignment tracking into `Active Assignments` and `Expired Assignments` views. | Let teachers distinguish current assignable workload from assignments whose deadline has passed while keeping deadline expiry out of student access enforcement. |
| 2026-07-30 | 0.5 | Added a standalone read-only sequential regression test plan with 236 discrete tests. | Give Codex a single ordered QA artifact to execute, record, fix, and hand over stage by stage. |
| 2026-07-30 | 0.5 | Confirmed bulk QA seed as the current large local fixture strategy for staged QA. | Keep student, assignment, attempt, result, leaderboard, and class-code scenarios reproducible in local Supabase before launch. |

## Change Control Process

- Update this Change Log for material scope, architecture, security, data model, deployment, or feature-direction changes.
- Update `docs/PROJECT_TASKS.md` for day-to-day work, status, blockers, and next actions.
- Write updates as decisions, constraints, verified state, commands, blockers, and next actions for future Codex agents.
- Use Git commits as the exact technical version history.
- Avoid dashboard-only database schema changes. Database structure changes should be captured in SQL migrations under `supabase/migrations`.
- Real student data must be protected by backups; migrations recreate structure, not production records.

---

## 1. Executive Summary

This project is a mobile-first student knowledge testing platform. Its primary purpose is to test students' knowledge on specific curriculum topics, record their activity, track progress, and provide teachers with clear oversight of student performance.

The application will be hosted with a static frontend on GitHub Pages and a backend on Supabase. GitHub Pages will host the user interface only. Supabase will manage authentication, database storage, Row Level Security, server-side logic through Edge Functions, test attempts, written-answer marking workflows, leaderboards, certificates, points, status levels, audit logs, and all sensitive operations.

The system must support teacher-created student accounts. Students must not be able to self-register. Teachers create classes, add students to classes, edit student details, manage test access, view results, review written answers, and monitor progress. Students complete tests, view their own progress, see results where permitted, earn points, receive certificates, and see leaderboard positions.

All tests must be organised by the hierarchy:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

Example:

```text
OCR GCSE Computer Science -> Hardware -> CPU -> CPU Knowledge Test 1 -> Version 1 -> Question 1
```

The platform must support both open practice tests and teacher-assigned assessments:

- **Practice tests:** available to students at any time and repeatable.
- **Assigned assessments:** released by the teacher and limited to one attempt per student.

The system must deter cheating by disabling normal copy, paste, printing, right-click, and text-selection behaviours during tests. It should use watermarks, timers, randomised questions, shuffled answer options, suspicious activity logging, and server-side marking. The platform must not claim to make screenshots impossible, because a normal browser cannot reliably block operating-system-level screenshots or phone photographs.

---

## 2. Project Objectives

### 2.1 Core objectives

1. Build a mobile-first, tablet-friendly, desktop-capable testing platform.
2. Host the frontend on GitHub Pages.
3. Use Supabase as the backend for authentication, database storage, server-side logic, permissions, and activity tracking.
4. Allow teachers to create classes before adding students.
5. Allow teachers to add, edit, move, deactivate, and manage students.
6. Prevent students from creating their own accounts.
7. Automatically generate student usernames using first-name initial, surname, and a random four-digit suffix.
8. Generate a separate public Student ID that is not derived from the username.
9. Organise all test content by Subject, Unit, and Topic.
10. Store all test data in the database.
11. Allow students to complete open practice tests at any point.
12. Allow teachers to assign one-attempt assessments.
13. Record all test attempts, including start time, submit time, duration, score, answers, status, and suspicious activity events.
14. Support self-marking tests.
15. Support written-answer questions with AI-assisted marking and teacher review.
16. Allow teachers to set test durations.
17. Show students a countdown timer during timed tests.
18. Always store the actual time taken.
19. Allow students to see all permitted results in their account profile.
20. Allow teachers to see all relevant student, class, test, progress, leaderboard, achievement, certificate, and marking data.
21. Provide leaderboards at class and whole-site level, controlled by teacher/admin settings.
22. Award points, certificates, and status levels based on performance and achievement.
23. Prevent public display of usernames.
24. Display leaderboard identities using first-name initial, surname, and public Student ID.
25. Provide exportable reports and CSV downloads for teachers.
26. Include audit logs for key teacher/admin actions.
27. Include privacy-conscious data handling and strict permission boundaries.

### 2.2 Success criteria

The project is successful when:

- A teacher can create a class, add students, and issue login details.
- A student can log in without self-registering.
- Test content is grouped by Subject, Unit, and Topic.
- A student can browse available practice tests and complete them.
- A teacher can assign a test to a class with a time limit and one-attempt rule.
- The system records every attempt accurately.
- Students can view their own profile, results, points, certificates, status, and leaderboard position.
- Teachers can view class progress, student progress, attempt details, written answers, marking status, suspicious activity, points, certificates, and leaderboards.
- Self-marking is performed securely outside the visible frontend.
- Written answers can be AI-marked, reviewed by the teacher, and released to students.
- The app works cleanly on mobile, tablet, and desktop.
- RLS policies prevent students from accessing other students' private data.
- Service-role keys, correct answers, mark schemes, AI prompts, and private backend logic are not exposed in the frontend.

---

## 3. Technology Stack

### 3.1 Frontend

Recommended frontend stack:

```text
React + Vite + TypeScript + Tailwind CSS
```

The frontend should be hosted on GitHub Pages.

GitHub Pages is suitable for this project because it hosts static HTML, CSS, and JavaScript files. It should not be used for private backend logic, secret keys, account creation using service-role permissions, AI marking, or secure test finalisation.

Frontend responsibilities:

- Mobile-first user interface.
- Student dashboard.
- Teacher dashboard.
- Admin dashboard.
- Class management screens.
- Student management screens.
- Test browser grouped by Subject, Unit, and Topic.
- Test-taking interface.
- Countdown timer display.
- Anti-copy/paste/print deterrent behaviour.
- Watermark display.
- Results pages.
- Profile pages.
- Leaderboard pages.
- Certificates display.
- Reports UI.
- Data-entry forms.
- Loading, error, and empty states.

Frontend must not contain:

- Supabase service-role key.
- AI API key.
- Correct answers for active tests.
- Written-answer mark schemes.
- Hidden teacher-only feedback.
- Server-side marking rules.
- Account creation logic that requires privileged access.
- Any privileged database bypass.

### 3.2 Backend

Recommended backend stack:

```text
Supabase Auth
Supabase PostgreSQL
Supabase Row Level Security
Supabase Edge Functions
Supabase Storage, optional
Supabase CLI migrations
```

Backend responsibilities:

- User authentication.
- Teacher, student, and admin role management.
- Class data.
- Student profile data.
- Username generation and uniqueness checking.
- Public Student ID generation.
- Student account creation.
- Password resets.
- Test content storage.
- Question bank storage.
- Test versioning.
- Test assignment rules.
- Attempt storage.
- Server-side marking.
- AI-assisted marking calls.
- Marking queue.
- Teacher review and override.
- Points calculation.
- Certificate awarding.
- Status calculation.
- Leaderboard calculation.
- Suspicious activity logging.
- Audit logging.
- CSV imports.
- CSV exports.
- Permission enforcement.

### 3.3 AI-assisted marking

Codex will be used as a software development agent to create the code, database migrations, test content structures, seed data, mark schemes, AI prompts, and application logic.

The live website should not rely on Codex as the runtime marker. The runtime marking workflow should use a secure backend AI-assisted marking service, called through a Supabase Edge Function.

Correct wording for the implementation:

```text
Codex builds the AI-assisted marking workflow.
Supabase Edge Functions run the secure backend marking workflow.
The frontend never receives hidden mark schemes, AI prompts, service-role keys, or private API keys.
```

### 3.4 Deployment

Recommended deployment approach:

```text
GitHub repository
  ├── frontend React/Vite app
  ├── Supabase migrations
  ├── Supabase Edge Functions
  ├── seed/import scripts
  ├── documentation
  └── GitHub Actions deployment workflow
```

Frontend deployment:

- Use GitHub Pages.
- Use GitHub Actions to build and publish the Vite app.
- Configure Vite `base` correctly for the GitHub Pages repository path.
- Use only public environment variables in the frontend.
- Use HTTPS assets only.

Backend deployment:

- Use Supabase project.
- Use migrations for schema changes.
- Use RLS policies for all exposed tables.
- Use Edge Functions for privileged operations.
- Store private keys and AI API keys as Supabase secrets.
- Never commit secrets to GitHub.

---

## 4. Core Product Rules

### 4.1 Mobile-first rule

The app must be designed for mobile first.

Priority order:

1. Mobile phone.
2. Tablet.
3. Desktop website.

The desktop version should adapt the mobile/tablet design rather than being treated as the primary design.

Selected-state design principle:

- Selected rows, cards, tabs, and list items must be visibly stronger than hover or resting states.
- On dense data views, avoid pale selected backgrounds that look like passive hover or zebra striping.
- Use a dark selected fill, strong border, left accent, clear contrast, or equivalent visible treatment.
- Keep selected text readable and maintain keyboard focus visibility.

Form-control surface design principle:

- Text inputs, selects, textareas, and similar editable controls inside white cards must not use the same white surface as the containing card.
- Use a subtly tinted control background, clear border, and focus state so editable areas are immediately visible.
- White-on-white form controls are allowed only when the surrounding surface is not white or when a stronger border/fill treatment clearly separates the control.

Status-indicator design principle:

- Status labels, badges, and state indicators must not look like buttons.
- Avoid button-like filled rounded rectangles, action-level padding, or hover-style treatments for read-only status.
- Use inline text, a small coloured dot, restrained weight, or another clearly non-clickable treatment.
- When a state affects a workflow, show the status near the relevant controls, but keep the actual control visually separate.
- Do not place status indicators inline beside action buttons. Keep state and actions in separate layout groups.

Action hierarchy design principle:

- Controls with different jobs must not share the same visual priority.
- Filters must look like form controls, not command buttons.
- Use one clear primary action per workflow area where possible.
- Routine actions should use restrained outline styling.
- Utility actions such as copy/link/regenerate should be lower-emphasis and grouped separately from management actions.
- Destructive or high-risk actions must use a danger treatment even when they sit on dark cards.

Non-duplication design principle:

- Do not repeat the same selected filter values, labels, or page scope in a second visible card when the controls already show those values.
- A filter panel is the source of truth for selected class, course, unit, topic, date, status, and similar view scope.
- Do not show a visible page heading that exactly repeats an already-visible active navigation item unless the heading adds useful context or is needed because the navigation is not visible.
- Do not repeat hierarchy labels inside dense table rows when the row title already contains the same course/unit/topic wording or numbering.
- Repeat scope only when it adds a different job, such as export/print metadata, a sticky header after the filters have scrolled away, or a detached report preview.
- If context must be repeated, make it additive: show counts, warnings, or changed state that is not already visible in the controls.

Fluid desktop layout design principle:

- On desktop, the main app shell and primary teacher/student work surfaces must use the available browser width.
- Do not cap desktop app shells with generic `max-w-*` wrappers such as `max-w-7xl` unless the screen is intentionally a compact form, auth panel, modal, or narrow reading surface.
- Keep normal page gutters and table overflow handling, but avoid large unused side margins around dashboards, filters, tables, and work panels.
- Mobile phone layouts may remain intentionally constrained where the app is using a phone-shaped shell or bottom navigation.

### 4.2 Static frontend rule

GitHub Pages hosts the interface only. It must not be used as a backend.

All protected logic must happen in Supabase.

### 4.3 Backend authority rule

The frontend is not trusted.

The backend must decide:

- Whether a student can access a test.
- Whether an assigned test has already been attempted.
- Whether a test has expired.
- Whether the submitted answer is correct.
- Whether the attempt is late, abandoned, timed out, or valid.
- What score is awarded.
- What points are awarded.
- What certificates are awarded.
- What leaderboard position is calculated.
- What data the current user is allowed to view.

### 4.4 Minimum-data rule

The only sensitive student identity data required is:

- First name.
- Surname.
- Class membership.
- Username.
- Public Student ID.
- Test results.
- Progress data.
- Certificates.
- Achievement data.
- Activity logs.

Do not collect email addresses for students unless absolutely necessary. If Supabase Auth requires an email-like identifier, the system should create an internal synthetic email address that is not displayed to students.

Example internal email format:

```text
jpatel4821@students.local
```

The student-facing login screen should ask for:

```text
Username
Password
```

not email.

### 4.5 No student self-registration rule

Students must not be able to create their own accounts.

Student accounts are created by:

- Teacher, where permitted.
- Admin.
- Bulk CSV import.

Public sign-up must be disabled.

### 4.6 Private username rule

Student usernames are private login identifiers.

Usernames must not be displayed on:

- Student-facing leaderboards.
- Public ranking tables.
- Shared achievement screens.
- Certificates shown to other students.

Usernames may be visible to:

- The student in their own account/login area.
- Teachers in the teacher management panel.
- Admin users.

### 4.7 Public Student ID rule

Each student must have a separate public Student ID.

This Student ID must:

- Be generated by the system.
- Be unique across the site.
- Be visible in the student's own profile.
- Be visible to teachers.
- Be used on leaderboards to distinguish students with the same first initial and surname.
- Not be derived from the username.
- Not be the last four digits of the username.

Example:

| Full Name | Username | Public Leaderboard Display |
|---|---|---|
| Musa Ahmed | mahmed4821 | M Ahmed — ID 1047 |
| Maya Ahmed | mahmed7392 | M Ahmed — ID 2864 |
| Mustafa Ahmed | mahmed9150 | M Ahmed — ID 6031 |

### 4.8 Test content hierarchy rule

All test content must be grouped by:

```text
Subject -> Unit -> Topic
```

Example:

```text
OCR GCSE Computer Science -> Hardware -> CPU
```

Another example:

```text
Year 8 Science -> Human Biology -> Digestive System
```

Another example:

```text
BTEC IT -> Unit 3 Social Media -> Target Audience
```

Tests must not exist as a flat list without curriculum context.

---

## 5. User Roles

### 5.1 Student

Students can:

- Log in using teacher-issued credentials.
- View their own dashboard.
- View available subjects, units, topics, and tests.
- Complete open practice tests.
- Complete assigned assessments once.
- See countdown timers for timed tests.
- Submit answers.
- View permitted results.
- View their own test history.
- View their own points.
- View their own certificates.
- View their own status level.
- View their own leaderboard position.
- View class or whole-site leaderboards where enabled.
- View teacher-released feedback.
- View their own public Student ID.

Students cannot:

- Create their own account.
- Edit their own name.
- Edit their own class.
- Edit their own username.
- Edit their own Student ID.
- View another student's private profile.
- View another student's username.
- View hidden mark schemes.
- View hidden correct answers before release.
- Access teacher/admin pages.
- Retake assigned assessments unless explicitly reset by a teacher/admin.

### 5.2 Teacher

Teachers in MVP v1 can:

- Log in using teacher/admin credentials.
- Create and manage their own classes.
- Create student accounts for their own classes.
- Edit student details.
- Move students between their own classes.
- Reset student passwords.
- Deactivate/reactivate student accounts.
- View student login details where appropriate.
- View student progress for students in their own classes.
- View class progress for their own classes.
- Assign existing published tests to classes.
- Set assignment windows, due dates, time limits, and one-attempt rules.
- View whether assigned tests are complete or incomplete.
- View self-marked multiple-choice/true-false/fixed-answer attempts.
- View suspicious activity logs for their own classes.
- View points, status levels, and class leaderboard positions.
- Void/reset assigned attempts where permitted.

Teachers in MVP v1 cannot:

- Access students outside their permitted classes unless given admin permissions.
- Create or edit test content through the UI.
- Bulk import students through the UI.
- Export results to CSV through the UI.
- Use AI marking.
- Review written answers.
- Override marks.
- Edit or release feedback.
- Manage certificates.
- Access service-role keys.
- Bypass RLS from the frontend.
- Directly alter protected audit logs.

Later versions may add:

- Bulk student import.
- Test/content management UI.
- Written-answer review.
- AI-assisted written-answer marking.
- Teacher review/override.
- Feedback release controls.
- Certificates.
- CSV export.
- Advanced reports.

### 5.3 Admin

Admin users can:

- Manage teacher accounts.
- Manage all classes.
- Manage all students.
- Manage all subjects, units, topics, tests, questions, and versions.
- Manage global site settings.
- Manage leaderboard settings.
- Manage points rules.
- Manage certificate rules.
- Manage status levels.
- Manage AI marking settings.
- View whole-site reports.
- View audit logs.
- Run imports and exports.
- Archive old academic years.

Admin users should be limited to trusted users only.

---

## 6. Information Architecture

### 6.1 Student navigation

Recommended student mobile navigation:

```text
Home
Practice
Assigned
Results
Profile
```

Alternative expanded navigation:

```text
Home
Subjects
Assigned Tests
Leaderboards
Profile
```

Student pages:

- Login.
- Student home dashboard.
- Subject list.
- Unit list.
- Topic list.
- Test list.
- Test intro page.
- Active test page.
- Test submitted page.
- Result detail page.
- Test history page.
- Certificates page.
- Leaderboard page.
- Profile page.
- Notifications page.

### 6.2 Teacher navigation

Recommended teacher navigation:

```text
Dashboard
Classes
Students
Tests
Assignments
Marking
Results
Leaderboards
Reports
Settings
```

Teacher pages:

- Teacher login.
- Teacher dashboard.
- Class list.
- Class detail.
- Create/edit class.
- Student list.
- Student detail.
- Add/edit student.
- Bulk student import.
- Subject/unit/topic browser.
- Test list.
- Test detail.
- Assign test.
- Assignment detail.
- Marking queue.
- Written answer review.
- Attempt detail.
- Class results.
- Student progress report.
- Topic weakness report.
- Leaderboard management.
- Certificates/achievements view.
- Export centre.
- Settings.

### 6.3 Admin navigation

Recommended admin navigation:

```text
Admin Dashboard
Users
Classes
Content
Imports
Site Settings
Reports
Audit Log
```

Admin pages:

- Admin dashboard.
- Teacher management.
- Student management.
- Role management.
- Site settings.
- Content management.
- Bulk import centre.
- Global reports.
- Global leaderboard settings.
- Points rules.
- Certificate rules.
- Status levels.
- Audit log.

---

## 7. Content Model

### 7.1 Content hierarchy

Mandatory hierarchy:

```text
Subject
  -> Unit
      -> Topic
          -> Test
              -> Test Version
                  -> Question
```

Example:

```text
OCR GCSE Computer Science
  -> Hardware
      -> CPU
          -> CPU Knowledge Test 1
              -> Version 1
                  -> Fetch-decode-execute question
```

### 7.2 Subject

A subject is the highest-level curriculum grouping.

Examples:

- OCR GCSE Computer Science.
- Year 8 Science.
- BTEC IT.
- GCSE Mathematics.

Suggested fields:

- Subject ID.
- Subject name.
- Course code, optional.
- Exam board, optional.
- Year group, optional.
- Description.
- Active/inactive status.
- Display order.
- Created date.
- Updated date.

### 7.3 Unit

A unit sits under a subject.

Examples under OCR GCSE Computer Science:

- Hardware.
- Software.
- Networks.
- Data Representation.
- Algorithms.
- Programming.
- Cybersecurity.

Suggested fields:

- Unit ID.
- Subject ID.
- Unit name.
- Unit code, optional.
- Description.
- Active/inactive status.
- Display order.
- Created date.
- Updated date.

### 7.4 Topic

A topic sits under a unit.

Examples under Hardware:

- CPU.
- Memory.
- Storage.
- Embedded Systems.
- Input and Output Devices.

Suggested fields:

- Topic ID.
- Unit ID.
- Topic name.
- Description.
- Keywords.
- Active/inactive status.
- Display order.
- Created date.
- Updated date.

### 7.5 Test

A test belongs to a topic.

Examples:

- CPU Knowledge Test 1.
- CPU Timed Assessment.
- CPU Written Response Practice.
- CPU Mastery Quiz.

Suggested fields:

- Test ID.
- Topic ID.
- Test title.
- Test description.
- Test type.
- Default access type.
- Default time limit.
- Default feedback policy.
- Default attempt rule.
- Randomisation enabled.
- Question pool enabled.
- Active/inactive status.
- Created by.
- Created date.
- Updated date.

### 7.6 Test version

Every published test should have a version.

Suggested fields:

- Test version ID.
- Test ID.
- Version number.
- Version status: draft, published, archived.
- Published date.
- Published by.
- Version notes.
- Total marks.
- Estimated duration.

Rule:

Once a student has attempted a test version, that version must not be silently changed. Any meaningful edit should create a new version.

### 7.7 Question

Questions belong to a test version.

Suggested fields:

- Question ID.
- Test version ID.
- Question order.
- Question type.
- Question text.
- Question prompt.
- Maximum marks.
- Difficulty.
- Expected time.
- Correct answer, where relevant.
- Mark scheme, where relevant.
- Model answer, where relevant.
- Accepted keywords.
- Common misconceptions.
- Student-friendly explanation.
- Teacher notes.
- Active/inactive status.

### 7.8 Question types

The system should support these question types:

| Question Type | Self-marking? | Notes |
|---|---:|---|
| Multiple choice | Yes | One correct answer. |
| Multiple select | Yes | More than one correct answer. |
| True/false | Yes | Simple binary answer. |
| Short fixed answer | Yes/partial | Useful for keywords, definitions, numbers. |
| Fill in the blank | Yes/partial | Normalise case and spacing. |
| Matching | Yes | Match terms to definitions. |
| Ordering/sequencing | Yes | Sequence steps correctly. |
| Written answer | AI-assisted/teacher reviewed | Requires mark scheme/model answer. |

MVP can begin with:

- Multiple choice.
- True/false.
- Short fixed answer.
- Written answer.

---

## 8. Account Management

### 8.1 Student account creation

Students cannot create their own accounts.

Student accounts may be created by:

- Teacher using the teacher panel.
- Admin using the admin panel.
- Bulk CSV import.

When a student is created, the system must generate:

- Username.
- Public Student ID.
- Temporary password.
- Student profile.
- Class membership.

### 8.2 Username format

Username format:

```text
firstinitialsurname + random4digits
```

Example:

```text
jpatel4821
```

Rules:

- Use first-name initial.
- Use surname.
- Append a random four-digit number.
- Convert to lowercase.
- Remove spaces.
- Remove apostrophes.
- Remove special characters.
- Preserve enough surname readability where possible.
- Check uniqueness before saving.
- If the generated username exists, generate another random four-digit suffix.
- Students cannot choose their own username.
- Students cannot change their own username.

### 8.3 Teacher-selected usernames

Teachers may manually edit or choose a username.

If a teacher chooses a username that already exists:

- The system must block saving.
- The system must show a clear warning.
- The system must suggest available alternatives.
- Suggested alternatives should follow the standard format.
- The teacher may select a suggestion or enter another username manually.
- Any manually entered username must be rechecked before saving.

Example:

Teacher enters:

```text
jpatel4821
```

If unavailable, the system suggests:

```text
jpatel6392
jpatel1748
jpatel9051
```

### 8.4 Username changes after name edits

If a teacher edits a student's first name or surname, the username should not automatically change.

Reason:

- Changing usernames automatically can confuse students.
- It can create login problems.
- It can break printed login cards.

Rule:

- Existing username remains unchanged by default.
- Teacher may choose `Regenerate username` if needed.
- Username regeneration must preserve all student history and results.

### 8.5 Public Student ID

Each student must have a separate public Student ID.

Rules:

- Generated automatically.
- Unique across the site.
- Not based on username.
- Not the last four digits of the username.
- Visible to the student in their profile.
- Visible to teachers.
- Used on leaderboards.
- Used to distinguish identical names.

Recommended format:

```text
ID 1047
```

Alternative future format:

```text
ID 10472
```

Use four digits for MVP unless collision risk becomes high. If the site grows, move to five or six digits.

### 8.6 Duplicate leaderboard names

If multiple students have the same first initial and surname, the Student ID distinguishes them.

Example:

```text
M Ahmed — ID 1047
M Ahmed — ID 2864
M Ahmed — ID 6031
```

### 8.7 Student detail editing

Teachers must be able to edit:

- First name.
- Surname.
- Class membership.
- Account status.
- Temporary password/reset password.
- Notes, optional teacher-only field.

Students must not be able to edit:

- First name.
- Surname.
- Username.
- Student ID.
- Class.
- Role.

### 8.8 Account status

Student account statuses:

- Active.
- Inactive.
- Archived.

Rules:

- Inactive students cannot log in.
- Archived students are hidden from normal class lists but retained for historical records.
- Deleting students should be avoided where test history exists.

### 8.9 Password management

Teachers must be able to:

- Generate a temporary password.
- Reset a student's password.
- Print or copy login details for their own students.
- Deactivate accounts.
- Reactivate accounts.

Recommended MVP rule:

- Students cannot change passwords in MVP.
- Teacher can reset passwords.

Possible later rule:

- Students may change passwords if the school wants this, but teacher reset must remain available.

### 8.10 Bulk student import

Teachers should be able to bulk import students into a class.

Input CSV:

```text
first_name,surname,class
```

System-generated fields:

```text
username,student_id,temporary_password
```

Import process:

1. Teacher uploads CSV.
2. System validates rows.
3. System shows preview.
4. Teacher confirms import.
5. System creates accounts through secure backend function.
6. System displays import summary.
7. Teacher can download generated login details.

Validation must detect:

- Missing first name.
- Missing surname.
- Missing class.
- Duplicate rows.
- Existing students, if detectable.
- Username collisions.
- Student ID collisions.

---

## 9. Class Management

### 9.1 Class creation

A teacher must create a class before adding students.

Class fields:

- Class name.
- Academic year.
- Subject association, optional.
- Year group, optional.
- Teacher owner.
- Additional teachers, optional future feature.
- Active/archived status.

Examples:

```text
8A Computing
9B Computer Science
10CS1
11CS2
```

### 9.2 Class editing

Teachers must be able to edit:

- Class name.
- Academic year.
- Year group.
- Assigned teacher, where permitted.
- Active/archived status.

### 9.3 Class membership

Students should be linked to classes through class membership records.

This supports:

- Moving students between classes.
- Allowing students to belong to more than one real class.
- Preserving historical membership.
- Reporting by current class memberships.
- Reporting by class at time of attempt.
- Holding otherwise-classless active students in a teacher-owned `Non-class`.

### 9.4 Moving students

When a student is moved from one class to another:

- Student account remains the same.
- Test history remains attached to the same student.
- Certificates remain attached to the same student.
- Points remain attached to the same student.
- Previous class membership is preserved historically if possible.
- The teacher edit flow can move the student within that teacher's classes.
- Student self-join by class code can add another active real class membership.
- Students must not be able to unenrol themselves.

### 9.5 Archiving classes

Teachers/admins should be able to archive old classes.

Archived classes:

- Are hidden from normal dashboards.
- Remain available for historical reporting.
- Preserve student results.
- Do not archive, delete, or block student accounts.
- End current memberships in the archived class.
- Move affected active students to the teacher's `Non-class` only if they have no other active real class for that teacher.
- Can be reactivated by admin if needed.

### 9.6 Non-class and class join codes

Each teacher must have one protected active `Non-class` holding class.

`Non-class`:

- Cannot be archived.
- Is hidden from assignment creation.
- Has no student join code.
- Allows active students to keep using courses and practice tests.

Real classes must have:

- A unique six-letter uppercase join code.
- An `accepting_students` setting controlled by the teacher.
- Copy-code and copy-link actions.
- Regenerate-code action.

Student join links use:

```text
/#/join/<CODE>
```

If the student is not signed in, the code is stored through sign-in and applied after student login.

---

## 10. Test Access and Attempt Rules

### 10.1 Test modes

The system must support two main modes:

| Test Mode | Access | Attempts |
|---|---|---|
| Practice test | Available to students at any time | Unlimited attempts |
| Assigned assessment | Released by teacher | One attempt only |

### 10.2 Practice tests

Practice tests:

- Are grouped by Subject, Unit, and Topic.
- Can be taken by students independently.
- Can be attempted multiple times.
- Record every attempt.
- May award points, but repeated attempts must be controlled to prevent farming.
- May show feedback immediately depending on test settings.

### 10.3 Assigned assessments

Assigned assessments:

- Are assigned by a teacher to a class or selected students.
- Can have a start date/time.
- Can have an informational due date for teacher planning.
- Must not block student completion because the due date has passed.
- Can have a time limit.
- Are limited to one attempt per student.
- Must store every attempt and status.
- Can hold feedback until the teacher releases it.
- Can require teacher review before written-answer feedback is visible.

### 10.4 Attempt records

Every attempt must record:

- Attempt ID.
- Student ID.
- Class ID at time of attempt.
- Test ID.
- Test version ID.
- Assignment ID, if assigned.
- Attempt type: practice or assigned.
- Attempt number.
- Started at.
- Submitted at.
- Duration seconds.
- Time limit seconds.
- Status.
- Score.
- Maximum score.
- Percentage.
- Marking status.
- Feedback status.
- Suspicious activity count.
- Device/browser metadata, limited and privacy-conscious.

### 10.5 Attempt statuses

Attempt statuses:

- Not started.
- In progress.
- Submitted.
- Timed out.
- Abandoned.
- Pending AI marking.
- Pending teacher review.
- Marked.
- Feedback released.

### 10.6 Assigned test one-attempt enforcement

The backend must enforce the one-attempt rule.

The frontend can hide the button, but the backend must reject attempts where:

- The assignment has already been submitted by that student.
- The assignment has timed out and been submitted.
- The student is not in the assigned class.

### 10.7 Practice retakes

Practice tests can be retaken freely.

However:

- All attempts must be stored.
- Best score can be calculated.
- Latest score can be calculated.
- Improvement can be calculated.
- Points should be capped or awarded only for meaningful improvement.

---

## 11. Test-Taking Experience

### 11.1 Test intro screen

Before starting a test, students should see:

- Test title.
- Subject.
- Unit.
- Topic.
- Test type.
- Number of questions.
- Time limit, if any.
- Attempt rule.
- Feedback rule.
- Anti-cheating notice.
- Start button.

Example wording:

```text
This is a timed assigned assessment. You will have 20 minutes. You can only take this assessment once. Copying, pasting, printing, right-clicking and leaving the page may be recorded.
```

### 11.2 Active test screen

The active test screen should include:

- Test title.
- Progress indicator.
- Countdown timer, if timed.
- Question content.
- Answer input.
- Save status.
- Next/back controls where allowed.
- Submit button.
- Watermark.
- Anti-copy/paste restrictions.

### 11.3 Timer

The student must see a countdown timer for timed tests.

The backend must store:

- Start time.
- Submit time.
- Duration seconds.
- Time limit seconds.
- Timeout status.

The frontend timer is for display only. The backend remains authoritative.

### 11.4 Auto-submit on timeout

When the timer reaches zero:

- Current answers should be submitted automatically.
- Attempt status should be marked as timed out.
- Time taken should be stored.
- Student should be shown a submitted/timeout confirmation.

### 11.5 Autosave

The system should autosave answers where possible.

Autosave should store:

- Answer draft.
- Last saved timestamp.
- Question ID.
- Attempt ID.

Autosave reduces loss of work if:

- Internet drops.
- Browser refreshes.
- Device sleeps.
- Student accidentally navigates away.

### 11.6 Interrupted attempts

The system must define behaviour for interruption.

Recommended rules:

| Situation | Recommended Behaviour |
|---|---|
| Student reloads page | Continue attempt if still valid. Log reload. |
| Internet drops | Preserve autosaved answers. Timer continues by backend time. |
| Student closes tab | Attempt remains in progress until timeout or abandoned rule applies. |
| Student leaves page | Log suspicious event. |
| Student returns before timeout | Continue if allowed. |
| Timer expires while away | Auto-submit current saved answers. |

### 11.7 Submit confirmation

Before final submission, students should see:

- Number of answered questions.
- Number of unanswered questions.
- Warning that assigned tests cannot be retaken.
- Confirm submit button.

For timed tests near timeout, auto-submit should still happen even if confirmation is not completed.

---

## 12. Marking System

### 12.1 General marking rule

Marking must not rely on the visible frontend.

Correct answers and mark schemes must not be exposed to students through browser code.

### 12.2 Self-marking question types

Self-marking should support:

- Multiple choice.
- Multiple select.
- True/false.
- Matching.
- Ordering.
- Short fixed answer.
- Fill in the blank.

### 12.3 Self-marking process

Recommended process:

```text
Student submits answers
  -> backend validates attempt
  -> backend fetches correct answers/marking rules
  -> backend calculates marks
  -> backend stores result
  -> backend triggers points/certificates/status update
  -> frontend displays permitted feedback
```

### 12.4 Written-answer marking

Written-answer questions require AI-assisted marking and teacher oversight.

The system must store:

- Question.
- Student answer.
- Mark scheme.
- Model answer.
- Accepted keywords.
- Common misconceptions.
- Maximum marks.
- AI-suggested mark.
- AI feedback.
- AI marking rationale.
- AI confidence flag.
- Teacher override mark.
- Teacher feedback.
- Final mark.
- Feedback release status.

### 12.5 AI-assisted marking workflow

Recommended workflow:

```text
Student submits written answer
  -> answer stored in Supabase
  -> Supabase Edge Function receives attempt/question IDs
  -> Edge Function fetches mark scheme securely
  -> Edge Function sends answer + mark scheme + model answer to AI service
  -> AI returns suggested mark and student-friendly feedback
  -> result stored as AI-marked
  -> teacher can review, override, approve, or release
  -> student sees feedback only when permitted
```

### 12.6 AI marking privacy

The AI marking function should not need full student identity data.

Send only what is needed:

- Attempt ID.
- Question text.
- Student answer.
- Mark scheme.
- Model answer.
- Accepted keywords.
- Maximum marks.

Avoid sending:

- Full student name.
- Username.
- Class name.
- Leaderboard rank.
- Certificates.
- Personal notes.

### 12.7 AI feedback tone

AI feedback should be student-friendly.

It should be:

- Clear.
- Specific.
- Encouraging without being childish.
- Linked to the mark scheme.
- Focused on improvement.
- Written in language suitable for the year group.

Example:

```text
You identified that the CPU processes instructions, which is correct. To improve your answer, explain the role of the control unit and mention the fetch-decode-execute cycle.
```

### 12.8 Teacher review

Teachers must be able to:

- View the student answer.
- View the question.
- View the mark scheme.
- View the model answer.
- View AI mark.
- View AI feedback.
- View AI rationale.
- Override the mark.
- Edit feedback.
- Approve feedback.
- Release feedback.
- Return work to pending if needed.

### 12.9 Feedback release settings

Teachers should control feedback release.

Options:

| Setting | Behaviour |
|---|---|
| Immediate score only | Student sees score only. |
| Immediate full review | Student sees answers and explanations immediately. |
| Delayed feedback | Student sees feedback after deadline or teacher release. |
| Teacher review required | Written-answer feedback hidden until teacher approves. |
| Hidden | Student does not see feedback, only completion status. |

### 12.10 Marking reliability rule

AI marking should be treated as assisted marking, not absolute truth.

Teacher override must always be possible.

For assigned assessments, recommended default:

```text
AI marks written answers -> teacher reviews -> feedback released
```

For low-stakes practice:

```text
AI marks written answers -> student receives immediate feedback, if enabled
```

---

## 13. Test Versioning

### 13.1 Reason for versioning

If a test or question is edited after students have completed it, old attempts must still refer to the version the student actually completed.

Without versioning:

- Old scores could become inaccurate.
- Reports could be misleading.
- A student's answer might no longer match the edited question.
- Mark schemes could change after submission.

### 13.2 Versioning rule

Published test versions must be immutable for completed attempts.

Allowed approach:

- Draft version can be edited.
- Published version can be used in attempts.
- If changes are needed after publication, create a new version.
- Old attempts remain linked to old version.

### 13.3 Version display

Teachers should be able to see:

- Test name.
- Version number.
- Published date.
- Number of attempts on that version.
- Whether a new version exists.

Students do not need to see version numbers unless useful.

---

## 14. Anti-Cheating and Assessment Integrity

### 14.1 Realistic principle

The system should deter cheating and make misuse harder, but it must not claim to make cheating impossible.

A normal website cannot fully prevent:

- Operating-system screenshots.
- Browser developer tools.
- Phone photographs.
- External devices.
- Advanced technical workarounds.

The system can block ordinary behaviour, log suspicious events, and make sharing less useful.

### 14.2 Copy prevention

During active tests:

- Disable text selection.
- Disable copy events.
- Disable cut events.
- Disable drag selection where possible.
- Disable right-click context menu.
- Log copy attempts.
- Log cut attempts.
- Log right-click attempts.

### 14.3 Paste prevention

Students must not be able to paste answers into answer boxes during active tests.

Rules:

- Disable paste events in input boxes.
- Disable paste events in textareas.
- Log paste attempts.
- Show warning where appropriate.

Example warning:

```text
Pasting is disabled during this assessment. Please type your own answer.
```

### 14.4 Print prevention

During active tests:

- Block `Ctrl + P`.
- Block `Cmd + P`.
- Handle `beforeprint` where supported.
- Use print CSS to hide all test content.
- Show only a message in print view.
- Log print attempts.

Print output should show:

```text
Printing is disabled for this assessment.
```

### 14.5 Screenshot deterrence

Screenshots cannot be fully blocked in a normal website.

Instead, use:

- Watermarks.
- Student display name.
- Public Student ID.
- Timestamp.
- Randomised question order.
- Shuffled answer options.
- Question pools.
- Timers.
- Suspicious activity logs.

### 14.6 Watermarking

During active tests, show a faint repeated watermark.

Watermark content:

```text
Student display name — Student ID — date/time
```

Example:

```text
M Ahmed — ID 1047 — 07/07/2026 14:32
```

The watermark should:

- Be visible enough to discourage sharing.
- Not make the test unreadable.
- Appear across the assessment area.
- Update timestamp periodically.

### 14.7 Suspicious activity logging

The system should log:

- Copy attempt.
- Paste attempt.
- Cut attempt.
- Right-click attempt.
- Print attempt.
- Tab switch.
- Window blur.
- Page leave.
- Reload.
- Fullscreen exit, if fullscreen is used.
- Multiple failed login attempts.
- Attempt abandonment.

Each event should store:

- Event ID.
- Attempt ID.
- Student ID.
- Event type.
- Timestamp.
- Browser/device metadata where reasonable.
- Optional event detail.

### 14.8 Teacher visibility

Teachers should see suspicious activity at:

- Attempt detail level.
- Student result level.
- Class report level.

Example:

| Student | Test | Score | Time | Suspicious Events |
|---|---|---:|---:|---:|
| M Ahmed — ID 1047 | CPU Assessment | 78% | 14m 22s | 3 |

Clicking the event count should show the log.

---

## 15. Randomisation and Question Pools

### 15.1 Question order randomisation

Teachers should be able to enable random question order for each test.

When enabled:

- Each student may see questions in a different order.
- The stored answers must still map to the correct question IDs.
- Reports must still group performance by question/topic.

### 15.2 Answer option shuffling

Teachers should be able to enable shuffled answer options.

When enabled:

- Multiple-choice options appear in random order.
- Correct answer tracking is based on option ID, not letter.
- The system must store the displayed order for audit/review.

### 15.3 Question pools

The system should support question pools.

Example:

```text
Topic: CPU
Question bank: 50 questions
Practice test: randomly select 20 questions
```

Benefits:

- Reduces answer sharing.
- Makes retakes more useful.
- Supports revision variety.
- Reduces repeated test farming.

Question pool rules:

- Teacher/test creator sets number of questions.
- System selects questions from the topic/unit pool.
- Selection can respect difficulty balance.
- Attempt must store which questions were selected.

---

## 16. Results and Feedback

### 16.1 Student result history

Students should be able to see their own results.

Student result history should show:

- Test title.
- Subject.
- Unit.
- Topic.
- Attempt type.
- Attempt date.
- Score.
- Percentage.
- Time taken.
- Status.
- Feedback status.
- Points earned.

### 16.2 Student result detail

A result detail page should show, where permitted:

- Overall score.
- Time taken.
- Question-by-question review.
- Correct/incorrect status.
- Written-answer feedback.
- Topic strengths.
- Improvement targets.
- Teacher feedback.
- AI-assisted feedback, if released.

### 16.3 Teacher result views

Teachers should be able to view results by:

- Class.
- Student.
- Subject.
- Unit.
- Topic.
- Test.
- Assignment.
- Date range.
- Score range.
- Marking status.
- Suspicious activity.

### 16.4 Class reports

Class reports should show:

- Completion rate.
- Average score.
- Highest score.
- Lowest score.
- Median score.
- Topic strengths.
- Topic weaknesses.
- Questions most often answered incorrectly.
- Students not started.
- Students in progress.
- Students timed out.
- Students needing support.
- Suspicious activity summary.

### 16.5 Student progress reports

Student progress reports should show:

- Tests completed.
- Practice attempts.
- Assigned assessments.
- Best score by topic.
- Most recent score by topic.
- Improvement over time.
- Time taken trends.
- Points earned.
- Certificates earned.
- Current status.
- Leaderboard position.
- Teacher feedback.

### 16.6 Exports

Teachers should be able to export:

- Class results.
- Student results.
- Assignment completion data.
- Written-answer marking data.
- Leaderboard data.
- Certificate records.
- Suspicious activity logs.

Export format:

```text
CSV
```

---

## 17. Student Dashboard and Profile

### 17.1 Student dashboard

The student dashboard should show:

- Welcome message.
- Current class.
- Assigned tests waiting.
- Practice tests available.
- Recent results.
- Points total.
- Current status.
- Certificates earned.
- Class leaderboard position.
- Whole-site leaderboard position, if enabled.
- Recommended next practice.
- Notifications.

### 17.2 Student profile

The student profile should show:

- First name and surname, visible to self.
- Username, visible to self only.
- Public Student ID.
- Leaderboard display name.
- Class.
- Total points.
- Status level.
- Certificates.
- Test history.
- Best scores.
- Recent scores.
- Topic strengths.
- Topic weaknesses.
- Progress over time.
- Next status target.

### 17.3 Leaderboard identity

The student profile should clearly show:

```text
Your leaderboard name: M Ahmed
Your Student ID: 1047
Your leaderboard display: M Ahmed — ID 1047
```

This helps students identify themselves when there are multiple students with the same displayed name.

---

## 18. Leaderboards

### 18.1 Leaderboard types

The system should support:

- Class leaderboard.
- Whole-site leaderboard.
- Weekly leaderboard.
- Monthly leaderboard.
- Termly leaderboard.
- All-time leaderboard.

### 18.2 Leaderboard display rule

Leaderboards must not show usernames.

Leaderboards should display:

```text
First-name initial + surname + public Student ID
```

Example:

```text
J Patel — ID 4826
M Ahmed — ID 1047
S Lee-Yearwood — ID 6031
```

### 18.3 Leaderboard columns

Recommended student-facing leaderboard columns:

| Rank | Student | Class | Points | Status |
|---:|---|---|---:|---|
| 1 | J Patel — ID 4826 | 8A | 2450 | Master |
| 2 | M Ahmed — ID 1047 | 8A | 2120 | Expert |
| 3 | S Lee-Yearwood — ID 6031 | 8B | 1980 | Scholar |

Teacher view may include additional columns:

- Full name.
- Username.
- Class.
- Points.
- Status.
- Certificates.
- Last active.
- Test completion count.
- Average score.
- Suspicious activity count.

### 18.4 Leaderboard visibility settings

Teachers/admins should control:

- Whether leaderboards are visible to students.
- Whether whole-site leaderboards are visible.
- Whether class leaderboards are visible.
- Whether exact rank is visible.
- Whether only nearby rank is visible.
- Whether class names are visible on whole-site leaderboards.
- Which time periods are visible.

### 18.5 Leaderboard fairness

Leaderboards should reward:

- High scores.
- Improvement.
- Completion.
- Consistency.
- Topic mastery.
- Timed performance.

They should not only reward already high-performing students.

---

## 19. Points System

### 19.1 Points principles

Points should motivate learning without encouraging spam behaviour.

Students should earn points for meaningful actions.

### 19.2 Suggested point rules

| Action | Suggested Points |
|---|---:|
| Complete a practice test first attempt | 10 |
| Complete an assigned test | 20 |
| Score 70% or above | 20 |
| Score 85% or above | 40 |
| Score 100% | 75 |
| Improve previous score by 10% or more | 30 |
| Complete all tests in a topic | 100 |
| Complete timed test within time limit | 20 |
| Written answer marked strong | 20 |

### 19.3 Points abuse prevention

Rules:

- Full completion points should apply to first attempt only.
- Repeat practice attempts should only award improvement bonuses.
- Same or lower repeat score should not award extra points.
- Easy tests should not be farmable.
- Assigned tests should award points once only.
- Admin/teacher should be able to adjust point rules.

### 19.4 Points transaction log

Every points award must be stored as a transaction.

Fields:

- Transaction ID.
- Student ID.
- Points awarded.
- Reason.
- Related attempt ID.
- Related certificate ID, if any.
- Created date.

This avoids unexplained totals.

---

## 20. Status Levels

### 20.1 Status purpose

Students should receive status levels based on progress and performance.

Status should be visible in:

- Student profile.
- Leaderboard.
- Teacher panel.

### 20.2 Suggested status levels

| Status | Points Range |
|---|---:|
| Starter | 0-249 |
| Learner | 250-749 |
| Builder | 750-1499 |
| Scholar | 1500-2499 |
| Expert | 2500-3999 |
| Master | 4000+ |

Alternative student-friendly status wording:

| Level | Status |
|---:|---|
| Level 1 | Getting Started |
| Level 2 | Building Knowledge |
| Level 3 | Strong Progress |
| Level 4 | Confident Learner |
| Level 5 | Subject Expert |
| Level 6 | Mastery Level |

### 20.3 Next status indicator

Student profile should show:

- Current status.
- Next status.
- Points needed.
- Suggested actions to progress.

Example:

```text
Current status: Scholar
Next status: Expert
Points needed: 650
Suggested next step: Complete two more Hardware topic tests with 80% or above.
```

---

## 21. Certificates

### 21.1 Certificate purpose

Certificates should recognise performance and accomplishments.

Certificates appear in:

- Student profile.
- Teacher panel.
- Certificate records.

### 21.2 Certificate examples

| Certificate | Awarded For |
|---|---|
| Perfect Score | 100% on a test |
| Topic Mastery | 85% or above across all tests in a topic |
| Strong Improvement | Improve previous score by 20% or more |
| Consistency | Complete several tests with strong performance |
| Speed and Accuracy | High score within time limit |
| Written Response Excellence | Strong written-answer performance |
| Class Top 10 | Finish in top 10 for a leaderboard period |

### 21.3 Certificate fields

Each certificate award should store:

- Certificate award ID.
- Certificate type ID.
- Student ID.
- Title.
- Description.
- Award reason.
- Related subject/unit/topic/test.
- Related attempt ID.
- Date awarded.
- Unique certificate code.

### 21.4 Certificate authenticity

Each certificate should have a unique certificate code.

Example:

```text
CERT-CPU-2026-000184
```

This allows teachers/admins to verify certificates.

### 21.5 Certificate visibility

Students can view their own certificates.

Teachers can view certificates for their students.

Students should not be able to browse private certificate records for other students, except where limited leaderboard/achievement display is enabled.

---

## 22. Teacher Dashboard

### 22.1 Dashboard summary

Teacher dashboard should show:

- Classes.
- Student count.
- Recent test activity.
- Assigned tests in progress.
- Unmarked written answers.
- AI-marked answers awaiting review.
- Recent results.
- Lowest-performing topics.
- Most improved students.
- Students needing support.
- Suspicious activity alerts.
- Recent certificates.
- Leaderboard summary.

### 22.2 Priority panels

Recommended teacher dashboard panels:

1. `Classes needing attention`.
2. `Written answers to review`.
3. `Recent assigned assessment results`.
4. `Students with incomplete assigned tests`.
5. `Topic weaknesses`.
6. `Suspicious activity`.
7. `Recent achievements`.

### 22.3 Search and filters

Teacher should be able to search/filter by:

- Student.
- Class.
- Subject.
- Unit.
- Topic.
- Test.
- Date range.
- Score range.
- Attempt status.
- Marking status.
- Feedback status.
- Suspicious activity.
- Certificate type.
- Status level.

---

## 23. Admin Settings

### 23.1 Global settings

Admin should be able to manage:

- Site name.
- Default test duration.
- Default attempt rules.
- Default feedback policy.
- Leaderboard visibility.
- Whole-site leaderboard enabled/disabled.
- Class leaderboard enabled/disabled.
- Points system enabled/disabled.
- Certificate system enabled/disabled.
- Status levels enabled/disabled.
- Suspicious activity logging enabled/disabled.
- AI marking enabled/disabled.
- AI marking review requirement.
- Student ID display settings.

### 23.2 Points settings

Admin should be able to manage:

- Point rules.
- Point caps.
- Repeat attempt rules.
- Improvement bonus rules.
- Leaderboard period rules.

### 23.3 Certificate settings

Admin should be able to manage:

- Certificate types.
- Award criteria.
- Certificate visibility.
- Certificate wording.
- Certificate code format.

### 23.4 Status settings

Admin should be able to manage:

- Status names.
- Point thresholds.
- Display order.
- Visibility.

---

## 24. Database Design

### 24.1 Guiding principles

The database must support:

- Strict role separation.
- Test versioning.
- Immutable attempt records.
- Historical class membership.
- Written-answer marking workflows.
- Auditability.
- Leaderboard calculation.
- Points transaction history.
- Certificate records.
- Secure public/private display separation.

### 24.2 Recommended tables

Core identity and roles:

```text
profiles
teacher_profiles
student_profiles
admin_profiles
classes
class_memberships
```

Content hierarchy:

```text
subjects
units
topics
tests
test_versions
questions
question_options
question_pools
```

Assignments and attempts:

```text
test_assignments
test_attempts
student_answers
answer_display_orders
attempt_events
```

Marking:

```text
mark_schemes
ai_marking_jobs
ai_marking_results
teacher_mark_reviews
feedback_releases
```

Achievement system:

```text
points_transactions
status_levels
student_status_history
certificate_types
certificate_awards
leaderboard_snapshots
```

Operations:

```text
notifications
imports
audit_logs
site_settings
export_jobs
```

### 24.3 Suggested table details

#### profiles

Purpose: shared profile linked to Supabase Auth user.

Fields:

```text
id uuid primary key
user_id uuid references auth.users(id)
role text check in ('student','teacher','admin')
display_name text
account_status text
created_at timestamptz
updated_at timestamptz
```

#### student_profiles

Fields:

```text
id uuid primary key
profile_id uuid references profiles(id)
first_name text not null
surname text not null
username text unique not null
public_student_id text unique not null
internal_auth_email text unique
account_status text
created_by uuid
created_at timestamptz
updated_at timestamptz
```

#### classes

Fields:

```text
id uuid primary key
class_name text not null
academic_year text
year_group text
owner_teacher_id uuid
status text check in ('active','archived')
join_code text unique nullable
accepting_students boolean
is_system boolean
created_at timestamptz
updated_at timestamptz
```

#### class_memberships

Fields:

```text
id uuid primary key
class_id uuid references classes(id)
student_id uuid references student_profiles(id)
start_date date
end_date date
status text check in ('active','ended')
created_at timestamptz
updated_at timestamptz
```

#### subjects

Fields:

```text
id uuid primary key
subject_name text not null
exam_board text
course_code text
year_group text
description text
status text
display_order integer
created_at timestamptz
updated_at timestamptz
```

#### units

Fields:

```text
id uuid primary key
subject_id uuid references subjects(id)
unit_name text not null
unit_code text
description text
status text
display_order integer
created_at timestamptz
updated_at timestamptz
```

#### topics

Fields:

```text
id uuid primary key
unit_id uuid references units(id)
topic_name text not null
description text
keywords text[]
status text
display_order integer
created_at timestamptz
updated_at timestamptz
```

#### tests

Fields:

```text
id uuid primary key
topic_id uuid references topics(id)
test_title text not null
test_description text
default_mode text check in ('practice','assigned')
default_time_limit_seconds integer
randomise_questions boolean
shuffle_options boolean
question_pool_enabled boolean
status text
created_by uuid
created_at timestamptz
updated_at timestamptz
```

#### test_versions

Fields:

```text
id uuid primary key
test_id uuid references tests(id)
version_number integer
status text check in ('draft','published','archived')
total_marks integer
estimated_duration_seconds integer
published_at timestamptz
published_by uuid
version_notes text
created_at timestamptz
updated_at timestamptz
```

#### questions

Fields:

```text
id uuid primary key
test_version_id uuid references test_versions(id)
question_order integer
question_type text
question_text text not null
max_marks integer
difficulty text
correct_answer jsonb
mark_scheme text
model_answer text
accepted_keywords text[]
common_misconceptions text[]
student_explanation text
teacher_notes text
created_at timestamptz
updated_at timestamptz
```

#### question_options

Fields:

```text
id uuid primary key
question_id uuid references questions(id)
option_text text not null
is_correct boolean
option_order integer
feedback text
created_at timestamptz
updated_at timestamptz
```

#### test_assignments

Fields:

```text
id uuid primary key
test_version_id uuid references test_versions(id)
assigned_by uuid
class_id uuid references classes(id)
start_at timestamptz
due_at timestamptz
time_limit_seconds integer
attempt_limit integer default 1
feedback_policy text
status text
created_at timestamptz
updated_at timestamptz
```

#### test_attempts

Fields:

```text
id uuid primary key
student_id uuid references student_profiles(id)
class_id_at_attempt uuid references classes(id)
test_id uuid references tests(id)
test_version_id uuid references test_versions(id)
assignment_id uuid references test_assignments(id)
attempt_type text check in ('practice','assigned')
attempt_number integer
status text
started_at timestamptz
submitted_at timestamptz
duration_seconds integer
time_limit_seconds integer
score numeric
max_score numeric
percentage numeric
marking_status text
feedback_status text
suspicious_event_count integer default 0
created_at timestamptz
updated_at timestamptz
```

#### student_answers

Fields:

```text
id uuid primary key
attempt_id uuid references test_attempts(id)
question_id uuid references questions(id)
answer jsonb
answer_text text
is_correct boolean
marks_awarded numeric
max_marks numeric
marked_by text
feedback text
created_at timestamptz
updated_at timestamptz
```

#### attempt_events

Fields:

```text
id uuid primary key
attempt_id uuid references test_attempts(id)
student_id uuid references student_profiles(id)
event_type text
event_detail jsonb
created_at timestamptz
```

#### ai_marking_jobs

Fields:

```text
id uuid primary key
attempt_id uuid references test_attempts(id)
student_answer_id uuid references student_answers(id)
status text
requested_at timestamptz
completed_at timestamptz
error_message text
```

#### ai_marking_results

Fields:

```text
id uuid primary key
job_id uuid references ai_marking_jobs(id)
student_answer_id uuid references student_answers(id)
ai_mark numeric
max_marks numeric
ai_feedback text
ai_rationale text
confidence text
raw_result jsonb
created_at timestamptz
```

#### teacher_mark_reviews

Fields:

```text
id uuid primary key
student_answer_id uuid references student_answers(id)
teacher_id uuid references profiles(id)
ai_mark numeric
teacher_final_mark numeric
teacher_feedback text
review_status text
reviewed_at timestamptz
created_at timestamptz
updated_at timestamptz
```

#### points_transactions

Fields:

```text
id uuid primary key
student_id uuid references student_profiles(id)
points integer
reason text
related_attempt_id uuid
related_certificate_award_id uuid
created_at timestamptz
```

#### certificate_types

Fields:

```text
id uuid primary key
title text
description text
criteria jsonb
active boolean
created_at timestamptz
updated_at timestamptz
```

#### certificate_awards

Fields:

```text
id uuid primary key
certificate_type_id uuid references certificate_types(id)
student_id uuid references student_profiles(id)
certificate_code text unique
title text
description text
award_reason text
related_subject_id uuid
related_unit_id uuid
related_topic_id uuid
related_test_id uuid
related_attempt_id uuid
awarded_at timestamptz
```

#### audit_logs

Fields:

```text
id uuid primary key
actor_profile_id uuid references profiles(id)
action text
target_type text
target_id uuid
detail jsonb
created_at timestamptz
```

---

## 25. Row Level Security and Permissions

### 25.1 RLS principle

Every table in an exposed schema must have Row Level Security enabled.

The frontend will use a public/publishable Supabase key. This key is not a secret. Security must come from:

- Authenticated user identity.
- RLS policies.
- Role checks.
- Server-side Edge Functions for privileged actions.

### 25.2 Student RLS rules

Students can read:

- Their own profile.
- Their own student profile.
- Their own class membership, limited fields.
- Published subjects/units/topics/tests available to them.
- Their own attempts.
- Their own answers where permitted.
- Their own certificates.
- Their own points.
- Leaderboard rows that are configured as public to students.

Students can insert/update:

- Their own test attempts through controlled functions.
- Their own answers during active attempts.
- Their own attempt events.

Students cannot read:

- Other students' private profiles.
- Other students' usernames.
- Other students' full result history.
- Hidden correct answers.
- Hidden mark schemes.
- Teacher notes.
- AI prompts.
- Admin settings not meant for students.

### 25.3 Teacher RLS rules

Teachers can read/manage:

- Their own profile.
- Classes they own/are assigned to.
- Students in their classes.
- Attempts by students in their classes.
- Answers by students in their classes.
- Written-answer marking queue for their students.
- Reports for their classes.
- Leaderboards relevant to their classes.

Teachers cannot:

- Access unrelated classes unless admin.
- Access service-role functions directly from frontend.
- Alter protected audit logs.

### 25.4 Admin RLS rules

Admins can manage all application data through admin screens and privileged functions.

Admin access must be protected and audited.

### 25.5 Privileged operations

These must happen through Edge Functions or secure database functions:

- Create student auth account.
- Bulk create students.
- Reset student password.
- Generate unique username.
- Generate unique Student ID.
- Archive class and move affected students to `Non-class`.
- Join class by code.
- Regenerate class join code.
- Finalise test attempt.
- Mark answers.
- Call AI marking service.
- Award points.
- Award certificates.
- Recalculate status.
- Produce protected exports.

---

## 26. Supabase Edge Functions

### 26.1 Required Edge Functions

Recommended functions:

```text
create-student-account
bulk-import-students
reset-student-password
suggest-usernames
update-student-account
archive-class
join-class-by-code
regenerate-class-code
start-test-attempt
save-answer
submit-test-attempt
mark-self-marking-attempt
mark-written-answer-ai
review-written-answer
release-feedback
award-points-and-certificates
recalculate-leaderboards
export-results-csv
```

### 26.2 create-student-account

Responsibilities:

- Verify requester is teacher/admin.
- Validate class permission.
- Generate/sanitise username.
- Check username uniqueness.
- Generate public Student ID.
- Create Supabase Auth user securely.
- Create profile records.
- Create class membership.
- Create audit log.
- Return generated login details to teacher.

### 26.3 suggest-usernames

Responsibilities:

- Accept first name/surname or proposed username.
- Sanitise username.
- Check collisions.
- Return available suggestions.
- Never expose other students' private data.

### 26.4 submit-test-attempt

Responsibilities:

- Verify attempt belongs to current student.
- Verify attempt is active.
- Enforce assigned one-attempt rule.
- Enforce timer rules.
- Save final answers.
- Mark self-marking questions.
- Queue written-answer AI marking.
- Update attempt status.
- Trigger points/certificates where appropriate.
- Create audit/activity records.

### 26.5 mark-written-answer-ai

Responsibilities:

- Fetch question, answer, mark scheme, model answer, and accepted keywords.
- Remove unnecessary student identity data.
- Call AI marking service with secure API key.
- Store AI mark and feedback.
- Flag low-confidence responses.
- Mark answer as pending teacher review where required.

### 26.6 export-results-csv

Responsibilities:

- Verify teacher/admin permission.
- Generate CSV for allowed class/data only.
- Avoid exposing data outside teacher's permission.
- Log export in audit log.

---

## 27. Imports and Codex Content Workflow

### 27.1 Codex-generated content

Codex will create:

- Subject/unit/topic seed data.
- Test definitions.
- Questions.
- Answer options.
- Correct answers.
- Written-answer mark schemes.
- Model answers.
- Accepted keywords.
- Common misconceptions.
- Student-friendly explanations.
- Teacher notes.
- Import files.

### 27.2 Content import formats

The system should support structured import using:

- JSON for complex tests.
- CSV for simple question sets.

### 27.3 Recommended JSON structure

Example:

```json
{
  "subject": "OCR GCSE Computer Science",
  "unit": "Hardware",
  "topic": "CPU",
  "test": {
    "title": "CPU Knowledge Test 1",
    "description": "Checks knowledge of CPU components and the fetch-decode-execute cycle.",
    "default_mode": "practice",
    "time_limit_seconds": 900,
    "randomise_questions": true,
    "shuffle_options": true,
    "questions": [
      {
        "type": "multiple_choice",
        "text": "Which CPU component manages the execution of instructions?",
        "max_marks": 1,
        "options": [
          { "text": "Control Unit", "is_correct": true },
          { "text": "Hard Disk", "is_correct": false },
          { "text": "RAM", "is_correct": false },
          { "text": "Monitor", "is_correct": false }
        ],
        "explanation": "The Control Unit coordinates the fetching, decoding and execution of instructions."
      }
    ]
  }
}
```

### 27.4 Content validation

Importer must validate:

- Subject exists or can be created.
- Unit belongs to subject.
- Topic belongs to unit.
- Test title exists or can be created.
- Question type is supported.
- Correct answers exist for self-marking questions.
- Mark schemes exist for written-answer questions.
- Maximum marks are valid.
- JSON/CSV structure is valid.

---

## 28. Notifications

### 28.1 Student notifications

Students should receive in-app notifications for:

- New assigned test.
- Test deadline approaching.
- Result released.
- Written-answer feedback released.
- Certificate awarded.
- Status upgraded.
- Leaderboard milestone.

### 28.2 Teacher notifications

Teachers should receive in-app notifications for:

- Written answers awaiting review.
- AI marking failures.
- Suspicious activity alerts.
- Assignment completion summary.
- Import completion.
- Export completion.

MVP can include simple notification rows in the dashboard without email.

---

## 29. Audit Log

### 29.1 Audit purpose

Audit logs protect the integrity of the platform.

### 29.2 Events to audit

Audit log should record:

- Teacher created student.
- Teacher edited student.
- Teacher reset password.
- Teacher moved student class.
- Teacher deactivated/reactivated account.
- Class created.
- Class edited.
- Class archived.
- Test created.
- Test edited.
- Test published.
- Test assigned.
- Mark changed.
- AI mark overridden.
- Feedback released.
- Certificate awarded.
- Points adjusted.
- CSV export created.
- Bulk import completed.
- Admin setting changed.

### 29.3 Audit log protection

Audit logs should be append-only from normal UI.

Teachers/admins should not be able to edit audit records from the frontend.

---

## 30. Privacy and Data Protection

### 30.1 Minimum data

Only collect the data needed for the platform to function.

Student data should be limited to:

- First name.
- Surname.
- Username.
- Public Student ID.
- Class membership.
- Test attempts.
- Answers.
- Results.
- Points.
- Certificates.
- Status.
- Activity logs.

### 30.2 Private vs public data

| Data | Student Sees Own? | Other Students See? | Teacher Sees? |
|---|---:|---:|---:|
| Username | Yes | No | Yes |
| Full name | Yes | No by default | Yes |
| First initial + surname | Yes | Yes on leaderboard | Yes |
| Public Student ID | Yes | Yes on leaderboard | Yes |
| Class | Yes | Optional | Yes |
| Test history | Yes, own only | No | Yes for teacher's classes |
| Points/status | Yes | Yes where leaderboard enabled | Yes |
| Certificates | Yes | Limited if enabled | Yes |
| Written answers | Yes, own only | No | Yes for teacher's classes |

### 30.3 Data retention

Rules to define before live deployment:

- How long to keep student records.
- How long to keep inactive accounts.
- How long to keep attempt logs.
- How long to keep suspicious activity logs.
- Who can export data.
- Who can delete/archive data.

Recommended approach:

- Archive old classes.
- Deactivate old students.
- Preserve results where required for school records.
- Avoid hard deletion unless approved by admin.

### 30.4 AI privacy

AI marking should avoid sending unnecessary personal data.

Do not send full student names, usernames, or class data to AI marking if not needed.

---

## 31. Accessibility and Usability

### 31.1 Accessibility principle

The app should remain usable despite anti-cheating restrictions.

Anti-copy features must not make the test unreadable or impossible to complete.

### 31.2 Design requirements

- Large readable text on mobile.
- Clear buttons.
- Touch-friendly controls.
- Strong contrast.
- Clear timer.
- Clear progress indicator.
- Clear error messages.
- Avoid crowded screens.
- Use simple navigation.
- Provide loading states.
- Provide empty states.
- Provide error states.

### 31.3 Empty states

Examples:

| Page | Empty State |
|---|---|
| Class page | No students have been added yet. |
| Results page | No test attempts yet. |
| Certificates page | No certificates earned yet. |
| Marking queue | No written answers waiting for marking. |
| Leaderboard | No leaderboard data available yet. |

---

## 32. Reports

### 32.1 Teacher reports

Reports should include:

- Class performance report.
- Student progress report.
- Test completion report.
- Topic weakness report.
- Assignment report.
- Written-answer marking report.
- Suspicious activity report.
- Certificate report.
- Leaderboard report.

### 32.2 Report filters

Filters:

- Class.
- Student.
- Subject.
- Unit.
- Topic.
- Test.
- Assignment.
- Date range.
- Attempt type.
- Attempt status.
- Score range.
- Marking status.
- Certificate type.

### 32.3 Export fields

CSV exports should include relevant columns such as:

```text
student_display_name
student_id
class
subject
unit
topic
test
test_version
attempt_type
attempt_number
status
started_at
submitted_at
duration_seconds
score
max_score
percentage
points_awarded
feedback_status
suspicious_event_count
```

Teacher-only exports may include username. Student-facing exports must not.

---

## 33. MVP Scope and Phases

### 33.1 MVP Version 1

Build first:

1. React/Vite/TypeScript/Tailwind setup.
2. GitHub Pages deployment.
3. Supabase project setup.
4. Database schema migrations.
5. Supabase Auth integration.
6. RLS policies for student/teacher/admin basics.
7. Teacher login.
8. Student login using username/password UI.
9. Teacher creates class.
10. Teacher adds/edits students.
11. Generated username.
12. Public Student ID.
13. Student password reset by teacher.
14. Student dashboard.
15. Teacher dashboard.
16. Subject -> Unit -> Topic content structure.
17. Basic question bank.
18. Multiple-choice self-marking tests.
19. Practice test access.
20. Assigned test access with one-attempt rule.
21. Timed test attempts.
22. Attempt recording.
23. Student result history.
24. Teacher result view.
25. Basic anti-copy/paste/print deterrents.
26. Suspicious activity log.
27. Basic leaderboard.
28. Basic points/status system.

### 33.2 Version 2

Add next:

1. Written-answer questions.
2. AI-assisted written-answer marking Edge Function.
3. Teacher marking queue.
4. Teacher review/override.
5. Feedback release controls.
6. Certificates.
7. Question randomisation.
8. Answer shuffling.
9. Question pools.
10. Bulk student CSV import.
11. Test content JSON/CSV import.
12. CSV results export.
13. Class reports.
14. Topic weakness analysis.
15. Watermark improvements.

### 33.3 Version 3

Add later:

1. Advanced admin panel.
2. Advanced leaderboard settings.
3. Weekly/monthly/termly leaderboard periods.
4. Certificate verification.
5. Full progress analytics.
6. Whole-site reports.
7. In-app notifications.
8. Archive old classes.
9. Full audit log viewer.
10. Advanced accessibility refinements.
11. Advanced import/export centre.
12. Advanced AI marking calibration tools.

---

## 34. Suggested Repository Structure

```text
student-knowledge-testing-platform/
  README.md
  PROJECT_BRIEF.md
  package.json
  vite.config.ts
  index.html
  .env.example
  .gitignore
  src/
    app/
    components/
    features/
      auth/
      student/
      teacher/
      admin/
      classes/
      students/
      content/
      tests/
      attempts/
      marking/
      leaderboards/
      certificates/
      reports/
      settings/
    lib/
      supabaseClient.ts
      auth.ts
      routes.ts
      permissions.ts
    styles/
    types/
  supabase/
    migrations/
    functions/
      create-student-account/
      bulk-import-students/
      suggest-usernames/
      reset-student-password/
      start-test-attempt/
      submit-test-attempt/
      mark-written-answer-ai/
      release-feedback/
      export-results-csv/
    seed/
      subjects.json
      sample-tests.json
  docs/
    DATA_MODEL.md
    RLS_POLICIES.md
    TEST_CONTENT_FORMAT.md
    DEPLOYMENT.md
    AI_MARKING.md
    SECURITY.md
```

---

## 35. Environment Variables

### 35.1 Frontend `.env.example`

Only public values should be present.

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_APP_NAME=Student Knowledge Testing Platform
```

Never include:

```text
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
AI_PROVIDER_API_KEY
```

### 35.2 Supabase Edge Function secrets

Store private values in Supabase secrets:

```text
SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER_API_KEY
AI_MARKING_MODEL
```

---

## 36. Acceptance Criteria

### 36.1 Account acceptance criteria

- Teacher can create a class.
- Teacher can add a student to a class.
- System generates username correctly.
- System generates public Student ID separately from username.
- Teacher can edit student details.
- Existing username does not auto-change after name edit.
- Teacher can regenerate username if needed.
- Teacher can reset password.
- Student cannot self-register.
- Student cannot edit restricted details.

### 36.2 Content acceptance criteria

- Content is grouped by Subject -> Unit -> Topic.
- Tests belong to topics.
- Test versions are created.
- Questions belong to test versions.
- Existing attempts remain linked to original test version.

### 36.3 Test acceptance criteria

- Student can complete practice tests repeatedly.
- Student can complete assigned assessment once only.
- Backend blocks second assigned attempt.
- Timer displays correctly.
- Backend records actual duration.
- Timeout auto-submits current answers.
- Attempts store status correctly.

### 36.4 Marking acceptance criteria

- Multiple-choice tests self-mark correctly.
- Correct answers are not exposed in frontend.
- Written answers can be submitted.
- AI marking can suggest marks and feedback.
- Teacher can review and override AI marks.
- Feedback release rules work.

### 36.5 Anti-cheating acceptance criteria

- Copy is blocked/logged during active tests.
- Paste is blocked/logged during active tests.
- Right-click is blocked/logged during active tests.
- Print shortcut is blocked/logged during active tests.
- Print CSS hides test content.
- Watermark appears during active tests.
- Tab switching/page leaving is logged.

### 36.6 Leaderboard acceptance criteria

- Leaderboard does not show usernames.
- Leaderboard shows first initial + surname + Student ID.
- Duplicate names are distinguishable by Student ID.
- Student can see own leaderboard position.
- Teacher can view class leaderboard details.
- Points update after valid attempts.
- Status updates after points thresholds.

### 36.7 Security acceptance criteria

- RLS enabled on exposed tables.
- Students cannot read other students' private data.
- Teachers cannot read unrelated classes unless admin.
- Service-role key is not in frontend.
- AI API key is not in frontend.
- Admin-only actions are protected.
- Audit logs are created for key actions.

---

## 37. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Correct answers exposed in frontend | High | Mark server-side only. |
| Service key exposed | Critical | Store only in Supabase secrets. |
| RLS misconfigured | Critical | Write tests for student/teacher/admin access. |
| Students reconstruct usernames from leaderboard | Medium | Use separate Student ID, never username suffix. |
| Screenshot cheating | Medium | Watermarks, randomisation, logs; do not claim impossible prevention. |
| Points farming | Medium | Cap repeat points and reward improvement only. |
| AI marking inaccurate | Medium | Teacher review/override, confidence flags. |
| Too many features for first build | High | Follow MVP phases. |
| GitHub Pages used for backend logic | High | Keep backend logic in Supabase Edge Functions. |
| Bulk import creates wrong accounts | Medium | Use preview, validation, and confirmation step. |
| Accessibility harmed by anti-copy rules | Medium | Test on mobile/tablet and avoid blocking essential navigation. |

---

## 38. Open Decisions Before Build

These can be decided during implementation if necessary:

1. Final project name.
2. Whether students can change their own passwords.
3. Whether teachers can manually create tests in UI or only import Codex-generated content at first.
4. Whether whole-site leaderboard is enabled by default.
5. Whether class names show on whole-site leaderboard.
6. Whether certificates can be downloaded as PDF/image.
7. Which AI provider/model will be used for written-answer marking.
8. Whether AI feedback is immediately released for practice written-answer tests.
9. Whether assigned tests require fullscreen mode.
10. Whether Student ID uses four digits or five digits at launch.

Recommended MVP defaults:

- Students cannot change passwords.
- Codex/import creates content first; teacher UI content editing can come later.
- Whole-site leaderboard disabled by default.
- Class leaderboard enabled by default.
- Certificates visible in profile but not downloadable in MVP.
- AI feedback held for teacher review on assigned tests.
- Student ID uses four digits for MVP, but code should allow expansion.

---

## 39. Codex Build Instructions

### 39.1 Build approach

Codex should build incrementally.

Do not try to build every feature at once.

Recommended sequence:

1. Create project scaffold.
2. Configure frontend routing and layout.
3. Configure Supabase client.
4. Create database migrations.
5. Add RLS policies.
6. Add roles and profiles.
7. Build auth screens.
8. Build teacher class/student management.
9. Build student login/profile.
10. Build Subject -> Unit -> Topic browser.
11. Build question bank seed/import.
12. Build practice test attempt flow.
13. Build assigned test flow.
14. Build server-side marking.
15. Build results views.
16. Build anti-cheating logs.
17. Build points/status.
18. Build leaderboard.
19. Add written-answer AI marking.
20. Add certificates and reports.

### 39.2 Non-negotiable implementation rules

Codex must not:

- Put service-role keys in frontend.
- Put AI API keys in frontend.
- Put hidden correct answers in frontend for active tests.
- Put mark schemes in student-accessible responses.
- Allow students to self-register.
- Show usernames on student-facing leaderboards.
- Use username suffix as Student ID.
- Trust client-side-only attempt limits.
- Trust client-side-only timers.
- Mark assigned attempts client-side.
- Allow RLS-free exposed tables.

### 39.3 Required documentation files

Codex should maintain:

- `README.md`.
- `PROJECT_BRIEF.md`.
- `docs/PROJECT_TASKS.md`.
- `docs/SUPABASE_SETUP.md`.
- `docs/DATA_MODEL.md`.
- `docs/RLS_POLICIES.md`.
- `docs/TEST_CONTENT_FORMAT.md`.
- `docs/DEPLOYMENT.md`.
- `docs/AI_MARKING.md`.
- `docs/SECURITY.md`.
- `.env.example`.

### 39.4 Testing requirements

Codex should add tests/checks for:

- Username generation.
- Username collision suggestions.
- Student ID generation.
- Assigned one-attempt enforcement.
- Practice repeat attempts.
- Timer finalisation.
- Self-marking accuracy.
- RLS access boundaries.
- Leaderboard display privacy.
- Points award rules.
- Certificate award rules.
- Anti-cheating event logging.

---

## 40. Official Reference Notes

These references informed the technology constraints in this document:

1. GitHub Pages is static hosting for HTML, CSS and JavaScript files: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
2. GitHub Pages publishing sources and GitHub Actions deployment: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
3. Supabase Auth: https://supabase.com/docs/guides/auth
4. Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
5. Supabase secure frontend access guidance: https://supabase.com/docs/guides/database/secure-data
6. Supabase Edge Functions: https://supabase.com/docs/guides/functions
7. Supabase admin user creation should only be called on a server and service-role keys must not be exposed in the browser: https://supabase.com/docs/reference/javascript/auth-admin-createuser
8. OpenAI Codex is a coding agent for software development: https://developers.openai.com/codex

---

## 41. Final Build Summary

Build a mobile-first student knowledge testing app using GitHub Pages for the frontend and Supabase for the backend. The app must support teacher-created student accounts, class management, Subject -> Unit -> Topic content organisation, practice tests, assigned one-attempt assessments, timed attempts, self-marking questions, AI-assisted written-answer marking, teacher review, student profiles, result history, leaderboards, points, certificates, status levels, anti-cheating deterrents, suspicious activity logs, reports, CSV exports, audit logs, and strict privacy boundaries.

The core security rule is:

```text
GitHub Pages = interface only.
Supabase = authentication, database, permissions, marking, AI calls, account creation, activity logs, leaderboards, certificates, and all sensitive logic.
```

The core content rule is:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

The core student identity rule is:

```text
Username = private login identifier.
Student ID = separate public identifier for leaderboard distinction.
Leaderboard display = first-name initial + surname + public Student ID.
```

The core assessment rule is:

```text
Practice tests = unlimited attempts.
Assigned assessments = one attempt only.
Every attempt is recorded.
```
