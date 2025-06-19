
-- Add milestone_id column to hour_entries table to link hours to specific milestones
ALTER TABLE public.hour_entries 
ADD COLUMN milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_hour_entries_milestone_id ON public.hour_entries(milestone_id);
