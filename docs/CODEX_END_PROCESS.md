# Codex End Process

Last updated: 2026-07-26

Audience: every Codex agent finishing work on this repository. The user does not plan to read this. Follow this before ending a session after any project/code/doc changes, unless the user explicitly asks not to commit or push.

## Required End Sequence

### 1. Inspect Worktree And Scope

Check the branch and changed files:

```powershell
git status -sb
git diff --stat
```

If the worktree contains changes unrelated to the current task:

- Do not stage unrelated files.
- Do not revert user/local changes.
- Ask the user only if unrelated changes make the requested commit/push ambiguous.

### 2. Run Relevant Verification

For frontend or shared TypeScript changes, run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

For docs-only changes, at minimum run:

```powershell
git diff --check
```

For Supabase/backend changes, also run the relevant local checks from `docs/SUPABASE_SETUP.md`. Examples:

```powershell
npx.cmd supabase status
docker exec supabase_db_csrevision psql -U postgres -d postgres -c "<verification query>"
```

If a check cannot be run, write the reason in `docs/HANDOVER.md` and the final response.

### 3. Update Dev Docs

Update docs before committing. Keep updates terse and useful for the next Codex.

Always consider:

- `docs/PROJECT_TASKS.md`: mark completed work, in-progress items, blockers, and next task.
- `docs/HANDOVER.md`: refresh continuation state, latest completed work, verification, known gaps, and next recommended task.

Update when relevant:

- `PROJECT_BRIEF.md`: material scope, architecture, security, data model, deployment, or feature-direction change.
- `docs/DEVELOPMENT_SETUP.md`: dependency, machine setup, or command change.
- `docs/SUPABASE_SETUP.md`: backend command, seed, local service, RLS, migration, or Edge Function change.
- `docs/TROUBLESHOOTING.md`: any new recurring local failure and its fix.
- `README.md`: entry-point or public setup instruction change.

Do not leave a completed task undocumented.

### 4. Write Handover

Refresh `docs/HANDOVER.md` so another Codex can continue without reading the full chat.

Handover must include:

- active branch
- current working mode, especially frontend-only vs local Supabase persist mode
- latest completed work
- latest verification commands and results
- important local-only state that is not in Git
- known blockers or risky areas
- next recommended work task
- files/code hotspots the next Codex should inspect first

Use absolute dates when recording time-sensitive state. Current project timezone is Europe/London.

### 5. Stage Intentionally

Stage only files belonging to the current task:

```powershell
git add <explicit file list>
```

Never stage:

- `.env.local`
- service-role keys
- AI keys
- production credentials
- unrelated local/user edits
- generated local database data that is not meant for Git

Check staged files:

```powershell
git diff --cached --stat
git status --short
```

### 6. Commit And Push

Commit with a short, accurate message:

```powershell
git commit -m "<short summary>"
```

Push the active branch:

```powershell
git push -u origin agent/csrevision-accounts-mvp
```

If there are no changes, do not create an empty commit. Report that there was nothing to push.

If push fails, write the failure and recovery action in the final response. Do not pretend the remote is updated.

### 7. Final Response

The final response must include:

- what changed
- checks run and whether they passed
- commit hash if committed
- push status
- whether the working tree is clean
- next recommended task

Keep the final response short enough for the user to scan.

## Current Handover Rule

As of 2026-07-26, every completed project session should end by refreshing:

```text
docs/PROJECT_TASKS.md
docs/HANDOVER.md
```

Then commit and push the active branch unless the user explicitly says not to.

## Do Not Skip

- Do not end after making changes without checking `git status -sb`.
- Do not commit code without relevant verification unless blocked.
- Do not push stale docs.
- Do not stage secrets or local env files.
- Do not leave the next Codex guessing what to do next.
