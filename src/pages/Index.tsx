
import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
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
import ProjectTimeline from '@/components/ProjectTimeline';
import AdminSetupNotice from '@/components/AdminSetupNotice';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isMobile } = useSidebar();
  const { loading: authLoading, profile } = useAuth();
  const { isCheckingAdmin, needsAdminSetup, isAdmin } = useAdminCheck();
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

  const handleRefresh = () => {
    window.location.reload();
  };

  if (authLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsAdminSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <AdminSetupNotice onRefresh={handleRefresh} />
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

        <DashboardTasksTimeline
          projects={projects}
          tasks={tasks}
          milestones={milestones}
          clients={clients}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />

        <ProjectTimeline
          projects={projects}
          tasks={tasks}
          milestones={milestones}
          clients={clients}
        />
      </div>
    </div>
  );
};

export default Index;
