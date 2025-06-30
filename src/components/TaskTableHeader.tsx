
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

interface TaskTableHeaderProps {
  taskCount?: number;
  onAddTaskClick?: () => void;
}

const TaskTableHeader = ({ taskCount, onAddTaskClick }: TaskTableHeaderProps) => {
  const { isAdmin } = useAuth();
  const { demoMode } = useCurrency();

  return (
    <>
      {taskCount !== undefined && onAddTaskClick && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tasks ({taskCount})</h3>
          <Button onClick={onAddTaskClick} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Task</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Hours</TableHead>
          {isAdmin && !demoMode && <TableHead>Billing</TableHead>}
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
    </>
  );
};

export default TaskTableHeader;
