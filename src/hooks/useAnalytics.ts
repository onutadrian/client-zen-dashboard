
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { AnalyticsData, AnalyticsParams } from '@/utils/analyticsTypes';
import { calculateHourlyRevenue, calculateInvoiceRevenue, calculateFixedProjectRevenue } from '@/utils/revenueCalculator';
import { calculateTimeBreakdown, calculateRevenueBreakdown } from '@/utils/analyticsBreakdown';
import { 
  fetchClientsData, 
  fetchProjectsData, 
  fetchHourEntriesData, 
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
      console.log('No user, skipping analytics calculation');
      setLoading(false);
      return;
    }

    console.log('Calculating analytics for user:', user.email, 'with date range:', params?.dateRange);
    setLoading(true);

    try {
      // Fetch all data
      const [clients, projects, hourEntries, subscriptions] = await Promise.all([
        fetchClientsData(),
        fetchProjectsData(),
        fetchHourEntriesData(params),
        fetchSubscriptionsData(params)
      ]);

      // Calculate basic metrics
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(client => client.status === 'active').length || 0;
      
      const totalHours = hourEntries?.reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        return sum + hours;
      }, 0) || 0;

      // Calculate revenue from multiple sources
      let totalRevenue = 0;
      
      // 1. Revenue from hour entries (hourly work) - only for hourly projects/clients
      const hourlyRevenue = calculateHourlyRevenue(hourEntries, projects, clients, convert, displayCurrency);
      console.log('Hourly revenue calculated:', hourlyRevenue);

      // 2. Revenue from client invoices - this should be the main source for most revenue
      const invoiceRevenue = calculateInvoiceRevenue(clients, params, convert, displayCurrency);
      console.log('Invoice revenue calculated:', invoiceRevenue);

      // 3. Revenue from fixed-price projects - only when completed
      const fixedProjectRevenue = calculateFixedProjectRevenue(projects, params, convert, displayCurrency);
      console.log('Fixed project revenue calculated:', fixedProjectRevenue);

      // For most cases, we should primarily use invoice revenue as it represents actual payments
      // Hourly revenue should only be added if there are no corresponding invoices
      // Fixed project revenue should only be added when projects are completed
      
      // Start with invoice revenue as the primary source
      totalRevenue = invoiceRevenue;
      
      // Add hourly revenue only for unbilled hours (this might need refinement based on your business logic)
      // For now, let's comment this out to avoid double counting
      // totalRevenue += hourlyRevenue;
      
      // Add fixed project revenue for completed projects
      totalRevenue += fixedProjectRevenue;

      console.log('Total revenue calculated:', totalRevenue);

      // Calculate subscription costs
      const monthlySubscriptionCost = subscriptions?.reduce((sum, sub) => {
        const price = parseFloat(sub.price?.toString() || '0');
        const subCurrency = sub.currency || 'USD';
        const convertedPrice = convert(price, subCurrency, displayCurrency);
        return sum + convertedPrice;
      }, 0) || 0;

      const totalPaidToDate = subscriptions?.reduce((sum, sub) => {
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

      console.log('Analytics calculated:', newAnalytics);
      setAnalytics(newAnalytics);
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      console.log('Analytics calculation complete, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User or date range changed, recalculating analytics');
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
