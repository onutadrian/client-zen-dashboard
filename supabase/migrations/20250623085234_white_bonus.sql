/*
  # Fix tasks table and add milestones

  1. Changes
     - Add start_date and end_date columns to tasks table (only if they don't exist)
     - Create milestones table for project timeline markers
     - Add appropriate indexes for performance optimization
  
  2. Security
     - Milestones table has foreign key constraint to projects table
*/

-- Conditionally add start_date and end_date columns to tasks table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN start_date DATE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN end_date DATE;
  END IF;
END $$;

-- Create milestones table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable row level security on milestones
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for milestones
CREATE POLICY "Users can view their own milestones" 
  ON milestones 
  FOR SELECT 
  TO public 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" 
  ON milestones 
  FOR INSERT 
  TO public 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" 
  ON milestones 
  FOR UPDATE 
  TO public 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones" 
  ON milestones 
  FOR DELETE 
  TO public 
  USING (auth.uid() = user_id);

-- Create indexes for better performance (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_project_id'
  ) THEN
    CREATE INDEX idx_tasks_project_id ON tasks(project_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_dates'
  ) THEN
    CREATE INDEX idx_tasks_dates ON tasks(start_date, end_date);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_milestones_project_id'
  ) THEN
    CREATE INDEX idx_milestones_project_id ON milestones(project_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_milestones_target_date'
  ) THEN
    CREATE INDEX idx_milestones_target_date ON milestones(target_date);
  END IF;
END $$;