
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { Subscription } from '@/hooks/useSubscriptions';

interface SubscriptionMetricsProps {
  subscriptions: Subscription[];
  displayCurrency: string;
}

const SubscriptionMetrics = ({ subscriptions, displayCurrency }: SubscriptionMetricsProps) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  const monthlyTotal = activeSubscriptions.reduce((total, subscription) => {
    const convertedCost = convertCurrency(subscription.price, subscription.currency, displayCurrency);
    const totalSeats = subscription.seats || 1;
    return total + (convertedCost * totalSeats);
  }, 0);

  const totalPaidToDate = subscriptions.reduce((total, subscription) => {
    const convertedCost = convertCurrency(subscription.total_paid || 0, subscription.currency, displayCurrency);
    return total + convertedCost;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Subscription Cost</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyTotal, displayCurrency)}</div>
          <p className="text-xs text-muted-foreground">
            {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid to Date</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPaidToDate, displayCurrency)}</div>
          <p className="text-xs text-muted-foreground">
            Across all subscriptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionMetrics;
