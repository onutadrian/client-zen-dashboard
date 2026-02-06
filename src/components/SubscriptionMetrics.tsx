import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Subscription } from '@/hooks/useSubscriptions';
import { useCurrency } from '@/hooks/useCurrency';

interface SubscriptionMetricsProps {
  subscriptions: Subscription[];
  displayCurrency: string;
}

const SubscriptionMetrics = ({ subscriptions, displayCurrency }: SubscriptionMetricsProps) => {
  const { convert, demoMode } = useCurrency();
  
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  const monthlyTotal = activeSubscriptions.reduce((total, subscription) => {
    const convertedCost = convert(subscription.price, subscription.currency, displayCurrency);
    const totalSeats = subscription.seats || 1;
    const subscriptionCost = convertedCost * totalSeats;
    
    // Convert to monthly equivalent based on billing cycle
    const monthlyCost = subscription.billing_cycle === 'yearly' 
      ? subscriptionCost / 12 
      : subscriptionCost;
    
    return total + monthlyCost;
  }, 0);

  const totalPaidToDate = subscriptions.reduce((total, subscription) => {
    const convertedCost = convert(subscription.total_paid || 0, subscription.currency, displayCurrency);
    return total + convertedCost;
  }, 0);

  const yearlyTotal = activeSubscriptions.reduce((total, subscription) => {
    const convertedCost = convert(subscription.price, subscription.currency, displayCurrency);
    const totalSeats = subscription.seats || 1;
    const subscriptionCost = convertedCost * totalSeats;
    
    // Convert to yearly equivalent based on billing cycle
    const yearlyCost = subscription.billing_cycle === 'yearly' 
      ? subscriptionCost 
      : subscriptionCost * 12;
    
    return total + yearlyCost;
  }, 0);

  // Format numbers: remove decimals and convert 1000+ to K format
  const formatMetric = (value: number, isCurrency = false) => {
    const rounded = Math.round(value);
    
    if (rounded >= 1000) {
      const kValue = (rounded / 1000).toFixed(2).replace(/\.?0+$/, '');
      if (isCurrency) {
        return `${displayCurrency === 'RON' ? 'RON ' : (displayCurrency === 'EUR' ? '€' : '$')}${kValue}K`;
      }
      return `${kValue}K`;
    }
    
    if (isCurrency) {
      return `${displayCurrency === 'RON' ? 'RON ' : (displayCurrency === 'EUR' ? '€' : '$')}${rounded}`;
    }
    
    return rounded.toString();
  };


  const stats = [
    {
      title: "Monthly Subscription Cost",
      value: monthlyTotal,
      originalValue: formatCurrency(monthlyTotal, displayCurrency),
      isCurrency: true,
      subtitle: "total monthly recurring costs",
      statusRows: [`${activeSubscriptions.length} active subscription${activeSubscriptions.length !== 1 ? 's' : ''}`]
    },
    {
      title: "Yearly Subscription Cost",
      value: yearlyTotal,
      originalValue: formatCurrency(yearlyTotal, displayCurrency),
      isCurrency: true,
      subtitle: "total yearly recurring costs",
      statusRows: [`${activeSubscriptions.length} active subscription${activeSubscriptions.length !== 1 ? 's' : ''}`]
    },
    {
      title: "Total Paid to Date",
      value: totalPaidToDate,
      originalValue: formatCurrency(totalPaidToDate, displayCurrency),
      isCurrency: true,
      subtitle: "across all subscriptions",
      statusRows: [`${subscriptions.length} total subscription${subscriptions.length !== 1 ? 's' : ''}`]
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.length,
      originalValue: activeSubscriptions.length.toString(),
      isCurrency: false,
      subtitle: "currently active",
      statusRows: subscriptions.length > activeSubscriptions.length ? [`${subscriptions.length - activeSubscriptions.length} inactive`] : []
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const formattedValue = demoMode && stat.isCurrency ? '—' : formatMetric(stat.value, stat.isCurrency);
          const needsTooltip = !demoMode && typeof stat.value === 'number' ? stat.value >= 1000 : false;
          
          return (
            <Card key={index} className="hover:shadow-none transition-all duration-200 shadow-none w-full min-w-0">
              <CardContent className="ui-card-content lg:p-6 flex flex-col justify-between h-full min-h-[200px] lg:min-h-[231px]">
                {/* Section 1: Top content */}
                <div className="space-y-2 lg:space-y-3">
                  <div className="space-y-1 lg:space-y-2">
                    <h3 
                      className="font-satoshi font-normal text-sm lg:text-lg xl:text-xl leading-tight"
                      style={{
                        color: 'var(--Dark-color, #081735)',
                      }}
                    >
                      {stat.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {stat.statusRows.map((statusRow, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 truncate">{statusRow}</span>
                      </div>
                    ))}
                    {stat.statusRows.length === 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 truncate">{stat.subtitle}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Bottom metric */}
                <div className="mt-2 lg:mt-4">
                  {needsTooltip ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p 
                          className="font-satoshi font-normal cursor-help text-xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight"
                          style={{
                            color: 'var(--Dark-color, #081735)',
                          }}
                        >
                          {formattedValue}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stat.originalValue}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <p 
                      className="font-satoshi font-normal text-xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight"
                      style={{
                        color: 'var(--Dark-color, #081735)',
                      }}
                    >
                      {formattedValue}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default SubscriptionMetrics;
