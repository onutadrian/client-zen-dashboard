
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
import { useHourEntries } from '@/hooks/useHourEntries';
import { useUsers } from '@/hooks/useUsers';
import { useCurrency } from '@/hooks/useCurrency';
import TaskStatusSelect from './TaskStatusSelect';
import TaskActionButtons from './TaskActionButtons';

interface Client {
  id: number;
  name: string;
  priceType: string;
  hourEntries?: Array<{
    id: number;
    hours: number;
    description: string;
    date: string;
    billed?: boolean;
  }>;
}

interface Project {
  id: string;
  name: string;
  clientId: number;
  pricingType?: 'fixed' | 'hourly' | 'daily';
}

interface TaskTableRowProps {
  task: Task;
  clients: Client[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onUpdateTask?: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask?: (taskId: number) => void;
  onEditTask?: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: Task['status']) => void;
  readOnly?: boolean;
}

const TaskTableRow = ({
  task,
  clients,
  projects,
  onTaskClick,
  onDeleteTask,
  onEditTask,
  onStatusChange,
  readOnly = false
}: TaskTableRowProps) => {
  const { isAdmin } = useAuth();
  const { hourEntries } = useHourEntries();
  const { demoMode } = useCurrency();
  const { users } = useUsers();

  // Fallback resolve for assigned user name if not present on the task object
  const resolvedAssigneeName = React.useMemo(() => {
    if (task.assignedToName) return task.assignedToName;
    if (!task.assignedTo) return undefined;
    const u = users.find(u => u.id === task.assignedTo);
    return u ? (u.full_name || u.email || undefined) : undefined;
  }, [task.assignedToName, task.assignedTo, users]);

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const projectPricingType = React.useMemo(() => {
    if (!task.projectId) return undefined;
    const project = projects.find(p => p.id === task.projectId);
    return project?.pricingType;
  }, [projects, task.projectId]);

  const isFixedPriceProject = projectPricingType === 'fixed';

  const taskHourEntries = React.useMemo(
    () => hourEntries.filter((entry) => entry.taskId === task.id),
    [hourEntries, task.id]
  );

  const isBilled = React.useMemo(
    () => taskHourEntries.some((entry) => entry.billed === true),
    [taskHourEntries]
  );

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
    <TableRow 
      className="cursor-pointer hover:bg-slate-50" 
      onClick={() => onTaskClick(task)}
    >
      <TableCell className="font-medium">
        <div>
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
                      variant="secondary"
                      className={isBilled ? "ui-pill ui-pill--success" : "ui-pill ui-pill--neutral"}
                    >
                      {isBilled ? "Billed" : "Not Billed"}
                    </Badge>
                  )}
                </>
              )}
            </div>
          )}
          <p className="font-semibold">{task.title}</p>
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-1 mt-1">{task.description}</p>
          )}
        </div>
      </TableCell>
      <TableCell>{task.clientName}</TableCell>
      <TableCell>
        <span className="text-sm text-slate-600">
          {getProjectName(task.projectId)}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {resolvedAssigneeName ? (
            <div>
              <p className="font-medium text-slate-700">{resolvedAssigneeName}</p>
              <p className="text-slate-500 text-xs">Assigned</p>
            </div>
          ) : task.assignedTo ? (
            <p className="text-slate-500">Assigned</p>
          ) : (
            <p className="text-slate-500">Unassigned</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {task.workedHours && task.workedHours > 0 ? (
            <div className="text-green-600 font-medium">{task.workedHours}h</div>
          ) : (
            <div className="text-slate-400">-</div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-slate-600">
        {new Date(task.createdDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        {!readOnly && (
          <div onClick={(e) => e.stopPropagation()}>
            <TaskActionButtons
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
