Agent Memory (Concise, Append‑Only)

2026-01-26 – Quick runbook & entry
- Scripts: dev `npm run dev`, build `npm run build`, preview `npm run preview`, lint `npm run lint`
- Dev server: Vite on `:8080`; path alias `@` → `src`
- Entry: `src/main.tsx`; providers + routes in `src/App.tsx`
- ProtectedRoute: `src/components/ProtectedRoute.tsx`

2026-01-26 – Stack & structure
- Stack: Vite + React 18 TS, Tailwind + shadcn, React Router, TanStack Query
- UI shell: `src/components/dashboard/DashboardContainer.tsx`, sidebar in `src/components/AppSidebar.tsx`
- Conventions: services in `src/services`, hooks in `src/hooks`, Supabase in `src/integrations/supabase`

2026-01-26 – Routing (protected except /auth)
- `/`, `/projects`, `/projects/:id`, `/clients`, `/clients/:id`, `/subscriptions`, `/users`, `/contracts`, `/auth`

2026-01-26 – Auth & roles
- Provider: `src/hooks/auth/useAuthProvider.tsx`; exports via `src/hooks/useAuth.tsx`
- Roles: admin vs standard; menu gating in `AppSidebar`
- Non-admin filtering uses `user_project_assignments` for projects/tasks
- Sign-out cleanup removes Supabase tokens (local/session storage)

2026-01-26 – Supabase model & client
- Client: `src/integrations/supabase/client.ts` (typed via `types.ts`)
- Key tables: profiles, clients, projects, milestones, tasks, hour_entries, subscriptions, generated_documents, security_audit_log, user_project_assignments
- Invoices are JSON on `clients`; analytics uses PAID invoices only
- Budget tab hidden when project.pricingType = fixed or `use_milestones` = false

2026-01-26 – Currency & “demo mode”
- `useCurrency`: fetches via edge fn `fetch-exchange-rates` (fallback + cache), events: `currencyChanged`
- Demo mode toggled in sidebar; event `demoModeChanged` to hide/show financials

2026-01-26 – Edge functions & env
- `fetch-exchange-rates`, `validate-invite-token` (RPC), `send-invite-email` (Resend)
- Env keys (functions): `CURRENCYLAYER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `APP_URL`

2026-01-26 – Recent schema/UX deltas
- Added `use_milestones` on projects; urgent hourly rate support
- Iterated milestone billing/status logic; fixed task assignment flows
2026-02-05 – RLS: Client access policies
- Added `public.get_client_id_for_user()` helper for email->client mapping
- Client RLS: clients/projects/tasks/milestones/hour_entries select policies
- Migration: `supabase/migrations/20260205120000_client_access_policies.sql`
2026-02-05 – Realtime: Temporary disable toggle
- `VITE_DISABLE_REALTIME=true` disables realtime subscriptions in dev
- Re-enable once Supabase Realtime is stable; check `status.supabase.com`
