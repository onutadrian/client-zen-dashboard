alter table public.projects
  add column if not exists billed_amount numeric,
  add column if not exists billing_status text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_billing_status_check'
  ) then
    alter table public.projects
      add constraint projects_billing_status_check
      check (billing_status in ('unbilled', 'partial', 'billed') or billing_status is null);
  end if;
end $$;

update public.projects
set
  billed_amount = coalesce(billed_amount, 0),
  billing_status = coalesce(billing_status, 'unbilled')
where pricing_type = 'fixed';
