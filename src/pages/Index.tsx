
import React, { useState } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import Greeting from '@/components/Greeting';
import AnalyticsSection from '@/components/AnalyticsSection';
import UserAnalyticsSection from '@/components/UserAnalyticsSection';
import TaskManagementSection from '@/components/dashboard/TaskManagementSection';
import TaskDetailsSheet from '@/components/TaskDetailsSheet';
import TimelineSection from '@/components/dashboard/TimelineSection';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import type { Task as HookTask } from '@/types/task';
import type { ProjectStatus } from '@/components/dashboard/ProjectStatusFilter';

const Index = () => {
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
    clients
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

  if (authLoading) {
    return <DashboardContainer><div /></DashboardContainer>;
  }

  return (
    <DashboardContainer>
      <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="max-w-7xl mx-auto space-y-6">
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
            />
          ) : (
            <UserAnalyticsSection
              tasks={tasks}
              projects={projects}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              customDateRange={customDateRange}
              onCustomDateChange={setCustomDateRange}
            />
          )}

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

          <TimelineSection
            projects={filteredProjects}
            tasks={filteredTasks}
            milestones={filteredMilestones}
            clients={clients}
          />

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
