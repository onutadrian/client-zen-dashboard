
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { Client } from '@/types/client';
import { formatCurrency } from '@/lib/currency';

interface ClientCardHeaderProps {
  client: Client;
  demoMode: boolean;
}

const ClientCardHeader = ({ client, demoMode }: ClientCardHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
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
          {!demoMode && (
            <span className="text-sm text-slate-600">
              {client.priceType === 'hourly' ? 'Hourly' : 
               client.priceType === 'daily' ? 'Daily' : 'Fixed'}
            </span>
          )}
        </div>
      </div>
      {!demoMode && (
        <div className="text-right">
          <div className="flex items-center text-lg font-bold text-slate-800">
            <DollarSign className="w-4 h-4 mr-1" />
            {formatCurrency(client.price, client.currency)}
          </div>
          <div className="text-xs text-slate-500">
            {client.priceType === 'hourly' ? 'per hour' : 
             client.priceType === 'daily' ? 'per day' : 'fixed price'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCardHeader;
