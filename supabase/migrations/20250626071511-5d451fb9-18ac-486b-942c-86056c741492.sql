
-- Create user_project_assignments table to manage which users can access which projects
CREATE TABLE public.user_project_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  UNIQUE(user_id, project_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_project_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for user_project_assignments
-- Admins can view all assignments
CREATE POLICY "Admins can view all assignments" 
  ON public.user_project_assignments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can create assignments
CREATE POLICY "Admins can create assignments" 
  ON public.user_project_assignments 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete assignments
CREATE POLICY "Admins can delete assignments" 
  ON public.user_project_assignments 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own assignments
CREATE POLICY "Users can view their own assignments" 
  ON public.user_project_assignments 
  FOR SELECT 
  USING (user_id = auth.uid());
