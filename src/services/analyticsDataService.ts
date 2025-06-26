
import { supabase } from '@/integrations/supabase/client';

export const fetchClientsData = async () => {
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*');

  if (clientsError) {
    throw clientsError;
  }
  
  return clients;
};

export const fetchProjectsData = async () => {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');

  if (projectsError) {
    throw projectsError;
  }
  
  return projects;
};

export const fetchHourEntriesData = async (params?: any) => {
  let hourEntriesQuery = supabase.from('hour_entries').select('*');
  
  if (params?.dateRange?.from) {
    hourEntriesQuery = hourEntriesQuery.gte('date', params.dateRange.from.toISOString().split('T')[0]);
  }
  if (params?.dateRange?.to) {
    hourEntriesQuery = hourEntriesQuery.lte('date', params.dateRange.to.toISOString().split('T')[0]);
  }

  const { data: hourEntries, error: hoursError } = await hourEntriesQuery;

  if (hoursError) {
    throw hoursError;
  }
  
  return hourEntries;
};

export const fetchInvoicesData = async (params?: any) => {
  // Fetch all clients with their invoices
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('id, name, currency, invoices');

  if (clientsError) {
    throw clientsError;
  }

  // Extract all invoices from client arrays
  const allInvoices = [];
  
  if (clients) {
    for (const client of clients) {
      if (client.invoices && Array.isArray(client.invoices)) {
        for (const invoiceData of client.invoices) {
          // Type guard to ensure invoiceData is an object
          if (typeof invoiceData === 'object' && invoiceData !== null && !Array.isArray(invoiceData)) {
            const invoice = invoiceData as any;
            
            // Add client info to each invoice for processing
            const enrichedInvoice = {
              id: invoice.id,
              amount: invoice.amount,
              date: invoice.date,
              status: invoice.status,
              currency: invoice.currency,
              description: invoice.description,
              client_id: client.id,
              client_name: client.name,
              client_currency: client.currency
            };
            
            // Apply date filtering if specified
            if (params?.dateRange?.from || params?.dateRange?.to) {
              if (invoice.date) {
                const invoiceDate = new Date(invoice.date);
                
                if (params.dateRange.from && invoiceDate < params.dateRange.from) continue;
                if (params.dateRange.to && invoiceDate > params.dateRange.to) continue;
              }
            }
            
            allInvoices.push(enrichedInvoice);
          }
        }
      }
    }
  }
  
  return allInvoices;
};

export const fetchSubscriptionsData = async (params?: any) => {
  let subscriptionsQuery = supabase.from('subscriptions').select('*');
  
  if (params?.dateRange?.from) {
    subscriptionsQuery = subscriptionsQuery.gte('created_at', params.dateRange.from.toISOString());
  }
  if (params?.dateRange?.to) {
    subscriptionsQuery = subscriptionsQuery.lte('created_at', params.dateRange.to.toISOString());
  }

  const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;

  if (subscriptionsError) {
    throw subscriptionsError;
  }
  
  return subscriptions;
};
