
import { useState } from 'react';

export interface Client {
  id: number;
  name: string;
  price: number;
  priceType: string;
  status: string;
  totalHours: number;
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
  hourEntries: any[];
  currency: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Acme Corporation",
      price: 150,
      priceType: "hour",
      status: "active",
      totalHours: 45,
      documents: ["Contract.pdf", "Project Brief.docx"],
      links: ["https://acme.com", "https://acme-staging.com"],
      notes: "Primary contact prefers email communication. Weekly standups on Mondays.",
      people: [
        { name: "John Smith", email: "john@acme.com", title: "Project Manager" },
        { name: "Sarah Wilson", email: "sarah@acme.com", title: "Technical Lead" }
      ],
      invoices: [
        { id: 1, amount: 6750, date: "2024-06-01", status: "paid" },
        { id: 2, amount: 4500, date: "2024-05-01", status: "pending" }
      ],
      hourEntries: [],
      currency: "USD"
    }
  ]);

  const addClient = (newClient: any) => {
    setClients([...clients, { ...newClient, id: Date.now(), hourEntries: [] }]);
  };

  const updateClient = (clientId: number, updatedClient: any) => {
    setClients(clients.map(client => 
      client.id === clientId ? updatedClient : client
    ));
  };

  return {
    clients,
    addClient,
    updateClient
  };
};
