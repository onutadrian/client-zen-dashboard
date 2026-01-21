-- Add use_milestones flag to projects to control milestone enforcement
alter table public.projects
add column if not exists use_milestones boolean not null default true;

-- Backfill existing rows to true (default ensures this as well)
update public.projects set use_milestones = coalesce(use_milestones, true);
