
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
import { Loader2 } from 'lucide-react';
import type { Task, Project, Milestone, Client } from '@/types';

const Index = () => {
  const { isMobile } = useSidebar();
  const { loading: authLoading, profile, isAdmin } = useAuth();
  const { displayCurrency } = useCurrency();
  
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

  const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
    // Extract status from updates and call the hook with the expected signature
    const status = updates.status || 'pending';
    const workedHours = updates.worked_hours;
    updateTask(taskId, status, workedHours);
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
        
        {/* Only show analytics for admin users */}
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

        <DashboardTasksTimeline
          projects={projects as unknown as Project[]}
          tasks={tasks as unknown as Task[]}
          milestones={milestones as unknown as Milestone[]}
          clients={clients as unknown as Client[]}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={deleteTask}
          onEditTask={handleEditTask}
          hideFinancialColumns={!isAdmin}
        />
      </div>
    </div>
  );
};

export default Index;
