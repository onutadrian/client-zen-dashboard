
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types/client';
import { loadClientsFromSupabase, addClientToSupabase, updateClientInSupabase } from '@/services/clientService';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  const loadClients = async () => {
    try {
      const clientsData = await loadClientsFromSupabase();
      setClients(clientsData);
    } catch (error) {
      console.error('useClients - Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

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
