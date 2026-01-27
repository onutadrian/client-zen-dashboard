Agent Guide for client-zen-dashboard

Scope
- Applies to the entire repository.

Stack
- Vite + React 18 + TypeScript
- Tailwind CSS (+ shadcn/ui primitives)
- React Router, TanStack Query
- Supabase JS client (public anon key is embedded)

Runbook
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Node: 18+ recommended (Vite 5)

Conventions
- Match existing file structure: `src/components`, `src/hooks`, `src/services`, `src/integrations/supabase`, `src/utils`, `src/pages`.
- Use TypeScript with explicit types where practical; keep props and return types clear.
- Keep changes minimal and focused; avoid unrelated refactors.
- Follow current patterns for exports/imports and styling; don’t introduce new libs without need.
- Prefer small, composable React components; keep hooks pure and side-effect aware.

Supabase
- Client lives at `src/integrations/supabase/client.ts` and is ready to use.
- No local env vars required for basic usage in this repo.

Testing & Validation
- No formal test suite present; validate via dev server and linting.
- If adding tests, keep scope to changed code only.

Agent Notes
- Document behavioral changes in PR/message summaries.
- Do not alter unrelated files or project configuration unless requested.

Memory Log (Token‑Conscious)
- Purpose: Persist a tiny, high-signal memory so resets/new sessions retain key context without bloating prompts.
- Location: `AGENT_MEMORY.md` (append‑only, concise). Keep AGENTS.md policy; keep the log itself out of this file to avoid auto-inclusion overhead.
- When to add entries (only if meaningful):
  - Architectural decisions or cross-cutting conventions not obvious from code.
  - External integration endpoints/flows (e.g., edge functions) or schema changes.
  - Role/permission rules that affect UX or data visibility.
  - Non-trivial runbook updates or project operating assumptions.
- Do not add:
  - Secrets/tokens, stack traces, full diffs, or chat transcripts.
  - Ephemeral todos or one-off debug notes.
- Entry format (one-liners + 2–5 bullets max):
  - `YYYY-MM-DD – <Category>: <very short title>`
  - Bullets: 1 line each, prefer nouns/imperatives, avoid prose.
- Size discipline:
  - Target ≤ 30–40 lines total. When approaching that, compress older entries into a short “History Rollup”.
  - Prefer links/paths over pasted code. Reference files like `src/...` instead of quoting.
- Retrieval: On reset, scan `AGENT_MEMORY.md` first to rehydrate working context.
