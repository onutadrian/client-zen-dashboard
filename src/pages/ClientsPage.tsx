
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ClientsSection from '@/components/ClientsSection';
import ModalsContainer from '@/components/ModalsContainer';
import { useClients } from '@/hooks/useClients';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const ClientsPage = () => {
  const [displayCurrency, setDisplayCurrency] = React.useState('USD');
  const [showClientModal, setShowClientModal] = React.useState(false);
  
  const { clients, addClient, updateClient } = useClients();
  const { subscriptions } = useSubscriptions();
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
        </div>
        
        <ClientsSection 
          clients={clients}
          onUpdateClient={updateClient}
          displayCurrency={displayCurrency}
          convertCurrency={convertCurrency}
          formatCurrency={formatCurrency}
          activeClients={analytics.activeClients}
          onAddClient={() => setShowClientModal(true)}
        />

        <ModalsContainer 
          showClientModal={showClientModal} 
          onCloseClientModal={() => setShowClientModal(false)} 
          onAddClient={addClient} 
          showSubscriptionModal={false} 
          onCloseSubscriptionModal={() => {}} 
          onAddSubscription={() => {}} 
          showEditSubscriptionModal={false} 
          onCloseEditSubscriptionModal={() => {}} 
          selectedSubscription={null} 
          onUpdateSubscription={() => {}} 
        />
      </div>
    </div>
  );
};

export default ClientsPage;
