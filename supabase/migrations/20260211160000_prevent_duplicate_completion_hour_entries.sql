-- Prevent duplicate auto-generated completion hour entries for the same task.
-- Keep one row per task for entries created by completion flow ("Completed task: ...").

WITH ranked AS (
  SELECT
    id,
    task_id,
    row_number() OVER (PARTITION BY task_id ORDER BY id ASC) AS rn
  FROM public.hour_entries
  WHERE task_id IS NOT NULL
    AND description ILIKE 'Completed task:%'
)
DELETE FROM public.hour_entries he
USING ranked r
WHERE he.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_hour_entries_unique_completed_task
  ON public.hour_entries(task_id)
  WHERE task_id IS NOT NULL
    AND description ILIKE 'Completed task:%';
