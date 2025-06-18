import React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubscriptionsSection from '@/components/SubscriptionsSection';
import SubscriptionMetrics from '@/components/SubscriptionMetrics';
import ModalsContainer from '@/components/ModalsContainer';
import LogoutButton from '@/components/LogoutButton';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useClients } from '@/hooks/useClients';
import { convertCurrency, formatCurrency } from '@/lib/currency';
const SubscriptionsPage = () => {
  const [displayCurrency, setDisplayCurrency] = React.useState('USD');
  const [showSubscriptionModal, setShowSubscriptionModal] = React.useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState(null);
  const {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription
  } = useSubscriptions();
  const {
    clients
  } = useClients();
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);
  const {
    isMobile
  } = useSidebar();

  // Calculate total paid to date for all subscriptions
  const totalPaidToDate = subscriptions.reduce((sum, sub) => {
    const totalPaid = sub.total_paid || 0;
    const convertedTotal = convertCurrency(totalPaid, sub.currency || 'USD', displayCurrency);
    return sum + convertedTotal;
  }, 0);
  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };
  if (loading) {
    return <div className="min-h-screen p-6" style={{
      backgroundColor: '#F3F3F2'
    }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobile && <SidebarTrigger />}
              <h1 className="text-3xl font-bold text-slate-800">Subscriptions</h1>
            </div>
            <LogoutButton />
          </div>
          <div className="text-center py-8">
            <p className="text-slate-600">Loading subscriptions...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen p-6" style={{
    backgroundColor: '#F3F3F2'
  }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Subscriptions</h1>
          </div>
          <div className="flex items-center space-x-3">
            <LogoutButton />
            <Button onClick={() => setShowSubscriptionModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>
        
        {/* Metrics Cards */}
        <SubscriptionMetrics subscriptions={subscriptions} displayCurrency={displayCurrency} />
        
        <SubscriptionsSection subscriptions={subscriptions} onEditSubscription={handleEditSubscription} onAddSubscription={() => setShowSubscriptionModal(true)} monthlySubscriptionCost={analytics.monthlySubscriptionCost} totalPaidToDate={totalPaidToDate} displayCurrency={displayCurrency} formatCurrency={formatCurrency} />

        <ModalsContainer showClientModal={false} onCloseClientModal={() => {}} onAddClient={() => {}} showSubscriptionModal={showSubscriptionModal} onCloseSubscriptionModal={() => setShowSubscriptionModal(false)} onAddSubscription={addSubscription} showEditSubscriptionModal={showEditSubscriptionModal} onCloseEditSubscriptionModal={() => {
        setShowEditSubscriptionModal(false);
        setSelectedSubscription(null);
      }} selectedSubscription={selectedSubscription} onUpdateSubscription={updateSubscription} />
      </div>
    </div>;
};
export default SubscriptionsPage;