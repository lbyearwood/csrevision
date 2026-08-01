# csrevision

Mobile-first student knowledge testing platform for teacher-created accounts, class management, curriculum-linked tests, assigned one-attempt assessments, practice tests, server-side marking, suspicious activity logging, points, status levels, and privacy-safe leaderboards.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Hosting: GitHub Pages static frontend
- Backend: Supabase Auth, Postgres, RLS, Edge Functions
- Routing: `HashRouter` for GitHub Pages compatibility

## Local Development

For a new computer or Codex environment, follow [Planning/Process/CODEX_START_PROCESS.md](Planning/Process/CODEX_START_PROCESS.md) first, then read [Planning/Process/HANDOVER.md](Planning/Process/HANDOVER.md) and [Planning/Setup/DEVELOPMENT_SETUP.md](Planning/Setup/DEVELOPMENT_SETUP.md). If local commands behave oddly, check [Planning/Setup/TROUBLESHOOTING.md](Planning/Setup/TROUBLESHOOTING.md). Until launch, all development and QA require Docker Desktop and the local Supabase stack; there is no frontend-only/demo fallback.

```bash
npm.cmd install
npm.cmd run dev
```

Useful scripts:

```bash
npm.cmd run build
npm.cmd run preview
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run test:coverage
```

## Environment

Copy `.env.example` to `.env` and set:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_APP_NAME=csrevision
```

Do not put service-role keys or AI keys in frontend env files.

## MVP Notes

MVP v1 includes account/class foundations, student-safe test flows, assigned/practice attempt rules, server-side Edge Function contracts, suspicious activity logging, points/status, and basic leaderboards.

Deferred to later versions: AI written-answer marking, certificates, CSV import/export UI, advanced analytics, notifications, parent accounts, public marketing pages, and self-registration.

## Codex Handoff

Future Codex agents should start with:

- [Planning/README.md](Planning/README.md) for the organised planning-directory index.
- [Planning/Process/CODEX_START_PROCESS.md](Planning/Process/CODEX_START_PROCESS.md) for the required pull/read/install/run/report startup sequence.
- [Planning/Process/CODEX_DEVELOPMENT_PROCESS.md](Planning/Process/CODEX_DEVELOPMENT_PROCESS.md) for the required per-task QA gate.
- [Planning/Process/CODEX_END_PROCESS.md](Planning/Process/CODEX_END_PROCESS.md) for the user-triggered end-of-day planning update, handover, commit and push sequence.
- [Planning/Process/HANDOVER.md](Planning/Process/HANDOVER.md) for the current continuation state and fresh-PC bootstrap.
- [Planning/Process/PROJECT_TASKS.md](Planning/Process/PROJECT_TASKS.md) for live state, current tasks, and blockers.
- [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for product rules and long-term architecture constraints.
- [Planning/Setup/DEVELOPMENT_SETUP.md](Planning/Setup/DEVELOPMENT_SETUP.md) for fresh-machine dependencies and bootstrap.
- [Planning/Setup/TROUBLESHOOTING.md](Planning/Setup/TROUBLESHOOTING.md) for Windows/Codex local development fixes.
- [Planning/Setup/SUPABASE_SETUP.md](Planning/Setup/SUPABASE_SETUP.md) before any local or cloud Supabase work.

Keep `Planning/Process/PROJECT_TASKS.md` updated as work is completed, started, blocked, or deferred.
