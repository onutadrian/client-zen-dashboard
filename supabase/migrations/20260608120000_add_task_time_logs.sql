alter table public.tasks
  add column if not exists time_logs jsonb not null default '[]'::jsonb;

update public.tasks
set time_logs = '[]'::jsonb
where time_logs is null;
