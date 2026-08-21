-- Standard users should only see and update tasks assigned directly to them.
-- Project-level assignment remains for project access, not task-list visibility.

DROP POLICY IF EXISTS "Users can view tasks for assigned projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can view hour entries for assigned projects" ON public.hour_entries;

DROP POLICY IF EXISTS "Admins can view all tasks" ON public.tasks;
CREATE POLICY "Admins can view all tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update tasks" ON public.tasks;
CREATE POLICY "Admins can update tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can delete all tasks" ON public.tasks;
CREATE POLICY "Admins can delete all tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Assigned users can view their assigned tasks" ON public.tasks;
CREATE POLICY "Assigned users can view their assigned tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

DROP POLICY IF EXISTS "Assigned users can update their assigned tasks" ON public.tasks;
CREATE POLICY "Assigned users can update their assigned tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());
