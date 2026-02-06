
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import SubscriptionsSection from '@/components/SubscriptionsSection';
import SubscriptionMetrics from '@/components/SubscriptionMetrics';
import ModalsContainer from '@/components/ModalsContainer';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import SubscriptionsSkeleton from '@/components/subscriptions/SubscriptionsSkeleton';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useClients } from '@/hooks/useClients';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/hooks/useAuth';

const SubscriptionsPage = () => {
  const { displayCurrency, convert } = useCurrency();
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = React.useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState(null);
  const [billingFilter, setBillingFilter] = React.useState<'all' | 'monthly' | 'yearly'>('all');
  const {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription
  } = useSubscriptions();
  const {
    clients
  } = useClients();
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

  // Filter subscriptions based on billing cycle
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (billingFilter === 'all') return true;
    return sub.billing_cycle === billingFilter;
  });

  // Calculate total paid to date for filtered subscriptions
  const totalPaidToDate = filteredSubscriptions.reduce((sum, sub) => {
    const totalPaid = sub.total_paid || 0;
    const convertedTotal = convert(totalPaid, sub.currency || 'USD', displayCurrency);
    return sum + convertedTotal;
  }, 0);
  
  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };
  
  if (loading) {
    return (
      <DashboardContainer>
        <div className="w-full">
          <div className="w-full">
            <SubscriptionsSkeleton />
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
              <h1 className="text-3xl font-bold text-slate-800">Subscriptions</h1>
            </div>
            <Button variant="primary" onClick={() => setShowSubscriptionModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </div>
          
          {/* Metrics Cards */}
          <SubscriptionMetrics 
            key={`metrics-${displayCurrency}-${forceRefresh}-${billingFilter}`}
            subscriptions={filteredSubscriptions} 
            displayCurrency={displayCurrency} 
          />
          
          <SubscriptionsSection 
            subscriptions={filteredSubscriptions} 
            onEditSubscription={handleEditSubscription} 
            onAddSubscription={() => setShowSubscriptionModal(true)} 
            monthlySubscriptionCost={analytics.monthlySubscriptionCost} 
            totalPaidToDate={totalPaidToDate} 
            displayCurrency={displayCurrency} 
            formatCurrency={formatCurrency}
            billingFilter={billingFilter}
            onBillingFilterChange={setBillingFilter}
          />

          <ModalsContainer 
            showClientModal={false} 
            onCloseClientModal={() => {}} 
            onAddClient={() => {}} 
            showSubscriptionModal={showSubscriptionModal} 
            onCloseSubscriptionModal={() => setShowSubscriptionModal(false)} 
            onAddSubscription={addSubscription} 
            showEditSubscriptionModal={showEditSubscriptionModal} 
            onCloseEditSubscriptionModal={() => {
              setShowEditSubscriptionModal(false);
              setSelectedSubscription(null);
            }} 
            selectedSubscription={selectedSubscription} 
            onUpdateSubscription={updateSubscription} 
          />
        </div>
      </div>
    </DashboardContainer>
  );
};

export default SubscriptionsPage;
