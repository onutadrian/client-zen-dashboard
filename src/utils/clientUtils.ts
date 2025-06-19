
// Map old price types to new ones for backward compatibility
export const mapPriceType = (priceType: string) => {
  const mapping = {
    'hour': 'hourly',
    'day': 'daily',
    'week': 'weekly',
    'month': 'monthly',
    'hourly': 'hourly',
    'daily': 'daily',
    'weekly': 'weekly',
    'monthly': 'monthly',
    'project': 'project'
  };
  return mapping[priceType] || 'hourly';
};

// Transform Supabase data to match our Client interface
export const transformSupabaseClient = (client: any) => ({
  id: client.id,
  name: client.name,
  price: Number(client.price),
  priceType: client.price_type,
  status: client.status,
  documents: client.documents || [],
  links: client.links || [],
  notes: client.notes || '',
  people: (client.people as any[]) || [],
  invoices: (client.invoices as any[]) || [],
  currency: client.currency || 'USD'
});

// Transform client data for Supabase format
export const transformClientForSupabase = (client: any, userId: string) => ({
  name: client.name,
  price: client.price,
  price_type: mapPriceType(client.priceType),
  status: client.status || 'active',
  documents: client.documents || [],
  links: client.links || [],
  notes: client.notes || '',
  people: client.people || [],
  invoices: client.invoices || [],
  currency: client.currency || 'USD',
  user_id: userId
});
