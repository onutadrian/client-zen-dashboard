import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from Supabase on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Task interface
      const transformedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        clientId: task.client_id,
        clientName: task.client_name,
        projectId: task.project_id,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours,
        status: task.status as 'pending' | 'in-progress' | 'completed',
        notes: task.notes || '',
        assets: task.assets || [],
        createdDate: task.created_date,
        completedDate: task.completed_date || undefined,
        startDate: task.start_date || undefined,
        endDate: task.end_date || undefined
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => {
    try {
      // Use the provided project_id or generate a temporary one
      const projectId = newTask.projectId || '00000000-0000-0000-0000-000000000000';

      const supabaseTask = {
        title: newTask.title,
        description: newTask.description,
        client_id: newTask.clientId,
        client_name: newTask.clientName,
        project_id: projectId,
        estimated_hours: newTask.estimatedHours,
        status: 'pending',
        notes: newTask.notes,
        assets: newTask.assets,
        start_date: newTask.startDate,
        end_date: newTask.endDate
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([supabaseTask])
        .select()
        .single();

      if (error) throw error;

      const transformedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        clientId: data.client_id,
        clientName: data.client_name,
        projectId: data.project_id,
        estimatedHours: data.estimated_hours,
        actualHours: data.actual_hours,
        status: data.status as 'pending' | 'in-progress' | 'completed',
        notes: data.notes || '',
        assets: data.assets || [],
        createdDate: data.created_date,
        completedDate: data.completed_date || undefined,
        startDate: data.start_date || undefined,
        endDate: data.end_date || undefined
      };

      setTasks(prev => [...prev, transformedTask]);
      
      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (taskId: number, status: Task['status'], actualHours?: number) => {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString();
        if (actualHours) {
          updateData.actual_hours = actualHours;
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status };
          
          if (status === 'completed') {
            updatedTask.completedDate = new Date().toISOString();
            
            const hoursToLog = actualHours || task.estimatedHours;
            if (hoursToLog) {
              updatedTask.actualHours = hoursToLog;
            }
          }
          
          return updatedTask;
        }
        return task;
      }));

      toast({
        title: "Success",
        description: "Task updated successfully"
      });

      // Return the task and hours for client update
      const completedTask = tasks.find(t => t.id === taskId);
      if (status === 'completed' && completedTask) {
        const hoursToLog = actualHours || completedTask.estimatedHours;
        return { task: completedTask, hoursToLog };
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const editTask = async (taskId: number, updatedTask: Partial<Task>) => {
    try {
      const supabaseUpdate: any = {};
      
      if (updatedTask.title) supabaseUpdate.title = updatedTask.title;
      if (updatedTask.description !== undefined) supabaseUpdate.description = updatedTask.description;
      if (updatedTask.clientId) supabaseUpdate.client_id = updatedTask.clientId;
      if (updatedTask.clientName) supabaseUpdate.client_name = updatedTask.clientName;
      if (updatedTask.projectId) supabaseUpdate.project_id = updatedTask.projectId;
      if (updatedTask.estimatedHours !== undefined) supabaseUpdate.estimated_hours = updatedTask.estimatedHours;
      if (updatedTask.notes !== undefined) supabaseUpdate.notes = updatedTask.notes;
      if (updatedTask.assets) supabaseUpdate.assets = updatedTask.assets;
      if (updatedTask.startDate !== undefined) supabaseUpdate.start_date = updatedTask.startDate;
      if (updatedTask.endDate !== undefined) supabaseUpdate.end_date = updatedTask.endDate;

      const { error } = await supabase
        .from('tasks')
        .update(supabaseUpdate)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));

      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error) {
      console.error('Error editing task:', error);
      toast({
        title: "Error",
        description: "Failed to edit task",
        variant: "destructive"
      });
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    editTask
  };
};
