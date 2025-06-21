
import { useMemo } from 'react';
import { convertCurrency, formatCurrency } from '@/lib/currency';

export const useAnalytics = (clients, subscriptions, displayCurrency) => {
  console.log('useAnalytics: Calculating analytics for currency:', displayCurrency);
  
  return useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;

    // Calculate total hours from all clients
    const totalHours = clients.reduce((total, client) => {
      return total + (client.hours_logged || 0);
    }, 0);

    // Calculate total revenue from all clients
    let totalRevenue = clients.reduce((total, client) => {
      const clientRevenue = client.rate * (client.hours_logged || 0);
      const convertedRevenue = convertCurrency(clientRevenue, client.currency || 'USD', displayCurrency);
      return total + convertedRevenue;
    }, 0);

    // Calculate monthly subscription cost
    let monthlySubscriptionCost = subscriptions.reduce((total, subscription) => {
      const convertedCost = convertCurrency(subscription.price * subscription.seats, subscription.currency || 'USD', displayCurrency);
      return total + convertedCost;
    }, 0);

    // Calculate total paid to date for subscriptions
    let totalPaidToDate = subscriptions.reduce((total, subscription) => {
      const convertedPaid = convertCurrency(subscription.total_paid, subscription.currency || 'USD', displayCurrency);
      return total + convertedPaid;
    }, 0);

    // Create time breakdown by client
    const timeBreakdown = clients.map(client => ({
      name: client.name,
      hours: client.hours_logged || 0
    })).filter(item => item.hours > 0);

    // Create revenue breakdown by client
    const revenueBreakdown = clients.map(client => {
      const clientRevenue = client.rate * (client.hours_logged || 0);
      const convertedRevenue = convertCurrency(clientRevenue, client.currency || 'USD', displayCurrency);
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
  }, [clients, subscriptions, displayCurrency]); // Include displayCurrency in dependencies
};
