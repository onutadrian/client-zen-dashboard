-- Add urgent_hourly_rate column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS urgent_hourly_rate numeric;

-- Add urgent column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS urgent boolean DEFAULT false;
