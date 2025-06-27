
-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admins can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can delete all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can update tasks" ON public.tasks;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    public.get_current_user_role() = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

CREATE POLICY "Admins can delete all tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    public.get_current_user_role() = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

CREATE POLICY "Admins can insert tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    public.get_current_user_role() = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );

CREATE POLICY "Admins can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    public.get_current_user_role() = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_project_assignments 
      WHERE user_id = auth.uid() 
      AND project_id = tasks.project_id
    )
  );
