
import React, { useState } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import Greeting from '@/components/Greeting';
import AnalyticsSection from '@/components/AnalyticsSection';
import UserAnalyticsSection from '@/components/UserAnalyticsSection';
import TaskManagementSection from '@/components/dashboard/TaskManagementSection';
import TimelineSection from '@/components/dashboard/TimelineSection';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import type { Task as HookTask } from '@/types/task';

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
      assets: task.assets || []
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
      estimatedHours: task.estimatedHours || 0,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      notes: task.notes || '',
      assets: task.assets || []
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
      assets: task.assets
    });
  };

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
          />

          <TimelineSection
            projects={projects}
            tasks={tasks}
            milestones={milestones}
            clients={clients}
          />
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Index;
