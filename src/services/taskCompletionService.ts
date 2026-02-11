
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

    const { data: existingEntries, error: existingError } = await supabase
      .from('hour_entries')
      .select('id')
      .eq('task_id', task.id)
      .order('id', { ascending: true });

    if (existingError) throw existingError;

    // Determine who should get credit for the hours:
    // If task is assigned to someone, they get the hours
    // Otherwise, the current user (who completed the task) gets the hours
    const hoursUserId = task.assignedTo || user.id;

    const completionPayload = {
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

    // Override behavior: task completion hours represent the intended total.
    // Keep exactly one task-linked hour entry for this task.
    if (existingEntries && existingEntries.length > 0) {
      const primaryId = existingEntries[0].id;
      const duplicateIds = existingEntries.slice(1).map(entry => entry.id);

      const { data: updatedData, error: updateError } = await supabase
        .from('hour_entries')
        .update(completionPayload)
        .eq('id', primaryId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (duplicateIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('hour_entries')
          .delete()
          .in('id', duplicateIds);

        if (deleteError) throw deleteError;
      }

      return updatedData;
    }

    const { data, error } = await supabase
      .from('hour_entries')
      .insert([completionPayload])
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

    // legacy no-op guard removed in favor of explicit override behavior
  } finally {
    inFlightCompletionLogs.delete(task.id);
  }
};
