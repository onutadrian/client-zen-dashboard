
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Client {
  id: number;
  name: string;
  priceType: string;
}

interface ClientSelectDropdownProps {
  clients: Client[];
  selectedClientId: number | null;
  onClientChange: (clientId: number | null) => void;
  label?: string;
  required?: boolean;
}

const ClientSelectDropdown = ({
  clients,
  selectedClientId,
  onClientChange,
  label = "Client",
  required = false
}: ClientSelectDropdownProps) => {
  const handleValueChange = (value: string) => {
    if (value === "no-clients") return;
    onClientChange(Number(value));
  };

  console.log('ClientSelectDropdown - Available clients:', clients);
  console.log('ClientSelectDropdown - Selected client ID:', selectedClientId);

  return (
    <div>
      <Label htmlFor="client">
        {label} {required && "*"}
      </Label>
      <Select 
        value={selectedClientId?.toString() || ''} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={clients.length === 0 ? "No clients available" : "Select a client"} />
        </SelectTrigger>
        <SelectContent>
          {clients.length === 0 ? (
            <SelectItem value="no-clients" disabled>
              No clients available
            </SelectItem>
          ) : (
            clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelectDropdown;
