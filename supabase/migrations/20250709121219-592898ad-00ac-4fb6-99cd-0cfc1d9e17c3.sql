-- Add milestone_id column to tasks table
ALTER TABLE tasks ADD COLUMN milestone_id uuid REFERENCES milestones(id);

-- Create index for better performance
CREATE INDEX idx_tasks_milestone_id ON tasks(milestone_id);