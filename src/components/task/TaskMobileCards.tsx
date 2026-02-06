import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import TaskStatusSelect from '@/components/TaskStatusSelect';
import TaskActionButtons from '@/components/TaskActionButtons';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useHourEntries } from '@/hooks/useHourEntries';

interface Project {
  id: string;
  name: string;
  pricingType?: 'fixed' | 'hourly' | 'daily';
}

interface TaskMobileCardsProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: Task['status']) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  readOnly?: boolean;
}

const TaskMobileCards = ({
  tasks,
  projects,
  onTaskClick,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  readOnly = false
}: TaskMobileCardsProps) => {
  const { isAdmin } = useAuth();
  const { demoMode } = useCurrency();
  const { hourEntries } = useHourEntries();

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getProjectPricingType = (projectId?: string) => {
    if (!projectId) return undefined;
    const project = projects.find(p => p.id === projectId);
    return project?.pricingType;
  };

  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'ui-pill ui-pill--success';
      case 'in-progress':
        return 'ui-pill ui-pill--info';
      case 'pending':
        return 'ui-pill ui-pill--neutral';
      default:
        return 'ui-pill ui-pill--neutral';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const taskHourEntries = hourEntries.filter((entry) => entry.taskId === task.id);
        const isBilled = taskHourEntries.some((entry) => entry.billed === true);
        const isFixedPriceProject = getProjectPricingType(task.projectId) === 'fixed';

        return (
          <Card key={`task-card-${task.id}`} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => onTaskClick(task)}>
            <CardContent className="ui-card-content space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {(task.urgent || (isAdmin && task.status === 'completed')) && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {task.urgent && (
                        <Badge className="ui-pill ui-pill--danger">Urgent</Badge>
                      )}
                      {isAdmin && task.status === 'completed' && (
                        <>
                          {demoMode ? (
                            <Badge className="ui-pill ui-pill--neutral">—</Badge>
                          ) : isFixedPriceProject ? (
                            <Badge className="ui-pill ui-pill--info">Fixed price</Badge>
                          ) : (
                            <Badge
                              variant={isBilled ? "default" : "secondary"}
                              className={isBilled ? "ui-pill ui-pill--success" : "ui-pill ui-pill--neutral"}
                            >
                              {isBilled ? "Billed" : "Not Billed"}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <h4 className="font-semibold text-slate-900">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                  )}
                </div>
                {!readOnly && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <TaskActionButtons
                      task={task}
                      onEditTask={onEditTask}
                      onDeleteTask={onDeleteTask}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{task.clientName}</span>
                <span>•</span>
                <span>{getProjectName(task.projectId)}</span>
                <span>•</span>
                <span>{new Date(task.createdDate).toLocaleDateString()}</span>
                {task.workedHours && task.workedHours > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-700">{task.workedHours}h</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {task.assignedToName ? `Assigned to ${task.assignedToName}` : 'Unassigned'}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  {readOnly ? (
                    <Badge className={getStatusBadgeClass(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  ) : (
                    <TaskStatusSelect
                      status={task.status}
                      onStatusChange={(newStatus) => onStatusChange?.(task, newStatus)}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskMobileCards;
