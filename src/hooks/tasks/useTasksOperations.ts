
import { useToast } from '@/hooks/use-toast';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { 
  createTaskInDatabase, 
  updateTaskInDatabase, 
  deleteTaskFromDatabase, 
  editTaskInDatabase 
} from '@/services/taskService';
import { createHourEntryForCompletedTask } from '@/services/taskCompletionService';

export const useTasksOperations = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onHourEntryCreated?: () => void,
  onTaskDeleted?: () => void
) => {
  const { toast } = useToast();

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

      const completedTask = tasks.find(t => t.id === taskId);
      
      if (status === 'completed' && workedHours && completedTask?.projectId) {
        try {
          await createHourEntryForCompletedTask(completedTask, workedHours);
          console.log('Hour entry created successfully for task:', taskId);
          
          if (onHourEntryCreated) {
            onHourEntryCreated();
          }
        } catch (hourError) {
          console.error('Error creating hour entry:', hourError);
          toast({
            title: "Warning",
            description: "Task completed but failed to log hours. You can manually add the time entry.",
            variant: "destructive"
          });
        }
      }

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
    console.log('useTasksOperations: deleteTask called with ID:', taskId);
    
    try {
      // First delete from database
      await deleteTaskFromDatabase(taskId);
      console.log('Database deletion successful, updating local state');
      
      // Then update local state
      setTasks(prev => {
        const newTasks = prev.filter(task => task.id !== taskId);
        console.log('Local state updated. Tasks before:', prev.length, 'Tasks after:', newTasks.length);
        return newTasks;
      });
      
      // Trigger callback to refresh analytics
      if (onTaskDeleted) {
        onTaskDeleted();
      }
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive"
      });
      
      // Don't update local state if database deletion failed
      throw error;
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
    addTask,
    updateTask,
    deleteTask,
    editTask
  };
};
