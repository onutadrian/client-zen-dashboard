
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskTableHeaderProps {
  taskCount: number;
  onAddTaskClick?: () => void;
}

const TaskTableHeader = ({ taskCount, onAddTaskClick }: TaskTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Tasks</h2>
        <p className="text-sm text-slate-600">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'} total
        </p>
      </div>
      {onAddTaskClick && (
        <Button 
          onClick={onAddTaskClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      )}
    </div>
  );
};

export default TaskTableHeader;
