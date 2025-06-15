import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import DashboardTasksTimeline from '@/components/DashboardTasksTimeline';
import SubscriptionMetrics from '@/components/SubscriptionMetrics';
import ModalsContainer from '@/components/ModalsContainer';
import { useClients } from '@/hooks/useClients';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useMilestones } from '@/hooks/useMilestones';
import { useAnalytics } from '@/hooks/useAnalytics';
import { convertCurrency, formatCurrency } from '@/lib/currency';
const Index = () => {
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  // Use custom hooks for state management
  const {
    clients,
    addClient,
    updateClient
  } = useClients();
  const {
    subscriptions,
    addSubscription,
    updateSubscription
  } = useSubscriptions();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    editTask
  } = useTasks();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject
  } = useProjects();
  const {
    milestones,
    addMilestone,
    updateMilestone
  } = useMilestones();

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Get analytics data
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);
  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };
  const handleTaskUpdate = async (taskId: number, status: any, actualHours?: number) => {
    const result = await updateTask(taskId, status, actualHours);

    // If task was completed and has hours, log them to the client
    if (result && result.hoursToLog) {
      const {
        task,
        hoursToLog
      } = result;
      const client = clients.find(c => c.id === task.clientId);
      if (client) {
        const newHourEntry = {
          id: Date.now(),
          hours: hoursToLog,
          description: `Completed task: ${task.title}`,
          date: new Date().toISOString(),
          billed: false
        };
        const updatedHourEntries = [...(client.hourEntries || []), newHourEntry];
        const updatedClient = {
          ...client,
          totalHours: updatedHourEntries.reduce((sum, entry) => sum + entry.hours, 0),
          hourEntries: updatedHourEntries
        };
        updateClient(client.id, updatedClient);
      }
    }
  };
  return <div className="min-h-screen p-6" style={{
    backgroundColor: '#F3F3F2'
  }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          
          <div className="flex-1">
            <DashboardHeader displayCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} onAddClient={() => setShowClientModal(true)} onAddSubscription={() => setShowSubscriptionModal(true)} />
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsSection totalClients={analytics.totalClients} activeClients={analytics.activeClients} totalHours={analytics.totalHours} totalRevenue={analytics.totalRevenue} monthlySubscriptionCost={analytics.monthlySubscriptionCost} clients={clients} displayCurrency={displayCurrency} convertCurrency={convertCurrency} formatCurrency={formatCurrency} />

        {/* Subscription Metrics */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Subscription Overview</h2>
          <SubscriptionMetrics subscriptions={subscriptions} displayCurrency={displayCurrency} />
        </div>

        {/* Merged Tasks and Timeline Section */}
        <DashboardTasksTimeline projects={projects} tasks={tasks} milestones={milestones} clients={clients} onAddTask={addTask} onUpdateTask={handleTaskUpdate} onDeleteTask={deleteTask} onEditTask={editTask} />

        {/* Modals */}
        <ModalsContainer showClientModal={showClientModal} onCloseClientModal={() => setShowClientModal(false)} onAddClient={addClient} showSubscriptionModal={showSubscriptionModal} onCloseSubscriptionModal={() => setShowSubscriptionModal(false)} onAddSubscription={addSubscription} showEditSubscriptionModal={showEditSubscriptionModal} onCloseEditSubscriptionModal={() => {
        setShowEditSubscriptionModal(false);
        setSelectedSubscription(null);
      }} selectedSubscription={selectedSubscription} onUpdateSubscription={updateSubscription} />
      </div>
    </div>;
};
export default Index;