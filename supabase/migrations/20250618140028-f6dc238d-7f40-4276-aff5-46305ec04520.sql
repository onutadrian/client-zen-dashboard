
-- Phase 2: Restructure hour tracking from clients to projects

-- Create a new hour_entries table to properly store time tracking data
CREATE TABLE public.hour_entries (
  id SERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  hours DECIMAL(10,2) NOT NULL CHECK (hours > 0),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  billed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_hour_entries_project_id ON hour_entries(project_id);
CREATE INDEX idx_hour_entries_client_id ON hour_entries(client_id);
CREATE INDEX idx_hour_entries_date ON hour_entries(date);
CREATE INDEX idx_hour_entries_user_id ON hour_entries(user_id);

-- Remove hour-related columns from clients table since we're moving to project-based tracking
ALTER TABLE clients 
DROP COLUMN IF EXISTS hour_entries,
DROP COLUMN IF EXISTS total_hours;

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_hour_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hour_entries_updated_at
  BEFORE UPDATE ON hour_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_hour_entries_updated_at();
