# Outstanding Blocked Tests

Last updated: 2026-07-30

Status: outstanding work that must be addressed.

Source of truth: `docs/planning/csrevision-full-test-plan-checklist.html`

The staged test plan currently contains 22 blocked tests:

- P0: 6
- P1: 13
- P2: 3

Do not mark an item fixed merely because code or a fixture was added. Rerun the original test, record observable evidence in the test-plan artifact, and change its status to `Pass`.

## Release-Critical P0 Items

### Test 113 — Historical test-version integrity

- Blocker: teacher-facing drafting and test-version publishing are not implemented.
- Required work: implement immutable published versions and a teacher authoring/publishing workflow.
- Completion evidence: publish a changed version after completed attempts exist and prove historical attempts retain their original `test_version_id` and scores.

### Test 141 — Admin sign-in

- Blocker: no seeded admin Auth user or admin profile exists.
- Required work: add a deterministic local admin fixture and a supported admin sign-in path.
- Completion evidence: sign in as the admin and verify the application recognises the admin role.

### Test 142 — Admin cross-teacher visibility

- Blocker: there is no admin account and all seeded classes have one teacher owner.
- Required work: add a second teacher with owned classes/students plus an admin fixture, then implement/confirm the intended admin access rules.
- Completion evidence: admin can access permitted cross-teacher data while an ordinary teacher remains restricted.

### Test 150 — Admin browser security inspection

- Blocker: no admin browser session can be created.
- Required work: complete the admin fixture and sign-in path.
- Completion evidence: inspect the authenticated admin DOM, requests, and production bundle and confirm no service-role key, private credentials, or privileged marking data are exposed.
- Existing partial evidence: independent source and production-bundle secret scans pass.

### Test 160 — Cross-teacher student move rejection

- Blocker: the persistent fixture has only one teacher owner.
- Required work: add a safe second-teacher fixture with an inaccessible class/student.
- Completion evidence: call `update-student-account` using the first teacher's token and the other teacher's class; verify rejection and no unauthorised membership/audit success.
- Existing partial evidence: direct database policy coverage rejects cross-owner moves.

### Test 184 — Missing frontend environment configuration

- Blocker: Windows background-process environment handling prevented a reliable isolated missing-config server.
- Required work: add a deterministic test harness that starts a copied or purpose-built production build with frontend Supabase variables explicitly absent.
- Completion evidence: sign-in is blocked with actionable Local Supabase configuration guidance and no demo fallback.

## Marking And Authoring

### Test 110 — AI-reviewed marking

- Blocker: all seeded tests are `auto_marked`.
- Required work: add a safe AI-reviewed fixture and implement/confirm its intended workflow.
- Completion evidence: UI labels the method honestly and browser traffic contains no direct AI-provider call or private AI credential.

### Test 111 — Teacher-marked submission

- Blocker: no teacher-marked fixture exists.
- Required work: add a teacher-marked test and its marking workflow.
- Completion evidence: submission remains awaiting teacher marking, displays a clear status, and does not invent an automatic score.

### Test 112 — Self-marked submission

- Blocker: no self-marked fixture exists.
- Required work: add a self-marked fixture and define its points/results policy.
- Completion evidence: complete the self-marking flow and verify the configured score, feedback, points, and results behaviour.

## Teacher Results And Notifications

### Test 124 — Sort Results by a student's score

- Blocker: Teacher Results has no student-score sort control.
- Required work: add an accessible score-sort control while preserving unit-summary grouping.
- Completion evidence: sorting changes detailed rows correctly, keeps summaries associated with their unit, and exposes the current sort state.

### Test 134 — Notifications

- Blocker: no notification control, route, or empty state exists.
- Required work: either implement real notifications with a clear empty state or formally remove the conditional feature from the agreed scope and test plan.
- Completion evidence: the control shows only persisted notifications or an honest empty state, with no dead placeholder content.

## Remaining Admin Workflows

The following tests depend on the admin and multi-teacher fixtures required by Tests 141 and 142.

### Test 144 — Admin creates or edits a teacher-owned class

- Required work: implement the intended admin class workflow and audit attribution.
- Completion evidence: class changes persist with the correct teacher owner and admin actor in the audit trail.

### Test 145 — Admin archives a class

- Required work: expose authorised admin class archival.
- Completion evidence: archival follows the teacher archive rules and records the admin actor.

### Test 146 — Admin resets a student password

- Required work: expose authorised admin student management.
- Completion evidence: password reset succeeds server-side and records the admin actor without exposing the password in logs.

### Test 147 — Admin reviews suspicious activity across classes

- Required work: add the intended cross-class admin activity view with appropriate privacy controls.
- Completion evidence: admin sees permitted activity without private-answer leakage.

### Test 148 — Admin inspects or exports cross-class results

- Required work: add the intended admin results workflow.
- Completion evidence: reports respect historical `class_id_at_attempt` ownership and current-roster rules.

### Test 149 — Honest unavailable admin state

- Blocker: the generic staff shell accepts the admin role type but exposes no admin-only route or explicit unavailable state.
- Required work: implement the admin surface or show an explicit, accessible not-yet-available state until it exists.
- Completion evidence: users are not presented with a misleading teacher shell that appears to provide admin functionality.

### Test 176 — Cross-teacher password-reset rejection

- Required work: use the safe second-teacher fixture to exercise the endpoint boundary.
- Completion evidence: `reset-student-password` rejects the inaccessible student and creates no false-success audit record.
- Existing partial evidence: shared permission-helper and database-policy checks reject cross-owner access.

## Test-Harness Limitations

### Test 94 — Student summary PDF

- Blocker: the in-app browser triggered the download but did not expose the downloaded file.
- Required work: add an automated PDF capture/inspection path or run the test in a browser harness that exposes downloads.
- Completion evidence: inspect the generated PDF and confirm readable student name, score, question review, and feedback.

### Test 126 — Teacher performance PDF

- Blocker: the browser did not expose the downloaded file.
- Required work: use the same download-capable PDF harness as Test 94.
- Completion evidence: compare the PDF with the visible performance report and verify matching student, course, scores, units, points, and layout.

### Test 189 — Out-of-date schema recovery guidance

- Blocker: no safe stale-schema database fixture exists.
- Required work: create a disposable isolated Supabase/Postgres environment pinned before a required migration.
- Completion evidence: start the app against that database and confirm the error identifies a migration/schema problem and points to the documented `migration up` recovery.

### Test 197 — 200% browser zoom

- Blocker: responsive viewport emulation does not reproduce browser zoom.
- Required work: use a browser harness with a real zoom control or a supported accessibility test environment.
- Completion evidence: inspect Teacher Results and Student Practice at genuine 200% zoom and confirm readable content, operable controls, and no overlap.

## Recommended Resolution Order

1. Add deterministic admin, second-teacher, other-teacher class, and student fixtures.
2. Implement the agreed admin surface and rerun Tests 141–150, 160, and 176.
3. Implement versioned authoring and non-auto marking workflows; rerun Tests 110–113.
4. Decide and implement Results sorting and notifications; rerun Tests 124 and 134.
5. Add isolated missing-config and stale-schema harnesses; rerun Tests 184 and 189.
6. Add download-capable PDF inspection and genuine browser-zoom testing; rerun Tests 94, 126, and 197.

## Completion Gate

This document is complete only when:

- all 22 corresponding checklist entries are `Pass`, or an explicitly approved scope change removes a test from the plan;
- the full automated release gates still pass;
- temporary fixtures and test artifacts are cleaned up;
- `docs/HANDOVER.md`, `docs/PROJECT_TASKS.md`, and the test-plan evidence are updated.
