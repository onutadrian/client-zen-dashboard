
import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useClients } from '@/hooks/useClients';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import DashboardTasksTimeline from '@/components/DashboardTasksTimeline';
import TaskTable from '@/components/TaskTable';
import { Loader2 } from 'lucide-react';
import type { Task as MainTask, Project as MainProject, Milestone as MainMilestone, Client as MainClient } from '@/types';
import type { Task as HookTask } from '@/types/task';

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
  const [selectedTask, setSelectedTask] = useState<HookTask | null>(null);

  // Transform data for TaskTable component
  const transformTaskForTaskTable = (task: HookTask) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    clientId: task.clientId,
    clientName: task.clientName,
    projectId: task.projectId || '',
    estimatedHours: task.estimatedHours || 0,
    actualHours: task.actualHours || 0,
    workedHours: task.workedHours || 0,
    status: task.status,
    notes: task.notes || '',
    assets: task.assets || [],
    createdDate: task.createdDate,
    completedDate: task.completedDate || '',
    startDate: task.startDate || '',
    endDate: task.endDate || ''
  });

  // Transform HookTask to MainTask for DashboardTasksTimeline
  const transformTaskForTimeline = (task: HookTask): MainTask => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    client_id: task.clientId,
    client_name: task.clientName,
    project_id: task.projectId || '',
    user_id: '',
    estimated_hours: task.estimatedHours || 0,
    worked_hours: task.workedHours || 0,
    actual_hours: task.actualHours || 0,
    start_date: task.startDate || '',
    end_date: task.endDate || '',
    completed_date: task.completedDate || '',
    created_date: task.createdDate,
    notes: task.notes || '',
    assets: task.assets || []
  });

  // Transform hook Project to MainProject for DashboardTasksTimeline
  const transformProjectForDashboard = (project: any): MainProject => ({
    id: project.id,
    name: project.name,
    client_id: project.clientId,
    user_id: '',
    status: project.status,
    pricing_type: project.pricingType,
    fixed_price: project.fixedPrice,
    hourly_rate: project.hourlyRate,
    daily_rate: project.dailyRate,
    currency: project.currency,
    estimated_hours: project.estimatedHours,
    start_date: project.startDate,
    estimated_end_date: project.estimatedEndDate,
    end_date: project.endDate,
    created_at: '',
    updated_at: '',
    archived: project.archived,
    team: project.team,
    documents: project.documents,
    notes: project.notes,
    invoices: project.invoices
  });

  // Transform hook Milestone to MainMilestone for DashboardTasksTimeline
  const transformMilestoneForDashboard = (milestone: any): MainMilestone => ({
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || '',
    project_id: milestone.projectId,
    user_id: '',
    status: milestone.status,
    target_date: milestone.targetDate,
    amount: milestone.amount,
    currency: milestone.currency || 'USD',
    estimated_hours: milestone.estimatedHours,
    completion_percentage: milestone.completionPercentage,
    created_at: milestone.createdAt,
    updated_at: milestone.updatedAt
  });

  // Transform hook Client to MainClient for DashboardTasksTimeline
  const transformClientForDashboard = (client: any): MainClient => ({
    id: client.id,
    name: client.name,
    user_id: '',
    status: client.status,
    price_type: client.priceType,
    price: client.price,
    currency: client.currency,
    created_at: '',
    updated_at: '',
    people: client.people,
    documents: client.documents,
    invoices: client.invoices,
    links: client.links,
    notes: client.notes
  });

  // Create wrapper functions to match expected interfaces
  const handleAddTask = (task: Omit<HookTask, 'id' | 'createdDate'>) => {
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
    addTask(taskData);
  };

  const handleUpdateTask = (taskId: number, status: HookTask['status'], actualHours?: number) => {
    updateTask(taskId, status, actualHours);
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

  // Handle task table update - TaskTable expects this signature
  const handleTaskTableUpdate = (taskId: number, status: import('@/types/task').Task['status'], actualHours?: number) => {
    updateTask(taskId, status, actualHours);
  };

  const handleTaskTableEdit = (task: any) => {
    const transformedTask: HookTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      clientId: task.clientId,
      clientName: task.clientName,
      projectId: task.projectId,
      estimatedHours: task.estimatedHours,
      workedHours: task.workedHours,
      actualHours: task.actualHours,
      startDate: task.startDate,
      endDate: task.endDate,
      completedDate: task.completedDate,
      createdDate: task.createdDate,
      notes: task.notes,
      assets: task.assets
    };
    
    const taskData = {
      title: transformedTask.title,
      description: transformedTask.description || '',
      clientId: transformedTask.clientId,
      clientName: transformedTask.clientName,
      projectId: transformedTask.projectId,
      estimatedHours: transformedTask.estimatedHours || 0,
      startDate: transformedTask.startDate || '',
      endDate: transformedTask.endDate || '',
      notes: transformedTask.notes || '',
      assets: transformedTask.assets || []
    };
    editTask(transformedTask.id, taskData);
  };

  // Create a wrapper for DashboardTasksTimeline that matches its expected signature
  const handleDashboardAddTask = (task: Omit<MainTask, 'id' | 'created_date'>) => {
    const hookTaskData = {
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
    addTask(hookTaskData);
  };

  const handleDashboardUpdateTask = (taskId: number, updates: Partial<MainTask>) => {
    if (updates.status) {
      updateTask(taskId, updates.status, updates.actual_hours);
    }
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

        {/* Admin Dashboard - Show TaskTable for detailed task management */}
        {isAdmin ? (
          <TaskTable
            tasks={tasks.map(transformTaskForTaskTable)}
            clients={clients.map(client => ({
              id: client.id,
              name: client.name,
              priceType: client.priceType || 'hour',
              hourEntries: []
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
            })}
            onUpdateTask={handleTaskTableUpdate}
            onDeleteTask={deleteTask}
            onEditTask={handleTaskTableEdit}
          />
        ) : (
          /* Standard User Dashboard - Simplified timeline view */
          <DashboardTasksTimeline
            projects={projects.map(transformProjectForDashboard)}
            tasks={tasks.map(transformTaskForTimeline)}
            milestones={milestones.map(transformMilestoneForDashboard)}
            clients={clients.map(transformClientForDashboard)}
            onAddTask={handleDashboardAddTask}
            onUpdateTask={handleDashboardUpdateTask}
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
