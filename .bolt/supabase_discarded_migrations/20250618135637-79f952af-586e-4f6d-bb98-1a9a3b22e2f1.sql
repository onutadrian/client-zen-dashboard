
-- Add archived status to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Update the status column to include archived as a valid option
-- (This is just for documentation - the archived column will be the primary indicator)

-- Add cascading delete constraints to maintain referential integrity
-- First, drop existing foreign key constraints if they exist
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_project_id_fkey;
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_project_id_fkey;

-- Re-add foreign key constraints with CASCADE DELETE
ALTER TABLE tasks 
ADD CONSTRAINT tasks_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE milestones 
ADD CONSTRAINT milestones_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Clear existing test data to start fresh
TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;
TRUNCATE TABLE milestones RESTART IDENTITY CASCADE;
DELETE FROM projects;
DELETE FROM clients;

-- Reset sequences
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
