
-- Create RLS policy to allow standard users to see projects they're assigned to
CREATE POLICY "Users can view assigned projects" 
  ON public.projects 
  FOR SELECT 
  USING (
    -- Admin users can see all projects
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR
    -- Standard users can see projects they're assigned to
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = projects.id
    )
  );
