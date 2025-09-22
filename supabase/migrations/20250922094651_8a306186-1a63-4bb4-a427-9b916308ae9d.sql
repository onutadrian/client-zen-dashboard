-- Add task assignment functionality for contractors
-- Add assigned_to column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN assigned_to UUID REFERENCES public.profiles(id);

-- Create index for better performance on assignment queries
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);

-- Update RLS policies to allow assigned users to view and update their assigned tasks
CREATE POLICY "Assigned users can view their assigned tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (assigned_to = auth.uid());

CREATE POLICY "Assigned users can update their assigned tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (assigned_to = auth.uid());

-- Allow assigned users to create hour entries for their assigned tasks
CREATE POLICY "Assigned users can create hour entries for assigned tasks" 
ON public.hour_entries 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.tasks 
    WHERE tasks.id = hour_entries.task_id 
    AND tasks.assigned_to = auth.uid()
  )
);

-- Allow assigned users to view hour entries for their assigned tasks
CREATE POLICY "Assigned users can view hour entries for assigned tasks" 
ON public.hour_entries 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.tasks 
    WHERE tasks.id = hour_entries.task_id 
    AND tasks.assigned_to = auth.uid()
  )
);