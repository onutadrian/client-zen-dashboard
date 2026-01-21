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
