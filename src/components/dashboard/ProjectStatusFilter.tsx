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
    activeClass: 'ui-pill ui-pill--success',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  paused: {
    label: 'Paused',
    activeClass: 'ui-pill ui-pill--warning',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  completed: {
    label: 'Completed',
    activeClass: 'ui-pill ui-pill--info',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  canceled: {
    label: 'Canceled',
    activeClass: 'ui-pill ui-pill--danger',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
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
