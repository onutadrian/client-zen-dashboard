
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
      // Fetch all data - but don't filter subscriptions by date for cost calculation
      const [clients, projects, hourEntries, invoices, allSubscriptions] = await Promise.all([
        fetchClientsData(),
        fetchProjectsData(),
        fetchHourEntriesData(params),
        fetchInvoicesData(params),
        fetchSubscriptionsData() // Get all subscriptions, not filtered by date
      ]);
      
      // Calculate basic metrics
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(client => client.status === 'active').length || 0;
      
      const totalHours = hourEntries?.reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        return sum + hours;
      }, 0) || 0;

      // Calculate revenue ONLY from paid invoices - this is the source of truth
      const invoiceRevenue = calculateInvoiceRevenue(invoices, convert, displayCurrency);

      // Total revenue is ONLY from paid invoices (no double counting)
      const totalRevenue = invoiceRevenue;

      // Calculate subscription costs - only active subscriptions
      const activeSubscriptions = allSubscriptions?.filter(sub => sub.status === 'active') || [];
      const monthlySubscriptionCost = activeSubscriptions.reduce((sum, sub) => {
        const price = parseFloat(sub.price?.toString() || '0');
        const seats = parseInt(sub.seats?.toString() || '1');
        const subCurrency = sub.currency || 'USD';
        const convertedPrice = convert(price, subCurrency, displayCurrency);
        return sum + (convertedPrice * seats);
      }, 0);

      const totalPaidToDate = allSubscriptions?.reduce((sum, sub) => {
        const totalPaid = parseFloat(sub.total_paid?.toString() || '0');
        const subCurrency = sub.currency || 'USD';
        const convertedPaid = convert(totalPaid, subCurrency, displayCurrency);
        return sum + convertedPaid;
      }, 0) || 0;

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
        revenueBreakdown
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
