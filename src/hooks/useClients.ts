import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types/client';
import { loadClientsFromSupabase, addClientToSupabase, updateClientInSupabase } from '@/services/clientService';

// Export Client type for backward compatibility
export type { Client } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  // Load clients from Supabase on mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await loadClientsFromSupabase();
      setClients(clientsData);
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
      const transformedClient = await addClientToSupabase(newClient);
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
      await updateClientInSupabase(clientId, updatedClient);

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
