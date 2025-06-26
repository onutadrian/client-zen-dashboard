import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { transformSupabaseClient, transformClientForSupabase, mapPriceType } from '@/utils/clientUtils';

export const loadClientsFromSupabase = async (): Promise<Client[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('loadClientsFromSupabase - No user found');
    return [];
  }

  console.log('loadClientsFromSupabase - User ID:', user.id);

  // Check user role first
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('loadClientsFromSupabase - Profile error:', profileError);
    throw profileError;
  }

  console.log('loadClientsFromSupabase - User role:', profile.role);

  // Get clients based on RLS policies
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('loadClientsFromSupabase - Raw clients from DB:', data);
  console.log('loadClientsFromSupabase - DB error:', error);

  if (error) throw error;

  const transformedClients = data.map(transformSupabaseClient);
  console.log('loadClientsFromSupabase - Transformed clients:', transformedClients);

  return transformedClients;
};

export const addClientToSupabase = async (newClient: any): Promise<Client> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const supabaseClient = transformClientForSupabase(newClient, user.id);

  const { data, error } = await supabase
    .from('clients')
    .insert([supabaseClient])
    .select()
    .single();

  if (error) throw error;

  return transformSupabaseClient(data);
};

export const updateClientInSupabase = async (clientId: number, updatedClient: any): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Transform to Supabase format with explicit price type mapping
  const mappedPriceType = mapPriceType(updatedClient.priceType);
  
  const supabaseUpdate = {
    name: updatedClient.name,
    price: updatedClient.price,
    price_type: mappedPriceType,
    status: updatedClient.status,
    documents: updatedClient.documents,
    links: updatedClient.links,
    notes: updatedClient.notes,
    people: updatedClient.people,
    invoices: updatedClient.invoices,
    currency: updatedClient.currency
  };

  const { error } = await supabase
    .from('clients')
    .update(supabaseUpdate)
    .eq('id', clientId)
    .eq('user_id', user.id); // Ensure user can only update their own clients

  if (error) {
    throw error;
  }
};
