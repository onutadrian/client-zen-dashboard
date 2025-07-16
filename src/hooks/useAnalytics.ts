
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { AnalyticsData, AnalyticsParams } from '@/utils/analyticsTypes';
import { calculateHourlyRevenue, calculateInvoiceRevenue } from '@/utils/revenueCalculator';
import { calculateTimeBreakdown, calculateRevenueBreakdown } from '@/utils/analyticsBreakdown';
import { 
  fetchClientsData, 
  fetchProjectsData, 
  fetchHourEntriesData, 
  fetchInvoicesData,
  fetchSubscriptionsData 
} from '@/services/analyticsDataService';

export const useAnalytics = (params?: AnalyticsParams) => {
  const { user } = useAuth();
  const { displayCurrency, convert } = useCurrency();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClients: 0,
    activeClients: 0,
    totalHours: 0,
    totalRevenue: 0,
    monthlySubscriptionCost: 0,
    totalPaidToDate: 0,
    clients: [],
    timeBreakdown: [],
    revenueBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Calculate the appropriate previous period based on the current period selection
      const getPreviousPeriod = () => {
        if (!params?.dateRange?.from || !params?.dateRange?.to) {
          // For all-time, compare with previous 30 days
          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
          return {
            from: sixtyDaysAgo,
            to: thirtyDaysAgo,
            comparisonText: "vs prev 30d"
          };
        }

        const currentFrom = params.dateRange.from;
        const currentTo = params.dateRange.to;
        const periodDuration = currentTo.getTime() - currentFrom.getTime();

        // Calculate previous period of the same duration
        const previousTo = new Date(currentFrom.getTime() - 1); // Just before current period starts
        const previousFrom = new Date(previousTo.getTime() - periodDuration);

        // Determine comparison text based on period type
        let comparisonText = "vs prev period";
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Check if this is "this month"
        if (currentFrom.getMonth() === currentMonth && 
            currentFrom.getFullYear() === currentYear &&
            currentTo.getMonth() === currentMonth &&
            currentTo.getFullYear() === currentYear) {
          comparisonText = "vs last month";
        }
        // Check if this is "this year"  
        else if (currentFrom.getFullYear() === currentYear &&
                 currentTo.getFullYear() === currentYear &&
                 currentFrom.getMonth() === 0 && // January
                 currentTo.getMonth() === 11) { // December
          comparisonText = "vs last year";
        }
        // Check if this is "last month"
        else if (currentFrom.getMonth() === currentMonth - 1 && 
                 currentFrom.getFullYear() === currentYear) {
          comparisonText = "vs prev month";
        }
        // Check if this is "last year"
        else if (currentFrom.getFullYear() === currentYear - 1) {
          comparisonText = "vs prev year";
        }
        // For custom periods, show duration-based text
        else {
          const days = Math.ceil(periodDuration / (1000 * 60 * 60 * 24));
          if (days <= 31) {
            comparisonText = "vs prev month";
          } else if (days <= 92) {
            comparisonText = "vs prev quarter";
          } else {
            comparisonText = "vs prev period";
          }
        }

        return {
          from: previousFrom,
          to: previousTo,
          comparisonText
        };
      };

      const previousPeriod = getPreviousPeriod();
      const previousPeriodParams = {
        dateRange: {
          from: previousPeriod.from,
          to: previousPeriod.to
        }
      };

      // Fetch current period data
      const [clients, projects, hourEntries, invoices, allSubscriptions] = await Promise.all([
        fetchClientsData(),
        fetchProjectsData(),
        fetchHourEntriesData(params),
        fetchInvoicesData(params),
        fetchSubscriptionsData() // Get all subscriptions, not filtered by date
      ]);

      // Fetch previous period data for comparison
      const [prevHourEntries, prevInvoices] = await Promise.all([
        fetchHourEntriesData(previousPeriodParams),
        fetchInvoicesData(previousPeriodParams)
      ]);
      
      // Calculate current period metrics
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(client => client.status === 'active').length || 0;
      
      const totalHours = hourEntries?.reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        return sum + hours;
      }, 0) || 0;

      // Calculate revenue ONLY from paid invoices - this is the source of truth
      const invoiceRevenue = calculateInvoiceRevenue(invoices, convert, displayCurrency);
      const totalRevenue = invoiceRevenue;

      // Calculate subscription costs - only active subscriptions with proper yearly-to-monthly conversion
      const activeSubscriptions = allSubscriptions?.filter(sub => sub.status === 'active') || [];
      const monthlySubscriptionCost = activeSubscriptions.reduce((sum, sub) => {
        const price = parseFloat(sub.price?.toString() || '0');
        const seats = parseInt(sub.seats?.toString() || '1');
        const subCurrency = sub.currency || 'USD';
        const convertedPrice = convert(price, subCurrency, displayCurrency);
        const subscriptionCost = convertedPrice * seats;
        
        // Convert to monthly equivalent based on billing cycle
        const monthlyCost = sub.billing_cycle === 'yearly' 
          ? subscriptionCost / 12 
          : subscriptionCost;
        
        return sum + monthlyCost;
      }, 0);

      const totalPaidToDate = allSubscriptions?.reduce((sum, sub) => {
        const totalPaid = parseFloat(sub.total_paid?.toString() || '0');
        const subCurrency = sub.currency || 'USD';
        const convertedPaid = convert(totalPaid, subCurrency, displayCurrency);
        return sum + convertedPaid;
      }, 0) || 0;

      // Calculate previous period metrics for comparison
      const prevTotalHours = prevHourEntries?.reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        return sum + hours;
      }, 0) || 0;

      const prevInvoiceRevenue = calculateInvoiceRevenue(prevInvoices, convert, displayCurrency);
      const prevTotalRevenue = prevInvoiceRevenue;

      // Calculate breakdowns
      const timeBreakdown = calculateTimeBreakdown(clients, hourEntries);
      const revenueBreakdown = calculateRevenueBreakdown(clients, hourEntries, projects, params, convert, displayCurrency);

      const newAnalytics: AnalyticsData = {
        totalClients,
        activeClients,
        totalHours,
        totalRevenue,
        monthlySubscriptionCost,
        totalPaidToDate,
        clients: clients || [],
        timeBreakdown,
        revenueBreakdown,
        previousPeriodData: {
          totalClients: totalClients, // Client count doesn't change much day-to-day
          totalHours: prevTotalHours,
          totalRevenue: prevTotalRevenue,
          monthlySubscriptionCost: monthlySubscriptionCost, // Subscription costs are relatively stable
          totalPaidToDate: totalPaidToDate // This is cumulative, so we use current value
        },
        comparisonText: previousPeriod.comparisonText
      };

      setAnalytics(newAnalytics);
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      calculateAnalytics();
    }
  }, [user, displayCurrency, params?.dateRange?.from, params?.dateRange?.to]);

  return {
    ...analytics,
    loading,
    displayCurrency,
    formatCurrency,
    refetch: calculateAnalytics
  };
};
