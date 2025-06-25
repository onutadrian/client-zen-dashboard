
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';

export const useAnalytics = () => {
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
    if (!user) return;

    try {
      // Fetch clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;

      // Fetch hour entries
      const { data: hourEntries, error: hoursError } = await supabase
        .from('hour_entries')
        .select('*');

      if (hoursError) throw hoursError;

      // Fetch subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;

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

      setAnalytics({
        totalClients,
        activeClients,
        totalHours,
        totalRevenue,
        monthlySubscriptionCost,
        totalPaidToDate,
        clients: clients || [],
        timeBreakdown,
        revenueBreakdown
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateAnalytics();
  }, [user, displayCurrency]);

  return {
    ...analytics,
    loading,
    displayCurrency,
    formatCurrency,
    refetch: calculateAnalytics
  };
};
