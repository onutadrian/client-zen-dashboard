
import { Invoice } from './analyticsTypes';

export const calculateTimeBreakdown = (clients: any[], hourEntries: any[]) => {
  return clients?.map(client => {
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
};

export const calculateRevenueBreakdown = (
  clients: any[],
  hourEntries: any[],
  projects: any[],
  params: any,
  convert: (amount: number, from: string, to: string) => number,
  displayCurrency: string
) => {
  return clients?.map(client => {
    let clientRevenue = 0;
    
    // Revenue from hourly work
    const hourlyClientRevenue = hourEntries?.filter(entry => entry.client_id === client.id)
      .reduce((sum, entry) => {
        const hours = parseFloat(entry.hours?.toString() || '0');
        const project = projects?.find(p => p.id === entry.project_id);
        
        let rate = 0;
        if (project?.pricing_type === 'hourly' && project.hourly_rate) {
          rate = parseFloat(project.hourly_rate.toString());
        } else if (client?.price_type === 'hourly') {
          rate = parseFloat(client.price?.toString() || '0');
        }
        
        const entryRevenue = hours * rate;
        const projectCurrency = project?.currency || client.currency || 'USD';
        return sum + convert(entryRevenue, projectCurrency, displayCurrency);
      }, 0) || 0;
    
    clientRevenue += hourlyClientRevenue;
    
    // Revenue from client invoices
    if (client.invoices && Array.isArray(client.invoices)) {
      const invoiceClientRevenue = client.invoices.reduce((sum: number, invoiceJson: any) => {
        try {
          // Safe type conversion with validation
          const invoice = invoiceJson as unknown as Invoice;
          if (!invoice || typeof invoice !== 'object' || !invoice.date) return sum;
          
          const invoiceDate = new Date(invoice.date);
          
          if (params?.dateRange?.from && invoiceDate < params.dateRange.from) return sum;
          if (params?.dateRange?.to && invoiceDate > params.dateRange.to) return sum;
          
          if (invoice.status === 'paid') {
            const amount = parseFloat(invoice.amount?.toString() || '0');
            if (isNaN(amount)) return sum;
            
            const invoiceCurrency = invoice.currency || client.currency || 'USD';
            return sum + convert(amount, invoiceCurrency, displayCurrency);
          }
          return sum;
        } catch (error) {
          console.warn('Error processing invoice in breakdown:', error);
          return sum;
        }
      }, 0);
      
      clientRevenue += invoiceClientRevenue;
    }

    return {
      name: client.name,
      revenue: clientRevenue
    };
  }).filter(item => item.revenue > 0) || [];
};
