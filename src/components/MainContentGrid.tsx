
import React from 'react';
import ClientsSection from '@/components/ClientsSection';
import SubscriptionsSection from '@/components/SubscriptionsSection';

interface MainContentGridProps {
  clients: any[];
  subscriptions: any[];
  analytics: any;
  displayCurrency: string;
  convertCurrency: (amount: number, from: string, to: string) => number;
  formatCurrency: (amount: number, currency: string) => string;
  updateClient: (clientId: number, client: any) => void;
  handleEditSubscription: (subscription: any) => void;
  setShowClientModal: (show: boolean) => void;
  setShowSubscriptionModal: (show: boolean) => void;
  totalPaidToDate: number;
}

const MainContentGrid = ({
  clients,
  subscriptions,
  analytics,
  displayCurrency,
  convertCurrency,
  formatCurrency,
  updateClient,
  handleEditSubscription,
  setShowClientModal,
  setShowSubscriptionModal,
  totalPaidToDate
}: MainContentGridProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <ClientsSection
        clients={clients}
        onUpdateClient={updateClient}
        displayCurrency={displayCurrency}
        convertCurrency={convertCurrency}
        formatCurrency={formatCurrency}
        activeClients={analytics.activeClients}
        onAddClient={() => setShowClientModal(true)}
      />

      <SubscriptionsSection
        subscriptions={subscriptions}
        onEditSubscription={handleEditSubscription}
        onAddSubscription={() => setShowSubscriptionModal(true)}
        monthlySubscriptionCost={analytics.monthlySubscriptionCost}
        totalPaidToDate={totalPaidToDate}
        displayCurrency={displayCurrency}
        formatCurrency={formatCurrency}
        billingFilter="all"
        onBillingFilterChange={() => {}}
      />
    </div>
  );
};

export default MainContentGrid;
