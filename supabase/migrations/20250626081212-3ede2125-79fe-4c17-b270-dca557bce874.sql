
-- First, let's update existing NULL user_id values
-- We'll set them to a default admin user or the first available user
-- Note: This is a data migration step - in production you'd want to assign proper user ownership

-- Update tasks with NULL user_id to use the first admin user available
UPDATE public.tasks 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE user_id IS NULL;

-- If no admin exists, use the first user available
UPDATE public.tasks 
SET user_id = (
  SELECT id FROM public.profiles 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Update clients with NULL user_id
UPDATE public.clients 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.clients 
SET user_id = (
  SELECT id FROM public.profiles 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Update projects with NULL user_id
UPDATE public.projects 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.projects 
SET user_id = (
  SELECT id FROM public.profiles 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Update subscriptions with NULL user_id
UPDATE public.subscriptions 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.subscriptions 
SET user_id = (
  SELECT id FROM public.profiles 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Now make the columns NOT NULL and add constraints
ALTER TABLE public.clients ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.clients ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.tasks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.subscriptions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Create function to auto-populate user_id fields
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to auto-populate user_id
CREATE TRIGGER set_user_id_clients
  BEFORE INSERT ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

CREATE TRIGGER set_user_id_projects
  BEFORE INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

CREATE TRIGGER set_user_id_tasks
  BEFORE INSERT ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

CREATE TRIGGER set_user_id_subscriptions
  BEFORE INSERT ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- Enable RLS on all tables (some may already be enabled)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
