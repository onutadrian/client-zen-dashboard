
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

  // Transform data for TaskTable component which expects different Task type
  const transformTaskForTaskTable = (task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    clientId: task.client_id,
    clientName: task.client_name,
    projectId: task.project_id,
    estimatedHours: task.estimated_hours || 0,
    actualHours: task.actual_hours || 0,
    workedHours: task.worked_hours || 0,
    status: task.status,
    notes: task.notes || '',
    assets: task.assets || [],
    createdDate: task.created_date,
    completedDate: task.completed_date || '',
    startDate: task.start_date || '',
    endDate: task.end_date || ''
  });

  // Transform data for ProjectTimeline component
  const transformProjectForTimeline = (project: any) => ({
    id: project.id,
    name: project.name,
    clientId: project.clientId,
    startDate: project.startDate,
    estimatedEndDate: project.estimatedEndDate,
    endDate: project.endDate,
    status: project.status,
    notes: project.notes,
    documents: project.documents,
    team: project.team,
    archived: project.archived,
    pricingType: project.pricingType,
    fixedPrice: project.fixedPrice,
    hourlyRate: project.hourlyRate,
    dailyRate: project.dailyRate,
    estimatedHours: project.estimatedHours,
    currency: project.currency,
    invoices: project.invoices
  });

  // Transform data for milestones
  const transformMilestoneForTimeline = (milestone: any) => ({
    id: milestone.id,
    projectId: milestone.projectId,
    title: milestone.title,
    description: milestone.description,
    targetDate: milestone.targetDate,
    status: milestone.status,
    amount: milestone.amount,
    currency: milestone.currency,
    completionPercentage: milestone.completionPercentage,
    estimatedHours: milestone.estimatedHours,
    createdAt: milestone.createdAt,
    updatedAt: milestone.updatedAt
  });

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

  const handleEditTask = (task: any) => {
    // Convert to expected format for the hook
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

  // Handle task table update - fix function signature to match TaskTable expectation
  const handleTaskTableUpdate = (taskId: number, updates: Partial<import('@/types/task').Task>) => {
    // Convert updates to the expected format for the main updateTask function
    if (updates.status) {
      updateTask(taskId, updates.status, updates.actualHours);
    }
  };

  const handleTaskTableEdit = (task: any) => {
    // Transform back to main Task type
    const transformedTask: Task = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      client_id: task.clientId,
      client_name: task.clientName,
      project_id: task.projectId,
      user_id: task.user_id,
      estimated_hours: task.estimatedHours,
      worked_hours: task.workedHours,
      actual_hours: task.actualHours,
      start_date: task.startDate,
      end_date: task.endDate,
      completed_date: task.completedDate,
      created_date: task.createdDate,
      notes: task.notes,
      assets: task.assets
    };
    
    const taskData = {
      title: transformedTask.title,
      description: transformedTask.description || '',
      clientId: transformedTask.client_id,
      clientName: transformedTask.client_name,
      projectId: transformedTask.project_id,
      estimatedHours: transformedTask.estimated_hours || 0,
      startDate: transformedTask.start_date || '',
      endDate: transformedTask.end_date || '',
      notes: transformedTask.notes || '',
      assets: transformedTask.assets || []
    };
    editTask(transformedTask.id, taskData);
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
              tasks={tasks.map((task: Task) => transformTaskForTaskTable(task))}
              clients={clients.map(client => ({
                id: client.id,
                name: client.name,
                priceType: client.priceType || 'hour',
                hourEntries: [] // TODO: Add hour entries data
              }))}
              projects={projects.map(project => ({
                id: project.id,
                name: project.name,
                clientId: project.clientId
              }))}
              onTaskClick={(task) => setSelectedTask({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                client_id: task.clientId,
                client_name: task.clientName,
                project_id: task.projectId || '',
                estimated_hours: task.estimatedHours,
                worked_hours: task.workedHours,
                actual_hours: task.actualHours,
                start_date: task.startDate,
                end_date: task.endDate,
                completed_date: task.completedDate,
                created_date: task.createdDate,
                notes: task.notes,
                assets: task.assets
              })}
              onUpdateTask={handleTaskTableUpdate}
              onDeleteTask={deleteTask}
              onEditTask={handleTaskTableEdit}
            />

            {/* Project Timeline for Admin */}
            <ProjectTimeline
              projects={projects.map(transformProjectForTimeline)}
              tasks={tasks}
              milestones={milestones.map(transformMilestoneForTimeline)}
              clients={clients}
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
