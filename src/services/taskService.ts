
import { supabase } from '@/integrations/supabase/client';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { retryOperation } from '@/utils/taskUtils';

export const loadTasksFromDatabase = async (): Promise<Task[]> => {
  const result = await retryOperation(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!assigned_to(
          id,
          full_name,
          email
        )
      `)
      .order('created_date', { ascending: false });

    if (error) throw error;
    return data;
  });

  // Transform Supabase data to match our Task interface
  return result.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    clientId: task.client_id,
    clientName: task.client_name,
    projectId: task.project_id,
    milestoneId: task.milestone_id,
    estimatedHours: task.estimated_hours,
    actualHours: task.actual_hours,
    workedHours: task.worked_hours,
    status: task.status as 'pending' | 'in-progress' | 'completed',
    notes: task.notes || '',
    assets: task.assets || [],
    createdDate: task.created_date,
    completedDate: task.completed_date || undefined,
    startDate: task.start_date || undefined,
    endDate: task.end_date || undefined,
    assignedTo: task.assigned_to,
    assignedToName: task.assigned_to_profile?.full_name || null,
  }));
};

export const createTaskInDatabase = async (newTask: CreateTaskData): Promise<Task> => {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Use the provided project_id or generate a temporary one
  const projectId = newTask.projectId || '00000000-0000-0000-0000-000000000000';

  const supabaseTask = {
    title: newTask.title,
    description: newTask.description,
    client_id: newTask.clientId,
    client_name: newTask.clientName,
    project_id: projectId,
    milestone_id: newTask.milestoneId,
    estimated_hours: newTask.estimatedHours,
    status: 'pending',
    notes: newTask.notes,
    assets: newTask.assets,
    start_date: newTask.startDate,
    end_date: newTask.endDate,
    assigned_to: newTask.assignedTo,
    user_id: user.id // Add the user_id to satisfy RLS policy
  };

  const result = await retryOperation(async () => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([supabaseTask])
    .select(`
      *,
      assigned_to_profile:profiles!assigned_to(
        id,
        full_name,
        email
      )
    `)
    .single();

    if (error) throw error;
    return data;
  });

  return {
    id: result.id,
    title: result.title,
    description: result.description || '',
    clientId: result.client_id,
    clientName: result.client_name,
    projectId: result.project_id,
    milestoneId: result.milestone_id,
    estimatedHours: result.estimated_hours,
    actualHours: result.actual_hours,
    workedHours: result.worked_hours,
    status: result.status as 'pending' | 'in-progress' | 'completed',
    notes: result.notes || '',
    assets: result.assets || [],
    createdDate: result.created_date,
    completedDate: result.completed_date || undefined,
    startDate: result.start_date || undefined,
    endDate: result.end_date || undefined,
    assignedTo: result.assigned_to,
    assignedToName: result.assigned_to_profile?.full_name || null,
  };
};

export const updateTaskInDatabase = async (
  taskId: number, 
  status: Task['status'], 
  workedHours?: number
) => {
  const updateData: any = { status };
  
  if (status === 'completed') {
    updateData.completed_date = new Date().toISOString();
    if (workedHours) {
      updateData.worked_hours = workedHours;
    }
  }

  const { error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId);

  if (error) throw error;
};

export const deleteTaskFromDatabase = async (taskId: number) => {
  console.log('Attempting to delete task with ID:', taskId);
  
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .select(); // Return the deleted rows to confirm deletion

  console.log('Delete operation result:', { data, error });

  if (error) {
    console.error('Database deletion error:', error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  // Check if any rows were actually deleted
  if (!data || data.length === 0) {
    console.warn('No rows were deleted. Task may not exist or user may not have permission.');
    throw new Error('Task not found or insufficient permissions to delete');
  }

  console.log('Task successfully deleted from database:', data);
  return data;
};

export const editTaskInDatabase = async (taskId: number, updatedTask: UpdateTaskData) => {
  console.log('editTaskInDatabase called with:', { taskId, updatedTask });
  
  const supabaseUpdate: any = {};
  
  if (updatedTask.title) supabaseUpdate.title = updatedTask.title;
  if (updatedTask.description !== undefined) supabaseUpdate.description = updatedTask.description;
  if (updatedTask.clientId) supabaseUpdate.client_id = updatedTask.clientId;
  if (updatedTask.clientName) supabaseUpdate.client_name = updatedTask.clientName;
  if (updatedTask.projectId) supabaseUpdate.project_id = updatedTask.projectId;
  if (updatedTask.milestoneId !== undefined) supabaseUpdate.milestone_id = updatedTask.milestoneId;
  if (updatedTask.estimatedHours !== undefined) supabaseUpdate.estimated_hours = updatedTask.estimatedHours;
  if (updatedTask.notes !== undefined) supabaseUpdate.notes = updatedTask.notes;
  if (updatedTask.assets) supabaseUpdate.assets = updatedTask.assets;
  if (updatedTask.startDate !== undefined) supabaseUpdate.start_date = updatedTask.startDate;
  if (updatedTask.endDate !== undefined) supabaseUpdate.end_date = updatedTask.endDate;
  if (updatedTask.workedHours !== undefined) supabaseUpdate.worked_hours = updatedTask.workedHours;
  if (updatedTask.assignedTo !== undefined) supabaseUpdate.assigned_to = updatedTask.assignedTo;

  console.log('supabaseUpdate object:', supabaseUpdate);

  const { data, error } = await supabase
    .from('tasks')
    .update(supabaseUpdate)
    .eq('id', taskId)
    .select(`
      *,
      assigned_to_profile:profiles!assigned_to(
        id,
        full_name,
        email
      )
    `)
    .single();

  if (error) {
    console.error('Error updating task in database:', error);
    throw error;
  }
  
  console.log('Task updated successfully in database:', data);
  
  // Return the updated task with the joined profile data
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    clientId: data.client_id,
    clientName: data.client_name,
    projectId: data.project_id,
    milestoneId: data.milestone_id,
    estimatedHours: data.estimated_hours,
    actualHours: data.actual_hours,
    workedHours: data.worked_hours,
    status: data.status as 'pending' | 'in-progress' | 'completed',
    notes: data.notes || '',
    assets: data.assets || [],
    createdDate: data.created_date,
    completedDate: data.completed_date || undefined,
    startDate: data.start_date || undefined,
    endDate: data.end_date || undefined,
    assignedTo: data.assigned_to,
    assignedToName: data.assigned_to_profile?.full_name || null,
  };
};
