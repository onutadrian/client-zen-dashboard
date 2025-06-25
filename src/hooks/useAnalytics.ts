
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { DateRange } from '@/hooks/usePeriodFilter';

interface AnalyticsParams {
  dateRange?: DateRange;
}

export const useAnalytics = (params?: AnalyticsParams) => {
  const { user } = useAuth();
  const { displayCurrency } = useCurrency();
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

      // Calculate revenue based on currency
      let totalRevenue = 0;
      
      if (clients && hourEntries && projects) {
        totalRevenue = hourEntries.reduce((sum, entry) => {
          const hours = parseFloat(entry.hours?.toString() || '0');
          const project = projects.find(p => p.id === entry.project_id);
          const client = clients.find(c => c.id === entry.client_id);
          
          let rate = 0;
          if (project?.pricing_type === 'hourly' && project.hourly_rate) {
            rate = parseFloat(project.hourly_rate.toString());
          } else if (client?.price_type === 'hourly') {
            rate = parseFloat(client.price?.toString() || '0');
          }
          
          return sum + (hours * rate);
        }, 0);
      }

      const monthlySubscriptionCost = subscriptions?.reduce((sum, sub) => {
        const price = parseFloat(sub.price?.toString() || '0');
        return sum + price;
      }, 0) || 0;

      const totalPaidToDate = subscriptions?.reduce((sum, sub) => {
        const totalPaid = parseFloat(sub.total_paid?.toString() || '0');
        return sum + totalPaid;
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
        const clientRevenue = hourEntries?.filter(entry => entry.client_id === client.id)
          .reduce((sum, entry) => {
            const hours = parseFloat(entry.hours?.toString() || '0');
            const project = projects?.find(p => p.id === entry.project_id);
            
            let rate = 0;
            if (project?.pricing_type === 'hourly' && project.hourly_rate) {
              rate = parseFloat(project.hourly_rate.toString());
            } else if (client?.price_type === 'hourly') {
              rate = parseFloat(client.price?.toString() || '0');
            }
            
            return sum + (hours * rate);
          }, 0) || 0;

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
