
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';

interface TaskActionButtonsProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskActionButtons = ({ task, onEditTask, onDeleteTask }: TaskActionButtonsProps) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEditTask(task)}
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDeleteTask(task.id)}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskActionButtons;
