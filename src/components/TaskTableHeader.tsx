import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
interface TaskTableHeaderProps {
  taskCount: number;
  onAddTaskClick?: () => void;
}
const TaskTableHeader = ({
  taskCount,
  onAddTaskClick
}: TaskTableHeaderProps) => {
  return <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Tasks</h2>
        <p className="text-sm text-slate-600">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'} total
        </p>
      </div>
      {onAddTaskClick && <Button onClick={onAddTaskClick} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 rounded-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>}
    </div>;
};
export default TaskTableHeader;