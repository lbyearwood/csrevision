# AI Marking

AI written-answer marking is deferred to v2.

The MVP schema keeps future compatibility by separating student answers, marking status, feedback visibility, and teacher review concepts. When v2 is added, AI calls must run only from a Supabase Edge Function with private provider secrets.

The frontend must never receive AI prompts, mark schemes, model answers, or provider API keys.
