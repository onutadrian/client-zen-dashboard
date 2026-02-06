
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';

interface ClientCardHeaderProps {
  client: Client;
  demoMode: boolean;
}

const ClientCardHeader = ({ client, demoMode }: ClientCardHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'ui-pill ui-pill--success';
      case 'inactive':
        return 'ui-pill ui-pill--danger';
      case 'pending':
        return 'ui-pill ui-pill--neutral';
      default:
        return 'ui-pill ui-pill--neutral';
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{client.name}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={getStatusBadge(client.status)}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ClientCardHeader;
