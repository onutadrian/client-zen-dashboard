
import { useMemo } from 'react';
import { convertCurrency, formatCurrency } from '@/lib/currency';

export const useAnalytics = (clients, subscriptions, displayCurrency) => {
  console.log('useAnalytics: Calculating analytics for currency:', displayCurrency);
  console.log('useAnalytics: Clients data:', clients);
  
  return useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;

    // Calculate total hours from all clients
    const totalHours = clients.reduce((total, client) => {
      const hours = client.hours_logged || 0;
      return total + hours;
    }, 0);

    // Calculate total revenue from all clients with proper error handling
    let totalRevenue = clients.reduce((total, client) => {
      const rate = client.rate || 0;
      const hours = client.hours_logged || 0;
      const clientCurrency = client.currency || 'USD';
      
      console.log(`useAnalytics: Client ${client.name} - rate: ${rate}, hours: ${hours}, currency: ${clientCurrency}`);
      
      if (rate === 0 || hours === 0) {
        return total;
      }
      
      const clientRevenue = rate * hours;
      
      if (isNaN(clientRevenue)) {
        console.log(`useAnalytics: NaN revenue for client ${client.name}, rate: ${rate}, hours: ${hours}`);
        return total;
      }
      
      const convertedRevenue = convertCurrency(clientRevenue, clientCurrency, displayCurrency);
      return total + convertedRevenue;
    }, 0);

    // Calculate monthly subscription cost
    let monthlySubscriptionCost = subscriptions.reduce((total, subscription) => {
      const price = subscription.price || 0;
      const seats = subscription.seats || 1;
      const subscriptionCurrency = subscription.currency || 'USD';
      
      const subscriptionCost = price * seats;
      
      if (isNaN(subscriptionCost)) {
        console.log(`useAnalytics: NaN cost for subscription ${subscription.name}`);
        return total;
      }
      
      const convertedCost = convertCurrency(subscriptionCost, subscriptionCurrency, displayCurrency);
      return total + convertedCost;
    }, 0);

    // Calculate total paid to date for subscriptions
    let totalPaidToDate = subscriptions.reduce((total, subscription) => {
      const paid = subscription.total_paid || 0;
      const subscriptionCurrency = subscription.currency || 'USD';
      
      if (isNaN(paid)) {
        console.log(`useAnalytics: NaN total_paid for subscription ${subscription.name}`);
        return total;
      }
      
      const convertedPaid = convertCurrency(paid, subscriptionCurrency, displayCurrency);
      return total + convertedPaid;
    }, 0);

    // Create time breakdown by client
    const timeBreakdown = clients.map(client => ({
      name: client.name,
      hours: client.hours_logged || 0
    })).filter(item => item.hours > 0);

    // Create revenue breakdown by client
    const revenueBreakdown = clients.map(client => {
      const rate = client.rate || 0;
      const hours = client.hours_logged || 0;
      const clientCurrency = client.currency || 'USD';
      
      if (rate === 0 || hours === 0) {
        return {
          name: client.name,
          revenue: formatCurrency(0, displayCurrency)
        };
      }
      
      const clientRevenue = rate * hours;
      
      if (isNaN(clientRevenue)) {
        return {
          name: client.name,
          revenue: formatCurrency(0, displayCurrency)
        };
      }
      
      const convertedRevenue = convertCurrency(clientRevenue, clientCurrency, displayCurrency);
      return {
        name: client.name,
        revenue: formatCurrency(convertedRevenue, displayCurrency)
      };
    }).filter(item => parseFloat(item.revenue.replace(/[^0-9.-]/g, '')) > 0);

    console.log('useAnalytics: Calculated values:', {
      totalRevenue: formatCurrency(totalRevenue, displayCurrency),
      monthlySubscriptionCost: formatCurrency(monthlySubscriptionCost, displayCurrency),
      totalPaidToDate: formatCurrency(totalPaidToDate, displayCurrency)
    });

    return {
      totalClients,
      activeClients,
      totalHours,
      totalRevenue,
      monthlySubscriptionCost,
      totalPaidToDate,
      timeBreakdown,
      revenueBreakdown
    };
  }, [clients, subscriptions, displayCurrency]);
};
