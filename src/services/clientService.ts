
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { transformSupabaseClient, transformClientForSupabase, mapPriceType } from '@/utils/clientUtils';

export const loadClientsFromSupabase = async (): Promise<Client[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated');
    return [];
  }

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(transformSupabaseClient);
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
  console.log('Updating client with price type:', updatedClient.priceType, 'mapped to:', mappedPriceType);
  
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

  console.log('Supabase update payload:', supabaseUpdate);

  const { error } = await supabase
    .from('clients')
    .update(supabaseUpdate)
    .eq('id', clientId)
    .eq('user_id', user.id); // Ensure user can only update their own clients

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }
};
