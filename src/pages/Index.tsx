import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import DashboardTasksTimeline from '@/components/DashboardTasksTimeline';
import ModalsContainer from '@/components/ModalsContainer';
import { useClients } from '@/hooks/useClients';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/hooks/useCurrency';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const Index = () => {
  const { displayCurrency } = useCurrency();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  const { clients, addClient, updateClient } = useClients();
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const { projects } = useProjects();
  const { tasks, addTask, updateTask, deleteTask, editTask } = useTasks();
  const { milestones } = useMilestones();
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);
  const { isMobile } = useSidebar();

  // Listen for currency changes to force refresh
  useEffect(() => {
    const handleCurrencyChange = () => {
      setForceRefresh(prev => prev + 1);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  const handleEditSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          {isMobile && <SidebarTrigger />}
        </div>

        <DashboardHeader />

        <AnalyticsSection
          key={`analytics-${displayCurrency}-${forceRefresh}`} // Force re-render when currency changes
          totalClients={analytics.totalClients}
          activeClients={analytics.activeClients}
          totalHours={analytics.totalHours}
          totalRevenue={analytics.totalRevenue}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
          totalPaidToDate={analytics.totalPaidToDate}
          clients={clients}
          displayCurrency={displayCurrency}
          convertCurrency={convertCurrency}
          formatCurrency={formatCurrency}
          timeBreakdown={analytics.timeBreakdown}
          revenueBreakdown={analytics.revenueBreakdown}
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

        <ModalsContainer
          showClientModal={showClientModal}
          onCloseClientModal={() => setShowClientModal(false)}
          onAddClient={addClient}
          showSubscriptionModal={showSubscriptionModal}
          onCloseSubscriptionModal={() => setShowSubscriptionModal(false)}
          onAddSubscription={addSubscription}
          showEditSubscriptionModal={showEditSubscriptionModal}
          onCloseEditSubscriptionModal={() => setShowEditSubscriptionModal(false)}
          selectedSubscription={selectedSubscription}
          onUpdateSubscription={updateSubscription}
        />
      </div>
    </div>
  );
};

export default Index;