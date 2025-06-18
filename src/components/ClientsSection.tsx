
import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientCard from '@/components/ClientCard';

interface Client {
  id: number;
  name: string;
  status: string;
}

interface ClientsSectionProps {
  clients: Client[];
  onUpdateClient: (clientId: number, client: any) => void;
  displayCurrency: string;
  convertCurrency: (amount: number, from: string, to: string) => number;
  formatCurrency: (amount: number, currency: string) => string;
  activeClients: number;
  onAddClient: () => void;
}

const ClientsSection = ({
  clients,
  onUpdateClient,
  displayCurrency,
  convertCurrency,
  formatCurrency,
  activeClients,
  onAddClient
}: ClientsSectionProps) => {
  return (
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
            onUpdateClient={onUpdateClient} 
            displayCurrency={displayCurrency} 
            convertCurrency={convertCurrency} 
            formatCurrency={formatCurrency} 
          />
        ))}
        
        {clients.length === 0 && (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No clients yet</h3>
              <p className="text-slate-500 text-center mb-4">Add your first client to get started with project management</p>
              <Button onClick={onAddClient} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientsSection;
