import { useMemo, useEffect, useState } from 'react';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { useHourEntries } from '@/hooks/useHourEntries';

export const useAnalytics = (clients, subscriptions, displayCurrency) => {
  const { hourEntries } = useHourEntries();
  const [analytics, setAnalytics] = useState({
    totalClients: 0,
    activeClients: 0,
    totalHours: 0,
    totalRevenue: 0,
    monthlySubscriptionCost: 0,
    totalPaidToDate: 0,
    timeBreakdown: [],
    revenueBreakdown: []
  });
  
  useEffect(() => {
    console.log('useAnalytics: Calculating analytics for currency:', displayCurrency);
    console.log('useAnalytics: Clients data:', clients);
    console.log('useAnalytics: Hour entries:', hourEntries.length);
    
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;

    // Calculate total hours from hour entries
    const totalHours = hourEntries.reduce((total, entry) => {
      return total + entry.hours;
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

    // Create time breakdown by client (using hour entries)
    const clientHours = {};
    hourEntries.forEach(entry => {
      const clientId = entry.clientId;
      if (!clientHours[clientId]) {
        clientHours[clientId] = 0;
      }
      clientHours[clientId] += entry.hours;
    });
    
    const timeBreakdown = Object.entries(clientHours).map(([clientId, hours]) => {
      const client = clients.find(c => c.id === parseInt(clientId));
      return {
        name: client ? client.name : `Client ${clientId}`,
        hours: hours
      };
    }).sort((a, b) => b.hours - a.hours);

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
      totalHours,
      totalRevenue: formatCurrency(totalRevenue, displayCurrency),
      monthlySubscriptionCost: formatCurrency(monthlySubscriptionCost, displayCurrency),
      totalPaidToDate: formatCurrency(totalPaidToDate, displayCurrency)
    });

    setAnalytics({
      totalClients,
      activeClients,
      totalHours,
      totalRevenue,
      monthlySubscriptionCost,
      totalPaidToDate,
      timeBreakdown,
      revenueBreakdown
    });
  }, [clients, subscriptions, displayCurrency, hourEntries]);

  return analytics;
};