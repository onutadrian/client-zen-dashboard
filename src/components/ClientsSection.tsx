
import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientCard from '@/components/ClientCard';
import EditClientModal from '@/components/EditClientModal';
import { Client } from '@/types/client';

interface ClientsSectionProps {
  clients: Client[];
  onUpdateClient: (clientId: number, client: any) => void;
  displayCurrency: string;
  convertCurrency: (amount: number, from: string, to: string) => number;
  formatCurrency: (amount: number, currency: string) => string;
  activeClients: number;
  onAddClient: () => void;
  onInvoiceStatusUpdate?: (clientId: number, invoiceId: number, newStatus: string) => void;
}

const ClientsSection = ({
  clients,
  onUpdateClient,
  displayCurrency,
  convertCurrency,
  formatCurrency,
  activeClients,
  onAddClient,
  onInvoiceStatusUpdate
}: ClientsSectionProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleSaveClient = (updatedClient: Client) => {
    if (selectedClient) {
      onUpdateClient(selectedClient.id, updatedClient);
      setShowEditModal(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = (clientId: number) => {
    // TODO: Implement delete client functionality
    console.log('Delete client:', clientId);
  };

  return (
    <>
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            Clients ({clients.length})
          </h2>
          <Badge variant="secondary">{activeClients} Active</Badge>
        </div>
        
        <div className="space-y-4">
          {clients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onInvoiceStatusUpdate={onInvoiceStatusUpdate ? (invoiceId, newStatus) => 
                onInvoiceStatusUpdate(client.id, invoiceId, newStatus) : undefined}
            />
          ))}
          
          {clients.length === 0 && (
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No clients yet</h3>
                <p className="text-slate-500 text-center mb-4">Add your first client to get started with project management</p>
                <Button onClick={onAddClient} variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Client
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedClient && (
        <EditClientModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
          onSave={handleSaveClient}
        />
      )}
    </>
  );
};

export default ClientsSection;
