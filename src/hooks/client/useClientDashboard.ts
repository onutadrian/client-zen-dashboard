import { useMemo } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { useClientData } from './useClientData';
import type { Task } from '@/types/task';
import type { Project } from '@/hooks/useProjects';

const toDateKey = (dateStr?: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const getTaskDateKey = (task: Task) => {
  return (
    toDateKey(task.completedDate) ||
    toDateKey(task.endDate) ||
    toDateKey(task.startDate) ||
    toDateKey(task.createdDate)
  );
};

export const useClientDashboard = () => {
  const { displayCurrency, convert } = useCurrency();
  const { client, projects, tasks, milestones, loading } = useClientData();

  const metrics = useMemo(() => {
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const totalWorkedHours = completedTasks.reduce((sum, t) => sum + (t.workedHours || 0), 0);
    const urgentWorkedHours = completedTasks.reduce(
      (sum, t) => sum + (t.urgent ? (t.workedHours || 0) : 0),
      0
    );

    const projectMap = new Map<string, Project>();
    projects.forEach(p => projectMap.set(p.id, p));

    let billableTotal = 0;
    let dailyDaysTotal = 0;

    const dailyProjectDayKeys = new Map<string, Set<string>>();

    completedTasks.forEach(task => {
      const project = task.projectId ? projectMap.get(task.projectId) : undefined;
      if (!project) return;

      if (project.pricingType === 'hourly') {
        const rate = task.urgent && project.urgentHourlyRate
          ? project.urgentHourlyRate
          : (project.hourlyRate || 0);
        const convertedRate = convert(rate, project.currency, displayCurrency);
        billableTotal += (task.workedHours || 0) * convertedRate;
      }

      if (project.pricingType === 'daily') {
        const dayKey = getTaskDateKey(task);
        if (!dayKey) return;
        if (!dailyProjectDayKeys.has(project.id)) {
          dailyProjectDayKeys.set(project.id, new Set());
        }
        dailyProjectDayKeys.get(project.id)!.add(dayKey);
      }
    });

    dailyProjectDayKeys.forEach((days, projectId) => {
      const project = projectMap.get(projectId);
      if (!project || project.pricingType !== 'daily' || !project.dailyRate) return;
      const convertedRate = convert(project.dailyRate, project.currency, displayCurrency);
      dailyDaysTotal += days.size;
      billableTotal += days.size * convertedRate;
    });

    const hasBillableProjects = projects.some(p => p.pricingType !== 'fixed');

    return {
      inProgressTasks,
      pendingTasks,
      completedTasks,
      totalWorkedHours,
      urgentWorkedHours,
      dailyDaysTotal,
      billableTotal,
      hasBillableProjects
    };
  }, [tasks, projects, displayCurrency, convert]);

  const nextUpTasks = useMemo(() => {
    const pending = metrics.pendingTasks.slice();
    return pending.sort((a, b) => {
      const aDate = getTaskDateKey(a) || '';
      const bDate = getTaskDateKey(b) || '';
      return aDate.localeCompare(bDate);
    });
  }, [metrics.pendingTasks]);

  return {
    client,
    projects,
    tasks,
    milestones,
    loading,
    metrics,
    nextUpTasks,
    displayCurrency
  };
};
