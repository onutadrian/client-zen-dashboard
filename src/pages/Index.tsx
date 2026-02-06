
import React, { useState, useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import Greeting from '@/components/Greeting';
import AnalyticsSection from '@/components/AnalyticsSection';
import UserAnalyticsSection from '@/components/UserAnalyticsSection';
import TaskManagementSection from '@/components/dashboard/TaskManagementSection';
import TaskDetailsSheet from '@/components/TaskDetailsSheet';
import TimelineSection from '@/components/dashboard/TimelineSection';
import CardListSkeleton from '@/components/skeletons/CardListSkeleton';
import AnalyticsSkeleton from '@/components/analytics/AnalyticsSkeleton';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import type { Task as HookTask } from '@/types/task';
import type { ProjectStatus } from '@/components/dashboard/ProjectStatusFilter';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const {
    authLoading,
    isAdmin,
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    analytics,
    projects,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    editTask,
    milestones,
    clients,
    profile,
    user,
    session,
    projectsLoading,
    tasksLoading,
    milestonesLoading,
    clientsLoading
  } = useDashboardData();

  const [selectedTask, setSelectedTask] = useState<HookTask | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(['active']);

  const handleAddTask = (task: Omit<HookTask, 'id' | 'createdDate'>) => {
    const taskData = {
      title: task.title,
      description: task.description || '',
      clientId: task.clientId,
      clientName: task.clientName,
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      estimatedHours: task.estimatedHours || 0,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      notes: task.notes || '',
      assets: task.assets || [],
      assignedTo: task.assignedTo,
      // Preserve urgent flag from the form
      urgent: task.urgent,
    };
    addTask(taskData);
  };

  const handleUpdateTask = (taskId: number, status: HookTask['status'], actualHours?: number) => {
    updateTask(taskId, status, actualHours);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
    // Trigger analytics refresh after task deletion
    if (isAdmin && analytics.refetch) {
      analytics.refetch();
    }
  };

  const handleEditTask = (task: any) => {
    const taskData = {
      title: task.title,
      description: task.description || '',
      clientId: task.clientId,
      clientName: task.clientName,
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      estimatedHours: task.estimatedHours || 0,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      notes: task.notes || '',
      assets: task.assets || [],
      assignedTo: task.assignedTo,
      // Preserve urgent flag during edit
      urgent: task.urgent,
    };
    editTask(task.id, taskData);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      clientId: task.clientId,
      clientName: task.clientName,
      projectId: task.projectId || '',
      estimatedHours: task.estimatedHours,
      workedHours: task.workedHours,
      actualHours: task.actualHours,
      startDate: task.startDate,
      endDate: task.endDate,
      completedDate: task.completedDate,
      createdDate: task.createdDate,
      notes: task.notes,
      assets: task.assets,
      urgent: task.urgent,
    });
  };

  // Keep the selected task in sync when the tasks array updates
  React.useEffect(() => {
    if (!selectedTask) return;
    const latest = tasks.find(t => t.id === selectedTask.id);
    if (latest) {
      setSelectedTask({
        id: latest.id,
        title: latest.title,
        description: latest.description,
        status: latest.status,
        clientId: latest.clientId,
        clientName: latest.clientName,
        projectId: latest.projectId || '',
        estimatedHours: latest.estimatedHours,
        workedHours: latest.workedHours,
        actualHours: latest.actualHours,
        startDate: latest.startDate,
        endDate: latest.endDate,
        completedDate: latest.completedDate,
        createdDate: latest.createdDate,
        notes: latest.notes,
        assets: latest.assets,
        urgent: latest.urgent,
      } as any);
    }
  }, [tasks, selectedTask?.id]);

  // Filter projects and tasks by selected statuses
  const filteredProjects = projects.filter(project => 
    selectedStatuses.includes(project.status as ProjectStatus)
  );
  const filteredProjectIds = new Set(filteredProjects.map(p => p.id));
  const filteredTasks = tasks.filter(task => 
    task.projectId && filteredProjectIds.has(task.projectId)
  );
  const filteredMilestones = milestones.filter(milestone =>
    filteredProjectIds.has(milestone.projectId)
  );

  useEffect(() => {
    const role =
      profile?.role ??
      (session?.user?.user_metadata?.role as string | undefined) ??
      (user?.user_metadata?.role as string | undefined);

    if (role === 'client') {
      navigate('/client', { replace: true });
    }
  }, [profile?.role, session?.user?.user_metadata?.role, user?.user_metadata?.role, navigate]);

  if (authLoading) {
    return <DashboardContainer><div /></DashboardContainer>;
  }

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <Greeting />
          
          {isAdmin ? (
            <AnalyticsSection 
              totalClients={analytics.totalClients}
              activeClients={analytics.activeClients}
              totalHours={analytics.totalHours}
              totalRevenue={analytics.totalRevenue}
              monthlySubscriptionCost={analytics.monthlySubscriptionCost}
              totalPaidToDate={analytics.totalPaidToDate}
              clients={analytics.clients}
              displayCurrency={analytics.displayCurrency}
              formatCurrency={analytics.formatCurrency}
              timeBreakdown={analytics.timeBreakdown}
              revenueBreakdown={analytics.revenueBreakdown}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              customDateRange={customDateRange}
              onCustomDateChange={setCustomDateRange}
              previousPeriodData={analytics.previousPeriodData}
              comparisonText={analytics.comparisonText}
              loading={analytics.loading}
            />
          ) : (
            (projectsLoading || tasksLoading ? (
              <AnalyticsSkeleton />
            ) : (
              <UserAnalyticsSection
                tasks={tasks}
                projects={projects}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                customDateRange={customDateRange}
                onCustomDateChange={setCustomDateRange}
              />
            ))
          )}

          {(tasksLoading || clientsLoading || projectsLoading) ? (
            <CardListSkeleton count={3} lines={5} />
          ) : (
            <TaskManagementSection
              tasks={tasks}
              clients={clients}
              projects={projects}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onAddTask={handleAddTask}
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
          )}

          {(projectsLoading || tasksLoading || milestonesLoading || clientsLoading) ? (
            <CardListSkeleton count={2} lines={6} />
          ) : (
            <TimelineSection
              projects={filteredProjects}
              tasks={filteredTasks}
              milestones={filteredMilestones}
              clients={clients}
            />
          )}

          <TaskDetailsSheet
            task={selectedTask as any}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            projects={projects as any}
          />
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Index;
