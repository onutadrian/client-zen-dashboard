
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
