
import { useMemo } from 'react';
import { convertCurrency, formatCurrency } from '@/lib/currency';

export const useAnalytics = (clients, subscriptions, displayCurrency) => {
  console.log('useAnalytics: Calculating analytics for currency:', displayCurrency);
  console.log('useAnalytics: Clients data:', clients);
  
  return useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;

    // Calculate total hours from all clients (if available)
    const totalHours = clients.reduce((total, client) => {
      const hours = client.hours_logged || 0;
      return total + hours;
    }, 0);

    // Calculate total revenue from client invoices (paid invoices only)
    let totalRevenue = clients.reduce((total, client) => {
      if (!client.invoices || !Array.isArray(client.invoices)) {
        return total;
      }
      
      const clientRevenue = client.invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((invoiceTotal, invoice) => {
          const amount = invoice.amount || 0;
          const invoiceCurrency = invoice.currency || 'USD';
          
          if (amount === 0 || isNaN(amount)) {
            return invoiceTotal;
          }
          
          const convertedAmount = convertCurrency(amount, invoiceCurrency, displayCurrency);
          return invoiceTotal + convertedAmount;
        }, 0);
      
      console.log(`useAnalytics: Client ${client.name} - invoice revenue: ${clientRevenue} ${displayCurrency}`);
      return total + clientRevenue;
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

    // Create time breakdown by client (if hours are available)
    const timeBreakdown = clients.map(client => ({
      name: client.name,
      hours: client.hours_logged || 0
    })).filter(item => item.hours > 0);

    // Create revenue breakdown by client (from invoices)
    const revenueBreakdown = clients.map(client => {
      if (!client.invoices || !Array.isArray(client.invoices)) {
        return {
          name: client.name,
          revenue: formatCurrency(0, displayCurrency)
        };
      }
      
      const clientRevenue = client.invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((invoiceTotal, invoice) => {
          const amount = invoice.amount || 0;
          const invoiceCurrency = invoice.currency || 'USD';
          
          if (amount === 0 || isNaN(amount)) {
            return invoiceTotal;
          }
          
          const convertedAmount = convertCurrency(amount, invoiceCurrency, displayCurrency);
          return invoiceTotal + convertedAmount;
        }, 0);
      
      return {
        name: client.name,
        revenue: formatCurrency(clientRevenue, displayCurrency)
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
