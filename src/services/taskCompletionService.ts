
import { Task } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';

export const createHourEntryForCompletedTask = async (
  task: Task,
  workedHours: number
) => {
  if (!task.projectId) {
    throw new Error('Task must have a project ID to create hour entry');
  }

  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Create hour entry directly in Supabase
  const supabaseEntry = {
    project_id: task.projectId,
    client_id: task.clientId,
    milestone_id: task.milestoneId,
    task_id: task.id,
    hours: workedHours,
    description: `Completed task: ${task.title}`,
    date: new Date().toISOString().split('T')[0],
    billed: false,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('hour_entries')
    .insert([supabaseEntry])
    .select()
    .single();

  if (error) throw error;
  
  return data;
};
