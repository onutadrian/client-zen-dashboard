
import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import MainContentGrid from '@/components/MainContentGrid';
import ModalsContainer from '@/components/ModalsContainer';
import { useClients } from '@/hooks/useClients';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/hooks/useCurrency';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const Index = () => {
  const { displayCurrency, updateCurrency } = useCurrency();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const { clients, addClient } = useClients();
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);
  const { isMobile } = useSidebar();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          {isMobile && <SidebarTrigger />}
        </div>

        <DashboardHeader
          displayCurrency={displayCurrency}
          onCurrencyChange={updateCurrency}
          onAddClient={() => setShowClientModal(true)}
          onAddSubscription={() => setShowSubscriptionModal(true)}
        />

        <AnalyticsSection
          totalClients={analytics.totalClients}
          activeClients={analytics.activeClients}
          totalHours={analytics.totalHours}
          totalRevenue={analytics.totalRevenue}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
          totalPaidToDate={analytics.totalRevenue} // Using totalRevenue as totalPaidToDate
          clients={clients}
          displayCurrency={displayCurrency}
          convertCurrency={convertCurrency}
          formatCurrency={formatCurrency}
        />

        <MainContentGrid
          clients={clients}
          subscriptions={subscriptions}
          analytics={analytics}
          displayCurrency={displayCurrency}
          onEditSubscription={(subscription) => {
            setSelectedSubscription(subscription);
            setShowEditSubscriptionModal(true);
          }}
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
