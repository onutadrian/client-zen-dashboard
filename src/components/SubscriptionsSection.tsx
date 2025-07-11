import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SubscriptionCard from '@/components/SubscriptionCard';
interface Subscription {
  id: number;
  totalPaid?: number;
  currency?: string;
}
interface SubscriptionsSectionProps {
  subscriptions: Subscription[];
  onEditSubscription: (subscription: any) => void;
  onAddSubscription: () => void;
  monthlySubscriptionCost: number;
  totalPaidToDate: number;
  displayCurrency: string;
  formatCurrency: (amount: number, currency: string) => string;
}
const SubscriptionsSection = ({
  subscriptions,
  onEditSubscription,
  onAddSubscription,
  monthlySubscriptionCost,
  totalPaidToDate,
  displayCurrency,
  formatCurrency
}: SubscriptionsSectionProps) => {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
          Subscriptions
        </h2>
        <div className="flex items-center space-x-2">
          
          
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subscriptions.map(subscription => <SubscriptionCard key={subscription.id} subscription={subscription} onEdit={onEditSubscription} />)}
        
        {subscriptions.length === 0 && <Card className="border-dashed border-2 border-slate-300 col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <CreditCard className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-slate-500 text-center text-sm mb-3">No subscriptions tracked</p>
              <Button onClick={onAddSubscription} size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                Add Subscription
              </Button>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default SubscriptionsSection;