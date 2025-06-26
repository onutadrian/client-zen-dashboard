
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
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
}

interface TaskTableRowProps {
  task: Task;
  clients: Client[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

const TaskTableRow = ({
  task,
  clients,
  projects,
  onTaskClick,
  onDeleteTask,
  onEditTask,
  onStatusChange
}: TaskTableRowProps) => {
  const { isAdmin } = useAuth();

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const isBilled = (task: Task) => {
    const client = clients.find(c => c.id === task.clientId);
    if (!client || !client.hourEntries) return false;

    const taskDescription = `Completed task: ${task.title}`;
    const taskHourEntry = client.hourEntries.find(entry => 
      entry.description === taskDescription && entry.billed === true
    );

    return !!taskHourEntry;
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-slate-50" 
      onClick={() => onTaskClick(task)}
    >
      <TableCell className="font-medium">
        <div>
          <p className="font-semibold">{task.title}</p>
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
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
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <TaskStatusSelect
            status={task.status}
            onStatusChange={(newStatus) => onStatusChange(task, newStatus)}
          />
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
      {isAdmin && (
        <TableCell>
          <Badge 
            variant={isBilled(task) ? "default" : "secondary"}
            className={isBilled(task) ? "bg-green-100 text-green-800" : ""}
          >
            {isBilled(task) ? "Billed" : "Not Billed"}
          </Badge>
        </TableCell>
      )}
      <TableCell className="text-sm text-slate-600">
        {new Date(task.createdDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div onClick={(e) => e.stopPropagation()}>
          <TaskActionButtons
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
