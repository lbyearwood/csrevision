# Production Release, Backup, And Restore Runbook

Last updated: 2026-07-30

Audience: the person responsible for a future production Supabase release.

The project is currently local-only. Do not link, migrate, restore, or otherwise change a production project without the user's explicit instruction and the correct production credentials.

## Release Preconditions

- Nominate one deployer. Only that person runs the production migration.
- Use a reviewed commit with passing typecheck, lint, unit, build, pgTAP, and browser smoke checks.
- Apply every migration to a clean local database and a non-production environment first.
- Confirm the production Supabase plan's backup retention and whether Point-in-Time Recovery is enabled.
- Schedule a maintenance window for migrations that lock or rewrite large tables.
- Record the production project reference, current application version, latest applied migration, deployer, start time, and recovery point.

Never make production schema changes directly in the Dashboard. Capture every schema change in `supabase/migrations`, review it, and apply it with the Supabase CLI.

## Pre-Migration Backup

Supabase-managed daily backups or Point-in-Time Recovery are the primary recovery mechanism when available. Confirm a recovery point exists immediately before migration.

For an independent logical backup, keep the database connection string out of Git, documentation, shell history, and captured logs. On a controlled machine, create three encrypted, access-restricted files:

```powershell
npx.cmd supabase db dump --db-url $env:PRODUCTION_DB_URL -f roles.sql --role-only
npx.cmd supabase db dump --db-url $env:PRODUCTION_DB_URL -f schema.sql
npx.cmd supabase db dump --db-url $env:PRODUCTION_DB_URL -f data.sql --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

Store the backup off the deployment machine, record its size and checksum, and enforce the agreed retention period. Database backups contain Storage metadata, not the stored objects themselves, so production Storage objects require a separate backup/export policy.

## Migration

1. Put the application into maintenance/read-only mode if the migration can conflict with writes.
2. Confirm the linked project is the intended production project.
3. Run `npx.cmd supabase migration list` and compare pending timestamps with the reviewed release.
4. Run `npx.cmd supabase db push` once.
5. Do not use `migration repair` merely to make an error disappear. It edits migration history without applying or reverting SQL.
6. Verify the migration list, critical table counts, Auth, RLS, Edge Functions, teacher sign-in, student sign-in, assignment start, answer save, submission, and results.
7. Record the migration output and release verification without recording secrets or personal data.

Production seed data is never included by default. Do not use `--include-seed` unless the release explicitly requires reviewed production-safe seed content.

## Rollback And Restore

- Application-only fault: redeploy the last known-good application if its database contract remains compatible.
- Forward-compatible schema fault: prefer a reviewed compensating migration.
- Destructive schema or data fault: stop writes and restore the confirmed managed backup/PITR recovery point, or restore the logical backup into a new isolated Supabase project and switch only after verification.
- Never delete or edit an already-applied migration file as a rollback.

For a manual logical restore into a new project, follow the current Supabase backup/restore guide. The supported flow restores `roles.sql`, `schema.sql`, and `data.sql` in one `psql` transaction with `ON_ERROR_STOP`, then separately preserves migration history and re-enables required publications. Reset passwords for custom login roles after a managed backup restore where required.

After any restore, verify:

- migration history and critical row counts;
- Auth users and role/profile mappings;
- RLS and pgTAP;
- Edge Function secrets and deployments;
- Storage objects separately from database metadata;
- teacher and student release smoke routes.

## Rehearsal Record

On 2026-07-30, Stage 9 tested the underlying logical recovery mechanism against local Supabase:

- created a 1,088,444-byte custom-format logical backup;
- restored it into an isolated `stage9_restore_rehearsal` database;
- matched source and restored counts for 13 classes, 300 students, 3,452 attempts, 97 assignments, and 28 migration records;
- removed the temporary restore database and backup file after verification.

This proves local logical recoverability. A production restore is still a deliberate, separately authorised operation and must be rehearsed against the chosen production plan and a non-production Supabase project before launch.

References:

- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
- https://supabase.com/docs/guides/deployment/database-migrations
