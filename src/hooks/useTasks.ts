import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { 
  loadTasksFromDatabase, 
  createTaskInDatabase, 
  updateTaskInDatabase, 
  deleteTaskFromDatabase, 
  editTaskInDatabase 
} from '@/services/taskService';
import { createHourEntryForCompletedTask } from '@/services/taskCompletionService';
import { supabase } from '@/integrations/supabase/client';

export const useTasks = (onHourEntryCreated?: () => void) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from Supabase on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      let allTasks = await loadTasksFromDatabase();

      // If user is not admin, filter tasks based on project assignments
      if (profile.role !== 'admin') {
        // Get user's assigned projects
        const { data: assignments, error: assignmentError } = await supabase
          .from('user_project_assignments')
          .select('project_id')
          .eq('user_id', user.id);

        if (assignmentError) throw assignmentError;

        const assignedProjectIds = assignments.map(a => a.project_id);
        
        // Filter tasks to only those from assigned projects
        allTasks = allTasks.filter(task => 
          task.projectId && assignedProjectIds.includes(task.projectId)
        );
      }

      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Connection Error",
        description: "Failed to load tasks. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  const addTask = async (newTask: CreateTaskData) => {
    try {
      const transformedTask = await createTaskInDatabase(newTask);
      setTasks(prev => [...prev, transformedTask]);
      
      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (taskId: number, status: Task['status'], workedHours?: number) => {
    try {
      await updateTaskInDatabase(taskId, status, workedHours);

      // Get the task for creating hour entry
      const completedTask = tasks.find(t => t.id === taskId);
      
      // If task completed with hours and has projectId, create hour entry
      if (status === 'completed' && workedHours && completedTask?.projectId) {
        try {
          await createHourEntryForCompletedTask(completedTask, workedHours);
          console.log('Hour entry created successfully for task:', taskId);
          
          // Trigger refresh of hour entries if callback provided
          if (onHourEntryCreated) {
            onHourEntryCreated();
          }
        } catch (hourError) {
          console.error('Error creating hour entry:', hourError);
          // Don't fail the task update if hour entry fails
          toast({
            title: "Warning",
            description: "Task completed but failed to log hours. You can manually add the time entry.",
            variant: "destructive"
          });
        }
      }

      // Update local state
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status };
          
          if (status === 'completed') {
            updatedTask.completedDate = new Date().toISOString();
            
            if (workedHours) {
              updatedTask.workedHours = workedHours;
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
      if (status === 'completed' && completedTask) {
        return { task: completedTask, hoursToLog: workedHours };
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
      await deleteTaskFromDatabase(taskId);
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

  const editTask = async (taskId: number, updatedTask: UpdateTaskData) => {
    try {
      await editTaskInDatabase(taskId, updatedTask);

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

// Re-export types for convenience
export type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
