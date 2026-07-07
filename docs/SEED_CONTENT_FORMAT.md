# Seed Content Format

Seed content lives in:

- `supabase/seed/subjects.json`
- `supabase/seed/sample-tests.json`

Preferred nested structure:

```text
Subject
  Unit
    Topic
      Test
        Version
          Questions
            Options
```

Seed files may include correct answers because they are backend import material. The frontend must not import backend seed files or bundle answer keys.

Frontend demo data intentionally omits correct answers and `is_correct` flags.
