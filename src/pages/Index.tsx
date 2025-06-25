
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
import TaskTable from '@/components/TaskTable';
import ProjectTimeline from '@/components/ProjectTimeline';
import AddTaskModal from '@/components/AddTaskModal';
import { Loader2 } from 'lucide-react';
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

  // State for modals
  const [selectedTask, setSelectedTask] = useState<HookTask | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

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

        {/* Task Management Table with Add Task button */}
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
          onUpdateTask={handleUpdateTask}
          onDeleteTask={deleteTask}
          onEditTask={handleEditTask}
          onAddTaskClick={() => setShowAddTaskModal(true)}
        />

        {/* Gantt Chart Timeline View */}
        <ProjectTimeline
          projects={projects.map(project => ({
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
          }))}
          tasks={tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            status: task.status,
            projectId: task.projectId || '',
            clientId: task.clientId,
            clientName: task.clientName,
            estimatedHours: task.estimatedHours,
            actualHours: task.actualHours,
            workedHours: task.workedHours,
            startDate: task.startDate,
            endDate: task.endDate,
            completedDate: task.completedDate,
            createdDate: task.createdDate,
            notes: task.notes,
            assets: task.assets
          }))}
          milestones={milestones.map(milestone => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description || '',
            projectId: milestone.projectId,
            status: milestone.status,
            targetDate: milestone.targetDate,
            amount: milestone.amount,
            currency: milestone.currency || 'USD',
            estimatedHours: milestone.estimatedHours,
            completionPercentage: milestone.completionPercentage,
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt
          }))}
          clients={clients.map(client => ({
            id: client.id,
            name: client.name
          }))}
        />

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onAdd={handleAddTask}
          clients={clients.map(client => ({
            id: client.id,
            name: client.name,
            priceType: client.priceType || 'hour'
          }))}
          projects={projects.map(project => ({
            id: project.id,
            name: project.name,
            clientId: project.clientId
          }))}
        />
      </div>
    </div>
  );
};

export default Index;
