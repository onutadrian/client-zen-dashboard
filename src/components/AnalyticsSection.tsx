
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import AnalyticsMetric from '@/components/analytics/AnalyticsMetric';
import { useAnalyticsStats } from '@/components/analytics/useAnalyticsStats';
import { PeriodOption } from '@/components/PeriodFilter';

interface AnalyticsSectionProps {
  totalClients: number;
  activeClients: number;
  totalHours: number;
  totalRevenue: number;
  monthlySubscriptionCost: number;
  totalPaidToDate: number;
  clients: any[];
  displayCurrency: string;
  formatCurrency: (amount: number, currency: string) => string;
  timeBreakdown?: any[];
  revenueBreakdown?: any[];
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  // Previous period data for comparison
  previousPeriodData?: {
    totalClients: number;
    totalHours: number;
    totalRevenue: number;
    monthlySubscriptionCost: number;
    totalPaidToDate: number;
  };
  comparisonText?: string;
  loading?: boolean;
}

const AnalyticsSection = (props: AnalyticsSectionProps) => {
  const { stats } = useAnalyticsStats(props);

  return (
    <div className="space-y-6">
      {/* Header with Period Filter */}
      <AnalyticsHeader
        selectedPeriod={props.selectedPeriod}
        onPeriodChange={props.onPeriodChange}
        customDateRange={props.customDateRange}
        onCustomDateChange={props.onCustomDateChange}
      />

      {/* Metrics Grid */}
      <TooltipProvider>
        {props.loading ? (
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="space-y-3">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  <div className="h-7 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <AnalyticsMetric
                key={index}
                stat={stat}
                displayCurrency={props.displayCurrency}
              />
            ))}
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};

export default AnalyticsSection;
