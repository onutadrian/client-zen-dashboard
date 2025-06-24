
-- Add estimated_hours to milestones table
ALTER TABLE public.milestones 
ADD COLUMN estimated_hours NUMERIC DEFAULT 0;

-- Update existing milestones to have a default estimated hours value
UPDATE public.milestones 
SET estimated_hours = 8 
WHERE estimated_hours IS NULL OR estimated_hours = 0;
