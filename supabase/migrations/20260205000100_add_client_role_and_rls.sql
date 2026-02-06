-- Add client role support and RLS policies for client access

-- Extend role update function to allow 'client'
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can call this function
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('admin', 'standard', 'client') THEN
    RAISE EXCEPTION 'Invalid role. Must be admin, standard, or client';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the role change for audit purposes
  INSERT INTO public.security_audit_log (
    user_id, 
    action, 
    resource_type, 
    resource_id, 
    details
  ) VALUES (
    auth.uid(),
    'role_change',
    'user_profile',
    target_user_id,
    jsonb_build_object(
      'new_role', new_role,
      'changed_by', auth.uid(),
      'timestamp', now()
    )
  );
END;
$$;

-- Helper to resolve client_id for the authenticated user's email
CREATE OR REPLACE FUNCTION public.get_client_id_for_user()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT c.id
  FROM public.clients c
  WHERE EXISTS (
    SELECT 1
    FROM jsonb_array_elements(to_jsonb(c.people)) p
    WHERE lower(p->>'email') = lower(auth.email())
  )
  LIMIT 1;
$$;

-- Clients can view their own client record
DROP POLICY IF EXISTS "Clients can view own client" ON public.clients;
CREATE POLICY "Clients can view own client"
  ON public.clients
  FOR SELECT
  USING (
    id = public.get_client_id_for_user()
  );

-- Clients can view their projects
DROP POLICY IF EXISTS "Clients can view their projects" ON public.projects;
CREATE POLICY "Clients can view their projects"
  ON public.projects
  FOR SELECT
  USING (
    client_id = public.get_client_id_for_user()
  );

-- Clients can view tasks for their projects
DROP POLICY IF EXISTS "Clients can view tasks for their projects" ON public.tasks;
CREATE POLICY "Clients can view tasks for their projects"
  ON public.tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
      AND p.client_id = public.get_client_id_for_user()
    )
  );

-- Clients can view milestones for their projects
DROP POLICY IF EXISTS "Clients can view milestones for their projects" ON public.milestones;
CREATE POLICY "Clients can view milestones for their projects"
  ON public.milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = milestones.project_id
      AND p.client_id = public.get_client_id_for_user()
    )
  );

-- Clients can view hour entries for their projects
DROP POLICY IF EXISTS "Clients can view hour entries for their projects" ON public.hour_entries;
CREATE POLICY "Clients can view hour entries for their projects"
  ON public.hour_entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = hour_entries.project_id
      AND p.client_id = public.get_client_id_for_user()
    )
  );
