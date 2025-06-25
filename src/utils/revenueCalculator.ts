
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

  return invoices.reduce((sum, invoice) => {
    // Only count paid invoices
    if (invoice.status === 'paid') {
      const amount = parseFloat(invoice.amount?.toString() || '0');
      if (isNaN(amount)) return sum;
      
      const invoiceCurrency = invoice.currency || 'USD';
      const convertedAmount = convert(amount, invoiceCurrency, displayCurrency);
      return sum + convertedAmount;
    }
    
    return sum;
  }, 0);
};

export const calculateFixedProjectRevenue = (
  projects: any[],
  params: any,
  convert: (amount: number, from: string, to: string) => number,
  displayCurrency: string
) => {
  if (!projects) return 0;

  return projects.reduce((sum, project) => {
    if (project.pricing_type === 'fixed' && project.fixed_price && project.status === 'completed') {
      // Check if project was completed within date range
      const completedDate = project.end_date ? new Date(project.end_date) : new Date();
      
      if (params?.dateRange?.from && completedDate < params.dateRange.from) return sum;
      if (params?.dateRange?.to && completedDate > params.dateRange.to) return sum;
      
      const amount = parseFloat(project.fixed_price.toString());
      const projectCurrency = project.currency || 'USD';
      const convertedAmount = convert(amount, projectCurrency, displayCurrency);
      return sum + convertedAmount;
    }
    return sum;
  }, 0);
};
