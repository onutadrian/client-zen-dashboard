
-- Remove the dangerous overly permissive policies that allow any authenticated user
-- to access all data regardless of ownership

-- Remove dangerous policy from clients table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;

-- Remove dangerous policy from projects table  
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Allow all operations on projects" ON public.projects;

-- Remove dangerous policy from tasks table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.tasks;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON public.tasks;

-- Remove dangerous policy from subscriptions table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow all operations on subscriptions" ON public.subscriptions;

-- Remove dangerous policy from hour_entries table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.hour_entries;
DROP POLICY IF EXISTS "Allow all operations on hour_entries" ON public.hour_entries;

-- Remove dangerous policy from invoices table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.invoices;
DROP POLICY IF EXISTS "Allow all operations on invoices" ON public.invoices;

-- Remove dangerous policy from milestones table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.milestones;
DROP POLICY IF EXISTS "Allow all operations on milestones" ON public.milestones;

-- Remove dangerous policy from profiles table
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Allow all operations on profiles" ON public.profiles;

-- Verify that proper user-based RLS policies exist and create them if missing
-- These policies ensure users can only access their own data

-- Clients table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can view their own clients') THEN
    CREATE POLICY "Users can view their own clients" ON public.clients
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can insert their own clients') THEN
    CREATE POLICY "Users can insert their own clients" ON public.clients
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can update their own clients') THEN
    CREATE POLICY "Users can update their own clients" ON public.clients
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' AND policyname = 'Users can delete their own clients') THEN
    CREATE POLICY "Users can delete their own clients" ON public.clients
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Projects table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can view their own projects') THEN
    CREATE POLICY "Users can view their own projects" ON public.projects
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can insert their own projects') THEN
    CREATE POLICY "Users can insert their own projects" ON public.projects
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can update their own projects') THEN
    CREATE POLICY "Users can update their own projects" ON public.projects
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can delete their own projects') THEN
    CREATE POLICY "Users can delete their own projects" ON public.projects
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Tasks table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tasks' AND policyname = 'Users can view their own tasks') THEN
    CREATE POLICY "Users can view their own tasks" ON public.tasks
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tasks' AND policyname = 'Users can insert their own tasks') THEN
    CREATE POLICY "Users can insert their own tasks" ON public.tasks
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tasks' AND policyname = 'Users can update their own tasks') THEN
    CREATE POLICY "Users can update their own tasks" ON public.tasks
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tasks' AND policyname = 'Users can delete their own tasks') THEN
    CREATE POLICY "Users can delete their own tasks" ON public.tasks
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Hour entries table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hour_entries' AND policyname = 'Users can view their own hour entries') THEN
    CREATE POLICY "Users can view their own hour entries" ON public.hour_entries
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hour_entries' AND policyname = 'Users can insert their own hour entries') THEN
    CREATE POLICY "Users can insert their own hour entries" ON public.hour_entries
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hour_entries' AND policyname = 'Users can update their own hour entries') THEN
    CREATE POLICY "Users can update their own hour entries" ON public.hour_entries
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hour_entries' AND policyname = 'Users can delete their own hour entries') THEN
    CREATE POLICY "Users can delete their own hour entries" ON public.hour_entries
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Subscriptions table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions') THEN
    CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users can insert their own subscriptions') THEN
    CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users can update their own subscriptions') THEN
    CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users can delete their own subscriptions') THEN
    CREATE POLICY "Users can delete their own subscriptions" ON public.subscriptions
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Invoices table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can view their own invoices') THEN
    CREATE POLICY "Users can view their own invoices" ON public.invoices
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can insert their own invoices') THEN
    CREATE POLICY "Users can insert their own invoices" ON public.invoices
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can update their own invoices') THEN
    CREATE POLICY "Users can update their own invoices" ON public.invoices
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'invoices' AND policyname = 'Users can delete their own invoices') THEN
    CREATE POLICY "Users can delete their own invoices" ON public.invoices
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Milestones table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'milestones' AND policyname = 'Users can view their own milestones') THEN
    CREATE POLICY "Users can view their own milestones" ON public.milestones
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'milestones' AND policyname = 'Users can insert their own milestones') THEN
    CREATE POLICY "Users can insert their own milestones" ON public.milestones
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'milestones' AND policyname = 'Users can update their own milestones') THEN
    CREATE POLICY "Users can update their own milestones" ON public.milestones
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'milestones' AND policyname = 'Users can delete their own milestones') THEN
    CREATE POLICY "Users can delete their own milestones" ON public.milestones
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Profiles table policies (user-based access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;
