import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Clock, FileCheck, Plus } from 'lucide-react';
import { Client } from '@/types/client';
import { useCurrency } from '@/hooks/useCurrency';
import { useHourEntries } from '@/hooks/useHourEntries';
import { formatCurrency } from '@/lib/currency';
import ClientCardHeader from '@/components/client/ClientCardHeader';
import ClientDetailsSheet from '@/components/client/ClientDetailsSheet';
interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: number) => void;
  onInvoiceStatusUpdate?: (invoiceId: number, newStatus: string) => void;
}
const ClientCard = ({
  client,
  onEdit,
  onDelete,
  onInvoiceStatusUpdate
}: ClientCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {
    demoMode,
    displayCurrency,
    convert
  } = useCurrency();
  const {
    hourEntries
  } = useHourEntries();

  // Calculate client stats from hour entries
  const clientHourEntries = hourEntries.filter(entry => entry.clientId === client.id);
  const totalHours = clientHourEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const unbilledHours = clientHourEntries.filter(entry => !entry.billed).reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const paidInvoices = client.invoices?.filter(invoice => invoice.status === 'paid').length || 0;
  const totalInvoices = client.invoices?.length || 0;
  const totalInvoiceAmount = client.invoices?.reduce((sum, invoice) => {
    const convertedAmount = convert(invoice.amount, invoice.currency || client.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0) || 0;
  const formatDisplayAmount = (amount: number) => formatCurrency(amount, displayCurrency);
  const handleLogTimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement log time functionality
  };
  return <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <ClientCardHeader client={client} demoMode={demoMode} />
            
            {!demoMode && <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{totalHours} hours</span>
                    {unbilledHours > 0}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FileCheck className="w-4 h-4 mr-1" />
                    <span className="text-sm">{paidInvoices}/{totalInvoices} invoices paid</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="text-sm font-medium">{formatDisplayAmount(totalInvoiceAmount)}</span>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleLogTimeClick}>
                  <Plus className="w-3 h-3 mr-1" />
                  Log Time
                </Button>
              </div>}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(true)} className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(client.id)} className="text-red-600 hover:text-red-700">
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
        onInvoiceStatusUpdate={onInvoiceStatusUpdate}
      />
    </>;
};
export default ClientCard;