
import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useClients } from '@/hooks/useClients';
import MainContentGrid from '@/components/MainContentGrid';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import DashboardTasksTimeline from '@/components/DashboardTasksTimeline';
import TaskTable from '@/components/TaskTable';
import ProjectTimeline from '@/components/ProjectTimeline';
import { Loader2 } from 'lucide-react';
import type { Task, Project, Milestone, Client } from '@/types';

const Index = () => {
  const { isMobile } = useSidebar();
  const { loading: authLoading, profile, isAdmin } = useAuth();
  
  // Period filtering
  const {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    dateRange
  } = usePeriodFilter();
  
  // Analytics with period support
  const analytics = useAnalytics({ dateRange });
  
  // Data hooks for dashboard sections
  const { projects } = useProjects();
  const { tasks, addTask, updateTask, deleteTask, editTask } = useTasks();
  const { milestones } = useMilestones();
  const { clients } = useClients();

  // State for task details modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Create wrapper functions to match expected interfaces
  const handleAddTask = (task: Omit<Task, 'id' | 'created_date'>) => {
    // Convert to expected format for the hook, adding missing required properties
    const taskData = {
      title: task.title,
      description: task.description || '',
      clientId: task.client_id,
      clientName: task.client_name,
      projectId: task.project_id,
      estimatedHours: task.estimated_hours || 0,
      startDate: task.start_date || '',
      endDate: task.end_date || '',
      notes: task.notes || '',
      assets: task.assets || []
    };
    addTask(taskData);
  };

  const handleUpdateTask = (taskId: number, status: Task['status'], actualHours?: number) => {
    updateTask(taskId, status, actualHours);
  };

  const handleEditTask = (task: Task) => {
    // Convert to expected format for the hook
    const taskData = {
      title: task.title,
      description: task.description || '',
      clientId: task.client_id,
      clientName: task.client_name,
      projectId: task.project_id,
      estimatedHours: task.estimated_hours || 0,
      startDate: task.start_date || '',
      endDate: task.end_date || '',
      notes: task.notes || '',
      assets: task.assets || []
    };
    editTask(task.id, taskData);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          </div>
        </div>

        <DashboardHeader />
        
        {/* Show analytics for admin users */}
        {isAdmin && (
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
          />
        )}

        {/* Admin Dashboard - Full featured view */}
        {isAdmin ? (
          <div className="space-y-6">
            {/* Tasks Table for Admin */}
            <TaskTable
              tasks={tasks as unknown as Task[]}
              clients={clients as unknown as any[]}
              projects={projects as unknown as any[]}
              onTaskClick={setSelectedTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />

            {/* Project Timeline for Admin */}
            <ProjectTimeline
              projects={projects as unknown as Project[]}
              tasks={tasks as unknown as Task[]}
              milestones={milestones as unknown as Milestone[]}
              clients={clients as unknown as Client[]}
            />

            {/* Main Content Grid for Admin */}
            <MainContentGrid
              clients={analytics.clients}
              subscriptions={[]} // TODO: Add subscriptions data
              analytics={analytics}
              displayCurrency={analytics.displayCurrency}
              convertCurrency={() => 0} // TODO: Add convert function
              formatCurrency={analytics.formatCurrency}
              updateClient={() => {}} // TODO: Add update function
              handleEditSubscription={() => {}} // TODO: Add edit function
              setShowClientModal={() => {}} // TODO: Add modal handlers
              setShowSubscriptionModal={() => {}} // TODO: Add modal handlers
              totalPaidToDate={analytics.totalPaidToDate}
            />
          </div>
        ) : (
          /* Standard User Dashboard - Simplified view */
          <DashboardTasksTimeline
            projects={projects as unknown as Project[]}
            tasks={tasks as unknown as Task[]}
            milestones={milestones as unknown as Milestone[]}
            clients={clients as unknown as Client[]}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={deleteTask}
            onEditTask={handleEditTask}
            hideFinancialColumns={true}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
