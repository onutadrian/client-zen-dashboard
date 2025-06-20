
import { convertCurrency } from '@/lib/currency';
import { Client } from './useClients';
import { Subscription } from './useSubscriptions';
import { useHourEntries } from './useHourEntries';
import { useInvoices } from './useInvoices';

export const useAnalytics = (
  clients: Client[], 
  subscriptions: Subscription[], 
  displayCurrency: string
) => {
  const { hourEntries } = useHourEntries();
  const { invoices } = useInvoices();
  
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  
  // Calculate total hours from hour entries
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate total revenue from paid invoices
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => {
      const convertedAmount = convertCurrency(invoice.amount, invoice.currency, displayCurrency);
      return sum + convertedAmount;
    }, 0);
  
  // Calculate monthly subscription cost
  const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => {
    const convertedPrice = convertCurrency(sub.price * (sub.seats || 1), sub.currency || 'USD', displayCurrency);
    return sum + convertedPrice;
  }, 0);

  // Calculate total paid to date from subscriptions
  const totalPaidToDate = subscriptions.reduce((sum, sub) => {
    const convertedAmount = convertCurrency(sub.total_paid || 0, sub.currency || 'USD', displayCurrency);
    return sum + convertedAmount;
  }, 0);

  // Calculate time breakdown by client
  const getTimeBreakdownByClient = () => {
    return clients.map(client => {
      const clientHourEntries = hourEntries.filter(entry => entry.clientId === client.id);
      const totalHours = clientHourEntries.reduce((sum, entry) => sum + entry.hours, 0);

      // Convert hours to appropriate unit based on client's price type
      let displayValue = totalHours;
      let unit = 'hrs';
      
      if (client.priceType === 'day') {
        displayValue = Math.round(totalHours / 8 * 10) / 10; // 8 hours = 1 day
        unit = 'days';
      } else if (client.priceType === 'week') {
        displayValue = Math.round(totalHours / 40 * 10) / 10; // 40 hours = 1 week
        unit = 'weeks';
      } else if (client.priceType === 'month') {
        displayValue = Math.round(totalHours / 160 * 10) / 10; // 160 hours = 1 month
        unit = 'months';
      }
      
      return {
        name: client.name,
        value: displayValue,
        unit: unit,
        hasTime: totalHours > 0
      };
    }).filter(client => client.hasTime);
  };

  // Calculate revenue breakdown by client
  const getRevenueBreakdownByClient = () => {
    return clients.map(client => {
      const clientInvoices = invoices.filter(invoice => invoice.clientId === client.id);
      const paidAmount = clientInvoices.reduce((sum, invoice) => {
        if (invoice.status === 'paid') {
          const convertedAmount = convertCurrency(invoice.amount, invoice.currency, displayCurrency);
          return sum + convertedAmount;
        }
        return sum;
      }, 0);
      
      return {
        name: client.name,
        value: paidAmount,
        hasRevenue: paidAmount > 0
      };
    }).filter(client => client.hasRevenue);
  };

  return {
    totalClients,
    activeClients,
    totalHours,
    totalRevenue,
    monthlySubscriptionCost,
    totalPaidToDate,
    timeBreakdown: getTimeBreakdownByClient(),
    revenueBreakdown: getRevenueBreakdownByClient()
  };
};
