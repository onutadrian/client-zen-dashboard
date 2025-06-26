
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TaskStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const TaskStats = ({ stats }: TaskStatsProps) => {
  return (
    <div className="flex items-center space-x-4 pt-2">
      <Badge variant="secondary" className="hover:bg-secondary">
        {stats.pending} Pending
      </Badge>
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        {stats.inProgress} In Progress
      </Badge>
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {stats.completed} Completed
      </Badge>
    </div>
  );
};

export default TaskStats;
