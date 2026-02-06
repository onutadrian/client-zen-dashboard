
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
      <Badge className="ui-pill ui-pill--neutral">
        {stats.pending} Pending
      </Badge>
      <Badge className="ui-pill ui-pill--info">
        {stats.inProgress} In Progress
      </Badge>
      <Badge className="ui-pill ui-pill--success">
        {stats.completed} Completed
      </Badge>
    </div>
  );
};

export default TaskStats;
