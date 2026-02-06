-- Add task_id column to hour_entries table to properly link hours to tasks
ALTER TABLE public.hour_entries 
ADD COLUMN IF NOT EXISTS task_id INTEGER REFERENCES public.tasks(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_hour_entries_task_id ON public.hour_entries(task_id);

-- Attempt to migrate existing data by matching task descriptions to actual tasks
-- This will help populate task_id for existing hour entries where possible
UPDATE public.hour_entries 
SET task_id = (
  SELECT t.id 
  FROM public.tasks t 
  WHERE t.project_id = hour_entries.project_id 
    AND t.client_id = hour_entries.client_id
    AND hour_entries.description ILIKE '%completed task:%'
    AND (
      hour_entries.description ILIKE '%completed task: ' || t.title || '%'
      OR hour_entries.description ILIKE '%completed task:%' || replace(replace(lower(t.title), 'stage ', ''), 'v', '') || '%'
    )
  LIMIT 1
)
WHERE task_id IS NULL AND description ILIKE '%completed task:%';
