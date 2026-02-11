
import { Task } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';

const inFlightCompletionLogs = new Set<number>();

export const createHourEntryForCompletedTask = async (
  task: Task,
  workedHours: number
) => {
  if (!task.projectId) {
    throw new Error('Task must have a project ID to create hour entry');
  }

  // Prevent duplicate inserts when completion is triggered twice in quick succession.
  if (inFlightCompletionLogs.has(task.id)) {
    return null;
  }
  inFlightCompletionLogs.add(task.id);

  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // If hours were already logged manually for this task, do not create a duplicate.
    const { data: existingEntries, error: existingError } = await supabase
      .from('hour_entries')
      .select('id')
      .eq('task_id', task.id)
      .limit(1);

    if (existingError) throw existingError;
    if (existingEntries && existingEntries.length > 0) {
      return null;
    }

    // Determine who should get credit for the hours:
    // If task is assigned to someone, they get the hours
    // Otherwise, the current user (who completed the task) gets the hours
    const hoursUserId = task.assignedTo || user.id;
    
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
      user_id: hoursUserId
    };

    const { data, error } = await supabase
      .from('hour_entries')
      .insert([supabaseEntry])
      .select()
      .single();

    // DB-level unique guard can race with UI calls; treat duplicate key as already-logged.
    if (error) {
      if (error.code === '23505') {
        return null;
      }
      throw error;
    }
    
    return data;
  } finally {
    inFlightCompletionLogs.delete(task.id);
  }
};
