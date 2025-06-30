
import { useMemo } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { PeriodOption } from '@/components/PeriodFilter';

interface UseAnalyticsStatsProps {
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
  customDateRange: { from: Date | undefined; to: Date | undefined };
}

export const useAnalyticsStats = ({
  totalClients,
  activeClients,
  totalHours,
  totalRevenue,
  monthlySubscriptionCost,
  totalPaidToDate,
  clients,
  displayCurrency,
  formatCurrency,
  timeBreakdown = [],
  revenueBreakdown = [],
  selectedPeriod,
  customDateRange
}: UseAnalyticsStatsProps) => {
  const { demoMode } = useCurrency();

  // Calculate period-aware net profit
  const calculateNetProfit = () => {
    let netProfit = 0;
    let subtitle = '';
    
    switch (selectedPeriod) {
      case 'this-month':
      case 'last-month':
        // Monthly comparison: monthly revenue vs monthly costs
        netProfit = totalRevenue - monthlySubscriptionCost;
        subtitle = "monthly estimate";
        break;
      case 'this-year':
      case 'last-year':
        // Annual comparison: annual revenue vs annual costs
        netProfit = totalRevenue - (monthlySubscriptionCost * 12);
        subtitle = "annual estimate";
        break;
      case 'custom':
        // For custom periods, calculate based on the duration
        if (customDateRange.from && customDateRange.to) {
          const daysDiff = Math.ceil((customDateRange.to.getTime() - customDateRange.from.getTime()) / (1000 * 60 * 60 * 24));
          const monthsInPeriod = daysDiff / 30.44; // Average days per month
          netProfit = totalRevenue - (monthlySubscriptionCost * monthsInPeriod);
          subtitle = "period estimate";
        } else {
          netProfit = totalRevenue - (monthlySubscriptionCost * 12);
          subtitle = "estimate";
        }
        break;
      default: // 'all-time'
        // All-time: total revenue vs annualized current costs
        netProfit = totalRevenue - (monthlySubscriptionCost * 12);
        subtitle = "annual estimate";
        break;
    }
    
    return { netProfit, subtitle };
  };

  const { netProfit, subtitle: netProfitSubtitle } = calculateNetProfit();
  const inactiveClients = totalClients - activeClients;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

  const getClientStatusRows = () => {
    const rows = [];
    if (activeClients > 0) {
      rows.push(`${activeClients} active`);
    }
    if (inactiveClients > 0) {
      rows.push(`${inactiveClients} inactive`);
    }
    if (pendingClients > 0) {
      rows.push(`${pendingClients} pending`);
    }
    return rows;
  };

  const stats = useMemo(() => [
    {
      title: "Total Clients",
      value: totalClients,
      originalValue: totalClients.toString(),
      isCurrency: false,
      isTime: false,
      subtitle: "client accounts",
      statusRows: getClientStatusRows(),
      details: clients.slice(0, 3).map(client => client.name)
    },
    {
      title: "Total Time",
      value: totalHours,
      originalValue: `${totalHours.toFixed(1)} hours`,
      isCurrency: false,
      isTime: true,
      subtitle: "tracked hours",
      statusRows: [],
      details: timeBreakdown.slice(0, 3)
    },
    {
      title: "Total Revenue",
      value: demoMode ? '—' : formatCurrency(totalRevenue, displayCurrency),
      originalValue: demoMode ? '—' : formatCurrency(totalRevenue, displayCurrency),
      isCurrency: true,
      isTime: false,
      subtitle: "from paid invoices",
      statusRows: [],
      details: revenueBreakdown.slice(0, 3)
    },
    {
      title: "Monthly Costs",
      value: demoMode ? '—' : formatCurrency(monthlySubscriptionCost, displayCurrency),
      originalValue: demoMode ? '—' : formatCurrency(monthlySubscriptionCost, displayCurrency),
      isCurrency: true,
      isTime: false,
      subtitle: "subscription expenses",
      statusRows: [],
      details: null
    },
    {
      title: "Total Paid to Date",
      value: demoMode ? '—' : formatCurrency(totalPaidToDate, displayCurrency),
      originalValue: demoMode ? '—' : formatCurrency(totalPaidToDate, displayCurrency),
      isCurrency: true,
      isTime: false,
      subtitle: "all subscriptions",
      statusRows: [],
      details: null
    },
    {
      title: "Net Profit",
      value: demoMode ? '—' : formatCurrency(netProfit, displayCurrency),
      originalValue: demoMode ? '—' : formatCurrency(netProfit, displayCurrency),
      isCurrency: true,
      isTime: false,
      subtitle: netProfitSubtitle,
      statusRows: [],
      details: revenueBreakdown.slice(0, 3)
    }
  ], [
    totalClients, activeClients, totalHours, totalRevenue, monthlySubscriptionCost,
    totalPaidToDate, clients, displayCurrency, formatCurrency, timeBreakdown,
    revenueBreakdown, selectedPeriod, customDateRange, demoMode, netProfit, netProfitSubtitle
  ]);

  return { stats };
};
