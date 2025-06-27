
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientsSection from '@/components/ClientsSection';
import ModalsContainer from '@/components/ModalsContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { useClients } from '@/hooks/useClients';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';

const ClientsPage = () => {
  const { displayCurrency, convert } = useCurrency();
  const [showClientModal, setShowClientModal] = React.useState(false);
  const {
    clients,
    addClient,
    updateClient
  } = useClients();
  const {
    subscriptions
  } = useSubscriptions();
  const analytics = useAnalytics();

  return (
    <DashboardContainer>
      <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
            </div>
            <Button onClick={() => setShowClientModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
          
          <ClientsSection 
            clients={clients} 
            onUpdateClient={updateClient} 
            displayCurrency={displayCurrency} 
            convertCurrency={convert} 
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
    </DashboardContainer>
  );
};

export default ClientsPage;
