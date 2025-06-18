
import { convertCurrency } from '@/lib/currency';
import { Client } from './useClients';
import { Subscription } from './useSubscriptions';
import { useHourEntries } from './useHourEntries';

export const useAnalytics = (
  clients: Client[], 
  subscriptions: Subscription[], 
  displayCurrency: string
) => {
  const { hourEntries } = useHourEntries();
  
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  
  // Calculate total hours from hour entries instead of client data
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0);
  
  const totalRevenue = clients.reduce((sum, client) => {
    const clientRevenue = (client.invoices || []).reduce((invoiceSum, invoice) => {
      if (invoice.status === 'paid') {
        const convertedAmount = convertCurrency(invoice.amount, client.currency || 'USD', displayCurrency);
        return invoiceSum + convertedAmount;
      }
      return invoiceSum;
    }, 0);
    return sum + clientRevenue;
  }, 0);
  
  const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => {
    const convertedPrice = convertCurrency(sub.price * (sub.seats || 1), sub.currency || 'USD', displayCurrency);
    return sum + convertedPrice;
  }, 0);

  return {
    totalClients,
    activeClients,
    totalHours,
    totalRevenue,
    monthlySubscriptionCost
  };
};
