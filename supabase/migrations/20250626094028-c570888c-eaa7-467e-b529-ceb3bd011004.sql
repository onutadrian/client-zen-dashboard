
-- First, let's check if RLS is enabled on clients table
-- If not, enable it and create proper policies

-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Standard users can view assigned clients" ON public.clients;

-- Create policy for admins to see all clients
CREATE POLICY "Admins can view all clients" 
  ON public.clients 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for standard users to see clients from projects they're assigned to
CREATE POLICY "Standard users can view assigned clients" 
  ON public.clients 
  FOR SELECT 
  USING (
    -- Admin users can see all clients
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Standard users can see clients from projects they're assigned to
    EXISTS (
      SELECT 1 FROM public.user_project_assignments upa
      INNER JOIN public.projects p ON p.id = upa.project_id
      WHERE upa.user_id = auth.uid() 
      AND p.client_id = clients.id
    )
  );

-- Allow users to insert their own clients
CREATE POLICY "Users can create clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own clients, or admins to update any
CREATE POLICY "Users can update clients" 
  ON public.clients 
  FOR UPDATE 
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
