
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ClientCardHeaderProps {
  client: any;
  getPriceDisplay: () => string;
  getStatusColor: (status: string) => string;
  onEditClick: (e: React.MouseEvent) => void;
}

const ClientCardHeader = ({ client, getPriceDisplay, getStatusColor, onEditClick }: ClientCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h3 className="text-xl font-semibold text-slate-800">{client.name}</h3>
        <Badge className={getStatusColor(client.status)}>
          {client.status}
        </Badge>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{getPriceDisplay()}</div>
          <div className="text-sm text-slate-500">Rate</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEditClick}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClientCardHeader;
