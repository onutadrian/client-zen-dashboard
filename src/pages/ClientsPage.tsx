
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientsSection from '@/components/ClientsSection';
import CardListSkeleton from '@/components/skeletons/CardListSkeleton';
import ModalsContainer from '@/components/ModalsContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { useClients } from '@/hooks/useClients';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/hooks/useAuth';

const ClientsPage = () => {
  const { displayCurrency, convert } = useCurrency();
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const [showClientModal, setShowClientModal] = React.useState(false);
  const {
    clients,
    addClient,
    updateClient,
    updateClientInvoiceStatus,
    loading: clientsLoading
  } = useClients();
  const {
    subscriptions
  } = useSubscriptions();
  const analytics = useAnalytics();

  if (role === 'client') {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
            <p className="text-slate-600">Clients cannot access this page.</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
            </div>
            <Button variant="primary" onClick={() => setShowClientModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
          
          {clientsLoading ? (
            <CardListSkeleton count={3} lines={4} />
          ) : (
            <ClientsSection 
              clients={clients} 
              onUpdateClient={updateClient} 
              displayCurrency={displayCurrency} 
              convertCurrency={convert} 
              formatCurrency={formatCurrency} 
              activeClients={analytics.activeClients} 
              onAddClient={() => setShowClientModal(true)} 
              onInvoiceStatusUpdate={updateClientInvoiceStatus}
            />
          )}

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
