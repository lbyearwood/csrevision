# csrevision

Mobile-first student knowledge testing platform for teacher-created accounts, class management, curriculum-linked tests, assigned one-attempt assessments, practice tests, server-side marking, suspicious activity logging, points, status levels, and privacy-safe leaderboards.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Hosting: GitHub Pages static frontend
- Backend: Supabase Auth, Postgres, RLS, Edge Functions
- Routing: `HashRouter` for GitHub Pages compatibility

## Local Development

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run build
npm run preview
npm run typecheck
npm run lint
npm run test
npm run test:coverage
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

- [docs/PROJECT_TASKS.md](docs/PROJECT_TASKS.md) for live state, current tasks, and blockers.
- [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for product rules and long-term architecture constraints.
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) before any local or cloud Supabase work.

Keep `docs/PROJECT_TASKS.md` updated as work is completed, started, blocked, or deferred.
