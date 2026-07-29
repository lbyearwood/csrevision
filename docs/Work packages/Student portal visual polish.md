# Student portal visual polish

This is the live tracker for the student-facing visual work. It records requested changes without changing the platform’s learning data, features, routes, or core widget placement.

## Guiding decisions

- Keep the mobile presentation as the current baseline; focus visual changes on laptop and wider screens unless a responsive issue is found.
- Use real Supabase-backed learning data. Do not introduce placeholder content or front-end-only statistics.
- Make the experience feel younger and more encouraging through clearer type hierarchy, colourful graphic moments, focused icon and emoji accents, and readable actions.
- Check each visual change in the signed-in browser before marking it complete.

## Home

- [x] Increase the desktop prominence of the Next Assignment coding illustration without changing mobile behaviour.
- [ ] Review other desktop Home illustrations and ensure they occupy intentional space rather than appearing as small corner decorations.
- [ ] Review card surfaces on wide screens: prefer clear colour blocks and graphic anchors over faint borders and subtle shadows.

## Assigned

- [x] Increase desktop page, assignment-title, supporting-text, and primary-action scale.
- [x] Make the teacher-set assessment cue more engaging and visible on laptop screens.
- [x] Verify the updated desktop Assigned page in the signed-in browser.

## Leaderboard

- [x] Add podium recognition for first, second, and third place.
- [ ] Visually verify and refine the larger desktop student names, points, rank tiles, and row spacing.

## Results

- [ ] Review the colour treatment of unit titles such as Programming and Hardware; keep it only if it improves scanning.
- [ ] Replace the yellow topic-table header treatment with a clearer, more balanced visual style. The current all-yellow headers do not work.
- [ ] Replace thin outlined, shadow-led course-performance panels with a more playful, higher-contrast desktop presentation while preserving the same results data.

## Cross-page review

- [ ] Review tablet breakpoints after the desktop pass; mobile currently looks good and should not be unnecessarily changed.
- [ ] Continue checking that key titles, student names, and primary actions remain comfortably readable on laptop screens.

## Teacher portal — Students

- [x] Replace the default editable first-student view with a table-first student directory.
- [x] Add an explicit Edit action for each student and open the edit form in a modal dialog.
- [x] Keep the class membership list collapsed in the dialog, showing the number of selected classes until expanded.
- [x] Add a separate activity action for each student. It opens a scrollable, read-only dialog showing stored student page visits and local timestamps from Supabase.
- [x] Fix the Students Edit dialog flicker caused by the selected-student reset closing the dialog immediately after it opens.

## Teacher portal — Courses

- [x] Add a read-only test preview from each test resource. Teachers can flick through questions and answer choices without timing, attempts, or saved results.
- [x] Redesign the course Units view as colourful full-width rows with clear unit numbering, topic and test counts, and an obvious next action.
- [x] Redesign the course Topics view as a one-column sequence with the syllabus topic title, test count, and a clear Preview action; remove redundant generic topic numbering.
- [ ] Add a teacher-facing test-version workflow: edit draft versions, create a new version for any post-release question changes, and publish that version for new assignments while historical assignments, attempts, answers, and results remain tied to the original version.

## Teacher portal — Assignments

- [x] Redesign Create Assignment as a compact three-level collapsed selector: Units, then topics, then individual tests. Keep the per-topic selected count, Select all/Clear topic control, individual test checkboxes, and assignment creation behaviour.

## Reliability

- [x] Remove the brief refresh/sign-in flash of an underlying enrolment-blocked screen. Expired join links are no longer replayed during normal sign-in.

## Teacher portal — Students and leaderboards

- [x] Store each student’s starting year group and joined date, then calculate their current UK year group from the September academic-year rollover.
- [x] Show the calculated year and joined date in the Students directory, and allow teachers to correct the starting year using a Year 7–13 selector.
- [x] Add Class, calculated Year Group, and All time leaderboard filters using Supabase-backed student and leaderboard data.
