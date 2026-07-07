# Supabase Setup

1. Create a Supabase project.
2. Disable public sign-up for students. Teacher/admin accounts should be bootstrapped by a trusted admin process.
3. Apply migrations from `supabase/migrations`.
4. Deploy Edge Functions from `supabase/functions`.
5. Set Supabase secrets:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Future v2 secrets:

```text
AI_PROVIDER_API_KEY
AI_MARKING_MODEL
```

The service-role key is used only in Edge Functions. It must never be committed, exposed to the frontend, or added to `.env.example`.

Recent Supabase projects may not expose new tables through the Data API automatically, so the migration grants authenticated access explicitly and relies on RLS for row-level authorization.
