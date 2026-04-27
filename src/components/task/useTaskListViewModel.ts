import { useMemo } from 'react';
import type { Task } from '@/types/task';
import type { HourEntry } from '@/types/hourEntry';
import type { Project } from '@/hooks/useProjects';
import type { ProjectStatus } from '@/components/dashboard/ProjectStatusFilter';

export type TaskBillingState = 'billed' | 'unbilled' | 'unknown';
export type TaskListMode = 'dashboard' | 'project';

export interface EnrichedTask extends Task {
  displayDate: string;
  monthKey: string;
  monthLabel: string;
  taskHoursTotal: number;
  billingState: TaskBillingState;
  projectStatus?: ProjectStatus;
  projectPricingType?: Project['pricingType'];
}

export interface TaskMonthGroup {
  monthKey: string;
  monthLabel: string;
  tasks: EnrichedTask[];
}

export const TASK_STATUS_ORDER: Record<Task['status'], number> = {
  'in-progress': 0,
  pending: 1,
  completed: 2,
};

const toValidDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const getTaskDisplayDate = (task: Task) => {
  return (
    toValidDate(task.completedDate) ||
    toValidDate(task.endDate) ||
    toValidDate(task.startDate) ||
    toValidDate(task.createdDate) ||
    new Date(0)
  );
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getMonthLabel = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const buildEnrichedTask = (
  task: Task,
  project: Project | undefined,
  taskHourEntries: HourEntry[]
): EnrichedTask => {
  const displayDate = getTaskDisplayDate(task);
  const taskHoursTotal =
    taskHourEntries.length > 0
      ? taskHourEntries.reduce((sum, entry) => sum + entry.hours, 0)
      : (task.workedHours || 0);

  let billingState: TaskBillingState = 'unknown';
  if (project?.pricingType === 'hourly' || project?.pricingType === 'daily') {
    if (taskHourEntries.length > 0) {
      billingState = taskHourEntries.some(entry => !entry.billed) ? 'unbilled' : 'billed';
    }
  }

  return {
    ...task,
    displayDate: displayDate.toISOString(),
    monthKey: getMonthKey(displayDate),
    monthLabel: getMonthLabel(displayDate),
    taskHoursTotal,
    billingState,
    projectStatus: project?.status as ProjectStatus | undefined,
    projectPricingType: project?.pricingType,
  };
};

export const useTaskListViewModel = (
  tasks: Task[],
  projects: Project[],
  hourEntries: HourEntry[]
) => {
  return useMemo(() => {
    const projectMap = new Map(projects.map(project => [project.id, project]));
    const hourEntriesByTaskId = new Map<number, HourEntry[]>();

    hourEntries.forEach(entry => {
      if (!entry.taskId) return;
      const existing = hourEntriesByTaskId.get(entry.taskId) || [];
      existing.push(entry);
      hourEntriesByTaskId.set(entry.taskId, existing);
    });

    return tasks.map(task => {
      const project = task.projectId ? projectMap.get(task.projectId) : undefined;
      const taskEntries = hourEntriesByTaskId.get(task.id) || [];
      return buildEnrichedTask(task, project, taskEntries);
    });
  }, [tasks, projects, hourEntries]);
};

export const filterEnrichedTasks = ({
  tasks,
  mode,
  selectedProjectStatuses,
  selectedTaskStatus,
  selectedBilling,
}: {
  tasks: EnrichedTask[];
  mode: TaskListMode;
  selectedProjectStatuses: ProjectStatus[];
  selectedTaskStatus: 'all' | Task['status'];
  selectedBilling: 'all' | 'billed' | 'unbilled';
}) => {
  return tasks.filter(task => {
    if (mode === 'dashboard' && task.projectStatus) {
      if (!selectedProjectStatuses.includes(task.projectStatus)) {
        return false;
      }
    }

    if (mode === 'project' && selectedTaskStatus !== 'all' && task.status !== selectedTaskStatus) {
      return false;
    }

    if (selectedBilling !== 'all') {
      return task.billingState === selectedBilling;
    }

    return true;
  });
};

export const groupTasksByMonth = (tasks: EnrichedTask[]): TaskMonthGroup[] => {
  const sortedTasks = [...tasks].sort((a, b) => {
    const monthCompare = b.monthKey.localeCompare(a.monthKey);
    if (monthCompare !== 0) return monthCompare;

    const statusCompare = TASK_STATUS_ORDER[a.status] - TASK_STATUS_ORDER[b.status];
    if (statusCompare !== 0) return statusCompare;

    const dateCompare = b.displayDate.localeCompare(a.displayDate);
    if (dateCompare !== 0) return dateCompare;

    return b.id - a.id;
  });

  const groups = new Map<string, TaskMonthGroup>();
  sortedTasks.forEach(task => {
    const existing = groups.get(task.monthKey);
    if (existing) {
      existing.tasks.push(task);
      return;
    }

    groups.set(task.monthKey, {
      monthKey: task.monthKey,
      monthLabel: task.monthLabel,
      tasks: [task],
    });
  });

  return Array.from(groups.values());
};
