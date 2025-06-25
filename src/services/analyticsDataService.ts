
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
