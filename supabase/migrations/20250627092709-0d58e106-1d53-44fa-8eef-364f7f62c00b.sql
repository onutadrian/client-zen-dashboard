
-- Enable RLS on tasks table if not already enabled
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all tasks
CREATE POLICY "Admins can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

-- Create policy to allow admins to delete all tasks
CREATE POLICY "Admins can delete all tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

-- Create policy to allow admins to insert tasks
CREATE POLICY "Admins can insert tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

-- Create policy to allow admins to update tasks
CREATE POLICY "Admins can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );
