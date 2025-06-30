
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Client } from '@/types/client';
import { useCurrency } from '@/hooks/useCurrency';
import ClientCardHeader from '@/components/client/ClientCardHeader';
import ClientCardStats from '@/components/client/ClientCardStats';
import ClientDetailsSheet from '@/components/client/ClientDetailsSheet';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: number) => void;
}

const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { demoMode } = useCurrency();

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <ClientCardHeader client={client} demoMode={demoMode} />
            
            {!demoMode && <ClientCardStats client={client} />}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(true)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(client)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ClientDetailsSheet
        client={client}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};

export default ClientCard;
