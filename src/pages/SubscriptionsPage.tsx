
import React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, TrendingUp } from 'lucide-react';
import SubscriptionsSection from '@/components/SubscriptionsSection';
import ModalsContainer from '@/components/ModalsContainer';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useClients } from '@/hooks/useClients';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const SubscriptionsPage = () => {
  const [displayCurrency, setDisplayCurrency] = React.useState('USD');
  const [showSubscriptionModal, setShowSubscriptionModal] = React.useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState(null);
  
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const { clients } = useClients();
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);
  const { isMobile } = useSidebar();

  // Calculate total paid to date for all subscriptions
  const totalPaidToDate = subscriptions.reduce((sum, sub) => {
    const convertedTotal = convertCurrency(sub.totalPaid || 0, sub.currency || 'USD', displayCurrency);
    return sum + convertedTotal;
  }, 0);

  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Subscriptions</h1>
          </div>
          <Button onClick={() => setShowSubscriptionModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Subscription Cost</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(analytics.monthlySubscriptionCost, displayCurrency)}/mo
              </div>
              <p className="text-xs text-muted-foreground">
                Total monthly recurring costs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid to Date</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalPaidToDate, displayCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total amount paid across all subscriptions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <SubscriptionsSection 
          subscriptions={subscriptions}
          onEditSubscription={handleEditSubscription}
          onAddSubscription={() => setShowSubscriptionModal(true)}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
          totalPaidToDate={totalPaidToDate}
          displayCurrency={displayCurrency}
          formatCurrency={formatCurrency}
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
  );
};

export default SubscriptionsPage;
