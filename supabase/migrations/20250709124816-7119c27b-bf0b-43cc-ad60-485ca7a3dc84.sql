-- Update the milestones status check constraint to include 'in-progress'
ALTER TABLE milestones 
DROP CONSTRAINT IF EXISTS milestones_status_check;

ALTER TABLE milestones 
ADD CONSTRAINT milestones_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'in-progress'::text, 'completed'::text, 'overdue'::text]));