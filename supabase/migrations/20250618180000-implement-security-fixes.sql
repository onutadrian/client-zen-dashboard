
-- Phase 1: Fix Critical RLS Policy Issues (Robust Version)
-- Handle existing policies and implement proper user-based security

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.tasks;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.hour_entries;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.invoices;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.milestones;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.profiles;

-- 3. Drop and recreate proper user-based RLS policies for clients table
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Drop and recreate proper user-based RLS policies for projects table
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Drop and recreate proper user-based RLS policies for tasks table
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Drop and recreate proper user-based RLS policies for subscriptions table
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON public.subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Drop and recreate proper user-based RLS policies for hour_entries table
DROP POLICY IF EXISTS "Users can view their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can insert their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can update their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can delete their own hour entries" ON public.hour_entries;

CREATE POLICY "Users can view their own hour entries" ON public.hour_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hour entries" ON public.hour_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hour entries" ON public.hour_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hour entries" ON public.hour_entries
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Drop and recreate proper user-based RLS policies for invoices table
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;

CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Drop and recreate proper user-based RLS policies for milestones table
DROP POLICY IF EXISTS "Users can view their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can insert their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can update their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete their own milestones" ON public.milestones;

CREATE POLICY "Users can view their own milestones" ON public.milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" ON public.milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" ON public.milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones" ON public.milestones
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Drop and recreate proper user-based RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 11. Make user_id columns NOT NULL where they should be required (with safe handling)
DO $$
BEGIN
  -- Only alter if the column is nullable
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'clients' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.clients ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'projects' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.projects ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'subscriptions' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.subscriptions ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'invoices' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.invoices ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'milestones' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.milestones ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- 12. Add database-level constraints for data integrity (with safe handling)
DO $$
BEGIN
  -- Add constraints only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'clients_price_positive') THEN
    ALTER TABLE public.clients ADD CONSTRAINT clients_price_positive CHECK (price >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'projects_fixed_price_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_fixed_price_positive CHECK (fixed_price IS NULL OR fixed_price >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'projects_hourly_rate_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_hourly_rate_positive CHECK (hourly_rate IS NULL OR hourly_rate >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'projects_daily_rate_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_daily_rate_positive CHECK (daily_rate IS NULL OR daily_rate >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'projects_estimated_hours_positive') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_estimated_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'subscriptions_price_positive') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_price_positive CHECK (price >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'subscriptions_seats_positive') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_seats_positive CHECK (seats > 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'subscriptions_total_paid_positive') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_total_paid_positive CHECK (total_paid >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'hour_entries_hours_positive') THEN
    ALTER TABLE public.hour_entries ADD CONSTRAINT hour_entries_hours_positive CHECK (hours >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'invoices_amount_positive') THEN
    ALTER TABLE public.invoices ADD CONSTRAINT invoices_amount_positive CHECK (amount >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'milestones_amount_positive') THEN
    ALTER TABLE public.milestones ADD CONSTRAINT milestones_amount_positive CHECK (amount IS NULL OR amount >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'milestones_completion_percentage_valid') THEN
    ALTER TABLE public.milestones ADD CONSTRAINT milestones_completion_percentage_valid CHECK (completion_percentage >= 0 AND completion_percentage <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'tasks_estimated_hours_positive') THEN
    ALTER TABLE public.tasks ADD CONSTRAINT tasks_estimated_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'tasks_actual_hours_positive') THEN
    ALTER TABLE public.tasks ADD CONSTRAINT tasks_actual_hours_positive CHECK (actual_hours IS NULL OR actual_hours >= 0);
  END IF;
END $$;

-- 13. Add email format validation constraints (with safe handling)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'clients_people_email_format') THEN
    ALTER TABLE public.clients ADD CONSTRAINT clients_people_email_format CHECK (
      people IS NULL OR (
        SELECT bool_and(
          (person->>'email')::text ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        )
        FROM jsonb_array_elements(people::jsonb) AS person
        WHERE person->>'email' IS NOT NULL AND person->>'email' != ''
      )
    );
  END IF;
END $$;

-- 14. Add URL validation for links (with safe handling)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                 WHERE constraint_name = 'clients_links_url_format') THEN
    ALTER TABLE public.clients ADD CONSTRAINT clients_links_url_format CHECK (
      links IS NULL OR (
        SELECT bool_and(
          link ~ '^https?://[^\s/$.?#].[^\s]*$'
        )
        FROM unnest(links) AS link
        WHERE link IS NOT NULL AND link != ''
      )
    );
  END IF;
END $$;
