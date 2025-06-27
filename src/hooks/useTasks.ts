
import { useTasksData } from './tasks/useTasksData';
import { useTasksOperations } from './tasks/useTasksOperations';

export const useTasks = (onHourEntryCreated?: () => void, onTaskDeleted?: () => void) => {
  const { tasks, setTasks } = useTasksData();
  const { addTask, updateTask, deleteTask, editTask } = useTasksOperations(
    tasks,
    setTasks,
    onHourEntryCreated,
    onTaskDeleted
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    editTask
  };
};

export type { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
