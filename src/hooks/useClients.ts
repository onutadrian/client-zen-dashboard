
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: number;
  name: string;
  price: number;
  priceType: string;
  status: string;
  documents: string[];
  links: string[];
  notes: string;
  people: Array<{
    name: string;
    email: string;
    title: string;
  }>;
  invoices: Array<{
    id: number;
    amount: number;
    date: string;
    status: string;
  }>;
  currency: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  // Load clients from Supabase on mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Client interface
      const transformedClients: Client[] = data.map(client => ({
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
      }));

      setClients(transformedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    }
  };

  const addClient = async (newClient: any) => {
    try {
      // Transform to Supabase format
      const supabaseClient = {
        name: newClient.name,
        price: newClient.price,
        price_type: newClient.priceType,
        status: newClient.status || 'active',
        documents: newClient.documents || [],
        links: newClient.links || [],
        notes: newClient.notes || '',
        people: newClient.people || [],
        invoices: newClient.invoices || [],
        currency: newClient.currency || 'USD'
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([supabaseClient])
        .select()
        .single();

      if (error) throw error;

      // Transform back to our format and add to state
      const transformedClient: Client = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        priceType: data.price_type,
        status: data.status,
        documents: data.documents || [],
        links: data.links || [],
        notes: data.notes || '',
        people: (data.people as any[]) || [],
        invoices: (data.invoices as any[]) || [],
        currency: data.currency || 'USD'
      };

      setClients(prev => [...prev, transformedClient]);
      
      toast({
        title: "Success",
        description: "Client added successfully"
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive"
      });
    }
  };

  const updateClient = async (clientId: number, updatedClient: any) => {
    try {
      // Transform to Supabase format
      const supabaseUpdate = {
        name: updatedClient.name,
        price: updatedClient.price,
        price_type: updatedClient.priceType,
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
        .eq('id', clientId);

      if (error) throw error;

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === clientId ? updatedClient : client
      ));

      toast({
        title: "Success",
        description: "Client updated successfully"
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive"
      });
    }
  };

  return {
    clients,
    addClient,
    updateClient
  };
};
