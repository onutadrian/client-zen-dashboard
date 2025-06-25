
import { supabase } from '@/integrations/supabase/client';

export const fetchClientsData = async () => {
  console.log('Fetching clients...');
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*');

  if (clientsError) {
    console.error('Error fetching clients:', clientsError);
    throw clientsError;
  }
  
  console.log('Clients fetched:', clients?.length || 0);
  return clients;
};

export const fetchProjectsData = async () => {
  console.log('Fetching projects...');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    throw projectsError;
  }
  
  console.log('Projects fetched:', projects?.length || 0);
  return projects;
};

export const fetchHourEntriesData = async (params?: any) => {
  console.log('Fetching hour entries...');
  let hourEntriesQuery = supabase.from('hour_entries').select('*');
  
  if (params?.dateRange?.from) {
    hourEntriesQuery = hourEntriesQuery.gte('date', params.dateRange.from.toISOString().split('T')[0]);
  }
  if (params?.dateRange?.to) {
    hourEntriesQuery = hourEntriesQuery.lte('date', params.dateRange.to.toISOString().split('T')[0]);
  }

  const { data: hourEntries, error: hoursError } = await hourEntriesQuery;

  if (hoursError) {
    console.error('Error fetching hour entries:', hoursError);
    throw hoursError;
  }
  
  console.log('Hour entries fetched:', hourEntries?.length || 0);
  return hourEntries;
};

export const fetchInvoicesData = async (params?: any) => {
  console.log('Fetching invoices from client arrays...');
  
  // Fetch all clients with their invoices
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('id, name, currency, invoices');

  if (clientsError) {
    console.error('Error fetching clients for invoices:', clientsError);
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
  
  console.log('Invoices extracted from clients:', allInvoices.length);
  console.log('Invoice details:', allInvoices.map(inv => ({
    amount: inv.amount,
    currency: inv.currency || inv.client_currency,
    status: inv.status,
    date: inv.date
  })));
  
  return allInvoices;
};

export const fetchSubscriptionsData = async (params?: any) => {
  console.log('Fetching subscriptions...');
  let subscriptionsQuery = supabase.from('subscriptions').select('*');
  
  if (params?.dateRange?.from) {
    subscriptionsQuery = subscriptionsQuery.gte('created_at', params.dateRange.from.toISOString());
  }
  if (params?.dateRange?.to) {
    subscriptionsQuery = subscriptionsQuery.lte('created_at', params.dateRange.to.toISOString());
  }

  const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;

  if (subscriptionsError) {
    console.error('Error fetching subscriptions:', subscriptionsError);
    throw subscriptionsError;
  }
  
  console.log('Subscriptions fetched:', subscriptions?.length || 0);
  return subscriptions;
};
