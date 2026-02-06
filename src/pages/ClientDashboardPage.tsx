import React, { useMemo, useState } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import ClientDashboardSummary from '@/components/client/ClientDashboardSummary';
import TimelineSection from '@/components/dashboard/TimelineSection';
import TaskDetailsSheet from '@/components/TaskDetailsSheet';
import { useClientDashboard } from '@/hooks/client/useClientDashboard';
import { useAuth } from '@/hooks/useAuth';
import TaskManagementSection from '@/components/dashboard/TaskManagementSection';
import { ProjectStatus } from '@/components/dashboard/ProjectStatusFilter';
import { useCurrency } from '@/hooks/useCurrency';
import type { Task } from '@/types/task';
import type { Project } from '@/hooks/useProjects';

const ClientDashboardPage = () => {
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(['active']);
  const { convert, displayCurrency: preferredCurrency } = useCurrency();
  const {
    client,
    projects,
    tasks,
    milestones,
    loading,
    metrics,
    nextUpTasks,
    displayCurrency
  } = useClientDashboard();

  const [selectedTask, setSelectedTask] = useState<any>(null);

  const filteredProjects = useMemo(
    () => projects.filter(project => selectedStatuses.includes(project.status as ProjectStatus)),
    [projects, selectedStatuses]
  );
  const filteredProjectIds = useMemo(
    () => new Set(filteredProjects.map(project => project.id)),
    [filteredProjects]
  );
  const filteredTasks = useMemo(
    () => tasks.filter(task => task.projectId && filteredProjectIds.has(task.projectId)),
    [tasks, filteredProjectIds]
  );
  const filteredMilestones = useMemo(
    () => milestones.filter(milestone => filteredProjectIds.has(milestone.projectId)),
    [milestones, filteredProjectIds]
  );

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

  const filteredMetrics = useMemo(() => {
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    const totalWorkedHours = completedTasks.reduce((sum, t) => sum + (t.workedHours || 0), 0);
    const urgentWorkedHours = completedTasks.reduce(
      (sum, t) => sum + (t.urgent ? (t.workedHours || 0) : 0),
      0
    );
    const standardWorkedHours = totalWorkedHours - urgentWorkedHours;

    const projectMap = new Map<string, Project>();
    filteredProjects.forEach(p => projectMap.set(p.id, p));

    let billableTotal = 0;
    let unbilledValue = 0;
    let urgentBillableTotal = 0;
    let standardBillableTotal = 0;
    let dailyDaysTotal = 0;
    const dailyProjectDayKeys = new Map<string, Set<string>>();

    completedTasks.forEach(task => {
      const project = task.projectId ? projectMap.get(task.projectId) : undefined;
      if (!project) return;

      if (project.pricingType === 'hourly') {
        const rate = task.urgent && project.urgentHourlyRate
          ? project.urgentHourlyRate
          : (project.hourlyRate || 0);
        const convertedRate = convert(rate, project.currency, preferredCurrency);
        const taskValue = (task.workedHours || 0) * convertedRate;
        billableTotal += taskValue;
        if (!task.billed) {
          unbilledValue += taskValue;
        }
        if (task.urgent) {
          urgentBillableTotal += taskValue;
        } else {
          standardBillableTotal += taskValue;
        }
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
      const convertedRate = convert(project.dailyRate, project.currency, preferredCurrency);
      dailyDaysTotal += days.size;
      const value = days.size * convertedRate;
      billableTotal += value;
      standardBillableTotal += value;
    });

    const hasBillableProjects = filteredProjects.some(p => p.pricingType !== 'fixed');

    return {
      inProgressTasks,
      pendingTasks,
      completedTasks,
      totalWorkedHours,
      urgentWorkedHours,
      standardWorkedHours,
      dailyDaysTotal,
      billableTotal,
      urgentBillableTotal,
      standardBillableTotal,
      unbilledValue,
      hasBillableProjects
    };
  }, [filteredTasks, filteredProjects, convert, preferredCurrency]);

  const filteredNextUpTasks = useMemo(() => {
    const pending = filteredMetrics.pendingTasks.slice();
    return pending.sort((a, b) => {
      const aDate = getTaskDateKey(a) || '';
      const bDate = getTaskDateKey(b) || '';
      return aDate.localeCompare(bDate);
    });
  }, [filteredMetrics.pendingTasks]);

  if (role !== 'client') {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
            <p className="text-slate-600">This area is for clients only.</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Client Dashboard</h1>
              <p className="text-slate-600">{client?.name || 'Your projects at a glance'}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-slate-600">Loading your dashboard...</div>
          ) : !client ? (
            <div className="text-slate-600">No client profile found for this account.</div>
          ) : (
            <>
              <ClientDashboardSummary
                inProgressTasks={filteredMetrics.inProgressTasks}
                nextUpTasks={filteredNextUpTasks}
                completedCount={filteredMetrics.completedTasks.length}
                totalWorkedHours={filteredMetrics.totalWorkedHours}
                urgentWorkedHours={filteredMetrics.urgentWorkedHours}
                standardWorkedHours={filteredMetrics.standardWorkedHours}
                dailyDaysTotal={filteredMetrics.dailyDaysTotal}
                billableTotal={filteredMetrics.billableTotal}
                urgentBillableTotal={filteredMetrics.urgentBillableTotal}
                standardBillableTotal={filteredMetrics.standardBillableTotal}
                unbilledValue={filteredMetrics.unbilledValue}
                displayCurrency={displayCurrency}
                showFinancials={filteredMetrics.hasBillableProjects}
              />

              <div className="space-y-4">
                <TaskManagementSection
                  tasks={tasks}
                  clients={client ? [client] : []}
                  projects={projects}
                  onTaskClick={(task) => setSelectedTask(task)}
                  selectedStatuses={selectedStatuses}
                  onStatusChange={setSelectedStatuses}
                  readOnly
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800">Project Timeline</h2>
                <TimelineSection
                  projects={filteredProjects as any}
                  tasks={filteredTasks as any}
                  milestones={filteredMilestones as any}
                  clients={client ? [client] : []}
                />
              </div>

              <TaskDetailsSheet
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                projects={filteredProjects as any}
              />
            </>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ClientDashboardPage;
