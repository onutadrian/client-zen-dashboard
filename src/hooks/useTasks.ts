
import { useTasksData } from './tasks/useTasksData';
import { useTasksOperations } from './tasks/useTasksOperations';

export const useTasks = (onHourEntryCreated?: () => void, onTaskDeleted?: () => void) => {
  const { tasks, setTasks, loadTasks, loading } = useTasksData();
  const { addTask, updateTask, deleteTask, editTask, addTaskTimeLog } = useTasksOperations(
    tasks,
    setTasks,
    loadTasks,
    onHourEntryCreated,
    onTaskDeleted
  );

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    editTask,
    addTaskTimeLog,
  };
};

export type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
