
import { useCurrency } from '@/hooks/useCurrency';
import { Invoice } from './analyticsTypes';

export const calculateHourlyRevenue = (
  hourEntries: any[],
  projects: any[],
  clients: any[],
  convert: (amount: number, from: string, to: string) => number,
  displayCurrency: string
) => {
  if (!clients || !hourEntries || !projects) return 0;

  return hourEntries.reduce((sum, entry) => {
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
    const projectCurrency = project?.currency || client?.currency || 'USD';
    const convertedRevenue = convert(entryRevenue, projectCurrency, displayCurrency);
    
    return sum + convertedRevenue;
  }, 0);
};

export const calculateInvoiceRevenue = (
  invoices: any[],
  convert: (amount: number, from: string, to: string) => number,
  displayCurrency: string
) => {
  if (!invoices) return 0;

  console.log('Calculating invoice revenue for', invoices.length, 'invoices');

  return invoices.reduce((sum, invoice) => {
    // Only count paid invoices
    if (invoice.status === 'paid') {
      const amount = parseFloat(invoice.amount?.toString() || '0');
      if (isNaN(amount)) {
        console.warn('Invalid amount for invoice:', invoice);
        return sum;
      }
      
      // Use invoice currency, fallback to client currency, then USD
      const invoiceCurrency = invoice.currency || invoice.client_currency || 'USD';
      const convertedAmount = convert(amount, invoiceCurrency, displayCurrency);
      
      console.log(`Invoice: ${amount} ${invoiceCurrency} -> ${convertedAmount} ${displayCurrency}`);
      
      return sum + convertedAmount;
    }
    
    return sum;
  }, 0);
};
