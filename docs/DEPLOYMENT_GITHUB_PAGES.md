# GitHub Pages Deployment

GitHub Pages is static hosting. The app uses `HashRouter`, so deep links do not require server rewrites.

The GitHub Actions workflow sets:

```text
VITE_BASE_PATH=/${{ github.event.repository.name }}/
```

For local development, Vite uses `/`.

Deployment checklist:

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as repository secrets.
2. Enable Pages deployment from GitHub Actions.
3. Push to `main`.
4. Confirm no service-role or AI keys appear in frontend build output.
