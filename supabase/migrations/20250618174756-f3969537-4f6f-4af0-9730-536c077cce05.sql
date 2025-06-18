
-- Fix existing client data by setting user_id for clients that don't have one
-- This will associate existing clients with the current authenticated user
UPDATE public.clients 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Do the same for other tables that might have orphaned data
UPDATE public.projects 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.subscriptions 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.hour_entries 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.tasks 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.invoices 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

UPDATE public.milestones 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;
