
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { DateRange } from '@/hooks/usePeriodFilter';

interface AnalyticsParams {
  dateRange?: DateRange;
}

interface Invoice {
  id: number;
  amount: number;
  date: string;
  status: string;
  currency?: string;
}

export const useAnalytics = (params?: AnalyticsParams) => {
  const { user } = useAuth();
  const { displayCurrency, convert } = useCurrency();
  const [analytics, setAnalytics] = useState({
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
      // Fetch clients
      console.log('Fetching clients...');
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        throw clientsError;
      }
      console.log('Clients fetched:', clients?.length || 0);

      // Fetch projects
      console.log('Fetching projects...');
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }
      console.log('Projects fetched:', projects?.length || 0);

      // Fetch hour entries with date filtering
      console.log('Fetching hour entries...');
      let hourEntriesQuery = supabase.from('hour_entries').select('*');
      
      if (params?.dateRange?.from) {
        hourEntriesQuery = hourEntriesQuery.gte('date', params.dateRange.from.toISOString().split('T')[0]);
      }
      if (params?.dateRange?.to) {
        hourEntriesQuery = hourEntriesQuery.lte('date', params.dateRange.to.toISOString().split('T')[0]);
      }

      const { data: hourEntries, error: hoursError } = await hourEntriesQuery;

      if (hoursError) {
        console.error('Error fetching hour entries:', hoursError);
        throw hoursError;
      }
      console.log('Hour entries fetched:', hourEntries?.length || 0);

      // Fetch subscriptions with date filtering
      console.log('Fetching subscriptions...');
      let subscriptionsQuery = supabase.from('subscriptions').select('*');
      
      if (params?.dateRange?.from) {
        subscriptionsQuery = subscriptionsQuery.gte('created_at', params.dateRange.from.toISOString());
      }
      if (params?.dateRange?.to) {
        subscriptionsQuery = subscriptionsQuery.lte('created_at', params.dateRange.to.toISOString());
      }

      const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        throw subscriptionsError;
      }
      console.log('Subscriptions fetched:', subscriptions?.length || 0);

      // Calculate metrics
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(client => client.status === 'active').length || 0;
      
      const totalHours = hourEntries?.reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        return sum + hours;
      }, 0) || 0;

      // Calculate revenue from multiple sources
      let totalRevenue = 0;
      
      // 1. Revenue from hour entries (hourly work)
      if (clients && hourEntries && projects) {
        const hourlyRevenue = hourEntries.reduce((sum, entry) => {
          const hours = parseFloat(entry.hours?.toString() || '0');
          const project = projects.find(p => p.id === entry.project_id);
          const client = clients.find(c => c.id === entry.client_id);
          
          let rate = 0;
          if (project?.pricing_type === 'hourly' && project.hourly_rate) {
            rate = parseFloat(project.hourly_rate.toString());
          } else if (client?.price_type === 'hourly') {
            rate = parseFloat(client.price?.toString() || '0');
          }
          
          const entryRevenue = hours * rate;
          
          // Convert to display currency if needed
          const projectCurrency = project?.currency || client?.currency || 'USD';
          const convertedRevenue = convert(entryRevenue, projectCurrency, displayCurrency);
          
          return sum + convertedRevenue;
        }, 0);
        
        totalRevenue += hourlyRevenue;
        console.log('Hourly revenue calculated:', hourlyRevenue);
      }

      // 2. Revenue from client invoices (if within date range)
      if (clients) {
        const invoiceRevenue = clients.reduce((sum, client) => {
          if (!client.invoices || !Array.isArray(client.invoices)) return sum;
          
          const clientInvoiceRevenue = client.invoices.reduce((clientSum, invoiceJson) => {
            // Type assertion for invoice object
            const invoice = invoiceJson as Invoice;
            const invoiceDate = new Date(invoice.date);
            
            // Check if invoice is within date range
            if (params?.dateRange?.from && invoiceDate < params.dateRange.from) return clientSum;
            if (params?.dateRange?.to && invoiceDate > params.dateRange.to) return clientSum;
            
            // Only count paid invoices
            if (invoice.status === 'paid') {
              const amount = parseFloat(invoice.amount?.toString() || '0');
              const invoiceCurrency = invoice.currency || client.currency || 'USD';
              const convertedAmount = convert(amount, invoiceCurrency, displayCurrency);
              return clientSum + convertedAmount;
            }
            
            return clientSum;
          }, 0);
          
          return sum + clientInvoiceRevenue;
        }, 0);
        
        totalRevenue += invoiceRevenue;
        console.log('Invoice revenue calculated:', invoiceRevenue);
      }

      // 3. Revenue from fixed-price projects (if completed within date range)
      if (projects && clients) {
        const fixedProjectRevenue = projects.reduce((sum, project) => {
          if (project.pricing_type === 'fixed' && project.fixed_price && project.status === 'completed') {
            // Check if project was completed within date range
            const completedDate = project.end_date ? new Date(project.end_date) : new Date();
            
            if (params?.dateRange?.from && completedDate < params.dateRange.from) return sum;
            if (params?.dateRange?.to && completedDate > params.dateRange.to) return sum;
            
            const amount = parseFloat(project.fixed_price.toString());
            const projectCurrency = project.currency || 'USD';
            const convertedAmount = convert(amount, projectCurrency, displayCurrency);
            return sum + convertedAmount;
          }
          return sum;
        }, 0);
        
        totalRevenue += fixedProjectRevenue;
        console.log('Fixed project revenue calculated:', fixedProjectRevenue);
      }

      console.log('Total revenue calculated:', totalRevenue);

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

      // Time breakdown by client
      const timeBreakdown = clients?.map(client => {
        const clientHours = hourEntries?.filter(entry => entry.client_id === client.id)
          .reduce((sum, entry) => {
            const hours = parseFloat(entry.hours?.toString() || '0');
            return sum + hours;
          }, 0) || 0;
        
        return {
          name: client.name,
          hours: clientHours
        };
      }).filter(item => item.hours > 0) || [];

      // Revenue breakdown by client
      const revenueBreakdown = clients?.map(client => {
        let clientRevenue = 0;
        
        // Revenue from hourly work
        const hourlyClientRevenue = hourEntries?.filter(entry => entry.client_id === client.id)
          .reduce((sum, entry) => {
            const hours = parseFloat(entry.hours?.toString() || '0');
            const project = projects?.find(p => p.id === entry.project_id);
            
            let rate = 0;
            if (project?.pricing_type === 'hourly' && project.hourly_rate) {
              rate = parseFloat(project.hourly_rate.toString());
            } else if (client?.price_type === 'hourly') {
              rate = parseFloat(client.price?.toString() || '0');
            }
            
            const entryRevenue = hours * rate;
            const projectCurrency = project?.currency || client.currency || 'USD';
            return sum + convert(entryRevenue, projectCurrency, displayCurrency);
          }, 0) || 0;
        
        clientRevenue += hourlyClientRevenue;
        
        // Revenue from client invoices
        if (client.invoices && Array.isArray(client.invoices)) {
          const invoiceClientRevenue = client.invoices.reduce((sum, invoiceJson) => {
            // Type assertion for invoice object
            const invoice = invoiceJson as Invoice;
            const invoiceDate = new Date(invoice.date);
            
            if (params?.dateRange?.from && invoiceDate < params.dateRange.from) return sum;
            if (params?.dateRange?.to && invoiceDate > params.dateRange.to) return sum;
            
            if (invoice.status === 'paid') {
              const amount = parseFloat(invoice.amount?.toString() || '0');
              const invoiceCurrency = invoice.currency || client.currency || 'USD';
              return sum + convert(amount, invoiceCurrency, displayCurrency);
            }
            return sum;
          }, 0);
          
          clientRevenue += invoiceClientRevenue;
        }

        return {
          name: client.name,
          revenue: clientRevenue
        };
      }).filter(item => item.revenue > 0) || [];

      const newAnalytics = {
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
