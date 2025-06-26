
-- First, let's check if RLS policies exist for tasks table to allow standard users to see tasks for their assigned projects
CREATE POLICY "Users can view tasks for assigned projects" 
  ON public.tasks 
  FOR SELECT 
  USING (
    -- Admin users can see all tasks
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    -- Standard users can see tasks for projects they're assigned to
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

-- Create policy for hour_entries (history) to allow users to see entries for their assigned projects
CREATE POLICY "Users can view hour entries for assigned projects" 
  ON public.hour_entries 
  FOR SELECT 
  USING (
    -- Admin users can see all hour entries
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    -- Standard users can see hour entries for projects they're assigned to
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = hour_entries.project_id
    )
  );

-- Also create policy for milestones if they need to see those
CREATE POLICY "Users can view milestones for assigned projects" 
  ON public.milestones 
  FOR SELECT 
  USING (
    -- Admin users can see all milestones
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    -- Standard users can see milestones for projects they're assigned to
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = milestones.project_id
    )
  );
