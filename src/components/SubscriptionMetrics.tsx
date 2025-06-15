
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { formatCurrency, convertCurrency } from '@/lib/currency';

interface Subscription {
  id: number;
  name: string;
  cost: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  status: string;
}

interface SubscriptionMetricsProps {
  subscriptions: Subscription[];
  displayCurrency: string;
}

const SubscriptionMetrics = ({ subscriptions, displayCurrency }: SubscriptionMetricsProps) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  const monthlyTotal = activeSubscriptions.reduce((total, subscription) => {
    const convertedCost = convertCurrency(subscription.cost, subscription.currency, displayCurrency);
    if (subscription.billingCycle === 'monthly') {
      return total + convertedCost;
    } else if (subscription.billingCycle === 'yearly') {
      return total + (convertedCost / 12);
    }
    return total;
  }, 0);

  const totalPaidToDate = subscriptions.reduce((total, subscription) => {
    const convertedCost = convertCurrency(subscription.cost, subscription.currency, displayCurrency);
    const startDate = new Date(subscription.startDate);
    const now = new Date();
    const monthsActive = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    if (subscription.billingCycle === 'monthly') {
      return total + (convertedCost * monthsActive);
    } else if (subscription.billingCycle === 'yearly') {
      const yearsActive = Math.floor(monthsActive / 12);
      return total + (convertedCost * yearsActive);
    }
    return total;
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
