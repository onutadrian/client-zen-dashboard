
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
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive"
      });
    }
  };

  const updateClientInvoiceStatus = async (clientId: number, invoiceId: number, newStatus: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.invoices) return;

      const updatedInvoices = client.invoices.map((invoice: any) => 
        invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
      );

      const updatedClient = { ...client, invoices: updatedInvoices };
      
      await updateClientInSupabase(clientId, updatedClient);
      setClients(prev => prev.map(c => 
        c.id === clientId ? updatedClient : c
      ));

      toast({
        title: "Success",
        description: "Invoice status updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive"
      });
    }
  };

  return {
    clients,
    addClient,
    updateClient,
    updateClientInvoiceStatus
  };
};
