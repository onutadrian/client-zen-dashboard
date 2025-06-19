
// Map old price types to new ones for backward compatibility
export const mapPriceType = (priceType: string) => {
  const mapping = {
    'hour': 'hour',
    'day': 'day', 
    'week': 'week',
    'month': 'month',
    'hourly': 'hour',
    'daily': 'day',
    'weekly': 'week', 
    'monthly': 'month',
    'project': 'project'
  };
  
  const mappedType = mapping[priceType] || 'hour';
  console.log('Mapping price type:', priceType, 'to:', mappedType);
  return mappedType;
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
export const transformClientForSupabase = (client: any, userId: string) => {
  const mappedPriceType = mapPriceType(client.priceType);
  console.log('Transforming client for Supabase:', {
    originalPriceType: client.priceType,
    mappedPriceType: mappedPriceType
  });
  
  return {
    name: client.name,
    price: client.price,
    price_type: mappedPriceType,
    status: client.status || 'active',
    documents: client.documents || [],
    links: client.links || [],
    notes: client.notes || '',
    people: client.people || [],
    invoices: client.invoices || [],
    currency: client.currency || 'USD',
    user_id: userId
  };
};
