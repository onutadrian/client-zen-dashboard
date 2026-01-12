import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'canceled';

interface ProjectStatusFilterProps {
  selectedStatuses: ProjectStatus[];
  onStatusChange: (statuses: ProjectStatus[]) => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; activeClass: string; inactiveClass: string }> = {
  active: {
    label: 'Active',
    activeClass: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
    inactiveClass: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
  paused: {
    label: 'Paused',
    activeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
    inactiveClass: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
  completed: {
    label: 'Completed',
    activeClass: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
    inactiveClass: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
  canceled: {
    label: 'Canceled',
    activeClass: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
    inactiveClass: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
};

const ProjectStatusFilter = ({ selectedStatuses, onStatusChange }: ProjectStatusFilterProps) => {
  const toggleStatus = (status: ProjectStatus) => {
    if (selectedStatuses.includes(status)) {
      // Don't allow deselecting all statuses
      if (selectedStatuses.length > 1) {
        onStatusChange(selectedStatuses.filter(s => s !== status));
      }
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Show:</span>
      <div className="flex gap-1.5">
        {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map(status => {
          const config = STATUS_CONFIG[status];
          const isSelected = selectedStatuses.includes(status);
          
          return (
            <Badge
              key={status}
              variant="outline"
              className={cn(
                'cursor-pointer transition-colors border',
                isSelected ? config.activeClass : config.inactiveClass
              )}
              onClick={() => toggleStatus(status)}
            >
              {config.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusFilter;
