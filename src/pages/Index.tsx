import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import DashboardTasksTimeline from '@/components/DashboardTasksTimeline';
import ModalsContainer from '@/components/ModalsContainer';
import PeriodFilter, { PeriodOption } from '@/components/PeriodFilter';
import { useClients } from '@/hooks/useClients';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  startOfYear, 
  endOfYear, 
  subYears,
  endOfDay
} from 'date-fns';

const Index = () => {
  const { displayCurrency } = useCurrency();
  const { isAdmin } = useAuth();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  
  // Period filter state
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('all-time');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // Calculate actual date range based on selected period
  const [calculatedDateRange, setCalculatedDateRange] = useState<{ startDate?: Date; endDate?: Date }>({
    startDate: undefined,
    endDate: undefined
  });

  const { clients, addClient, updateClient } = useClients();
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const { projects } = useProjects();
  const { tasks, addTask, updateTask, deleteTask, editTask } = useTasks();
  const { milestones } = useMilestones();
  const analytics = useAnalytics(
    clients, 
    subscriptions, 
    displayCurrency, 
    calculatedDateRange.startDate, 
    calculatedDateRange.endDate
  );
  const { isMobile } = useSidebar();

  // Calculate date range when period changes
  useEffect(() => {
    const today = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    switch (selectedPeriod) {
      case 'all-time':
        // No date filtering
        startDate = undefined;
        endDate = undefined;
        break;
      case 'this-month':
        startDate = startOfMonth(today);
        endDate = endOfDay(today);
        break;
      case 'last-month':
        const lastMonth = subMonths(today, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'this-year':
        startDate = startOfYear(today);
        endDate = endOfDay(today);
        break;
      case 'last-year':
        const lastYear = subYears(today, 1);
        startDate = startOfYear(lastYear);
        endDate = endOfYear(lastYear);
        break;
      case 'custom':
        startDate = customDateRange.from;
        endDate = customDateRange.to ? endOfDay(customDateRange.to) : undefined;
        break;
    }
    
    setCalculatedDateRange({ startDate, endDate });
  }, [selectedPeriod, customDateRange]);

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

        {isAdmin && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Dashboard Analytics</h2>
              <PeriodFilter
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                customDateRange={customDateRange}
                onCustomDateChange={setCustomDateRange}
              />
            </div>

            <AnalyticsSection
              key={`analytics-${displayCurrency}-${forceRefresh}-${selectedPeriod}`}
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
          </>
        )}

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