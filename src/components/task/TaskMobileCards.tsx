import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import TaskStatusSelect from '@/components/TaskStatusSelect';
import TaskActionButtons from '@/components/TaskActionButtons';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useHourEntries } from '@/hooks/useHourEntries';
import type { TaskBillingState } from '@/components/task/useTaskListViewModel';

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
  taskMetaById?: Record<number, { taskHoursTotal: number; billingState: TaskBillingState }>;
  showBillingBadges?: boolean;
}

const TaskMobileCards = ({
  tasks,
  projects,
  onTaskClick,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  readOnly = false,
  taskMetaById,
  showBillingBadges = false,
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
        const isFixedPriceProject = getProjectPricingType(task.projectId) === 'fixed';
        const taskMeta = taskMetaById?.[task.id];
        const taskHoursTotal = taskMeta
          ? taskMeta.taskHoursTotal
          : taskHourEntries.length > 0
            ? taskHourEntries.reduce((sum, entry) => sum + entry.hours, 0)
            : (task.workedHours || 0);
        const billingState: TaskBillingState = taskMeta
          ? taskMeta.billingState
          : taskHourEntries.length === 0
            ? 'unknown'
            : taskHourEntries.some((entry) => entry.billed === false)
              ? 'unbilled'
              : 'billed';
        const shouldShowBillingBadge = showBillingBadges
          ? billingState !== 'unknown'
          : isAdmin && task.status === 'completed';

        return (
          <Card key={`task-card-${task.id}`} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => onTaskClick(task)}>
            <CardContent className="ui-card-content space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {(task.urgent || shouldShowBillingBadge) && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {task.urgent && (
                        <Badge className="ui-pill ui-pill--danger">Urgent</Badge>
                      )}
                      {shouldShowBillingBadge && (
                        <>
                          {demoMode ? (
                            <Badge className="ui-pill ui-pill--neutral">—</Badge>
                          ) : isFixedPriceProject ? (
                            <Badge className="ui-pill ui-pill--info">Fixed price</Badge>
                          ) : (
                            <Badge
                              variant={billingState === 'billed' ? "default" : "secondary"}
                              className={billingState === 'billed' ? "ui-pill ui-pill--success" : "ui-pill ui-pill--neutral"}
                            >
                              {billingState === 'billed' ? "Billed" : "Unbilled"}
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
                {taskHoursTotal > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-700">{taskHoursTotal}h</span>
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
