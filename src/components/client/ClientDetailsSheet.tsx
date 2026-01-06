
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import ClientInvoicesSection from './ClientInvoicesSection';
import ClientTeamSection from './ClientTeamSection';
import ClientLinksSection from './ClientLinksSection';
import ClientNotesSection from './ClientNotesSection';
import ClientDocumentsSection from './ClientDocumentsSection';

interface ClientDetailsSheetProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onInvoiceStatusUpdate?: (invoiceId: number, newStatus: string) => void;
}

const ClientDetailsSheet = ({ client, isOpen, onClose, onInvoiceStatusUpdate }: ClientDetailsSheetProps) => {
  const { demoMode, displayCurrency } = useCurrency();

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl font-bold">{client.name}</SheetTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge className={getStatusBadge(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {!demoMode && client.invoices && client.invoices.length > 0 && (
            <ClientInvoicesSection 
              client={client}
              displayCurrency={displayCurrency}
              formatCurrency={formatCurrency}
              onInvoiceStatusUpdate={onInvoiceStatusUpdate}
            />
          )}

          {client.people && client.people.length > 0 && (
            <ClientTeamSection people={client.people} />
          )}

          <ClientLinksSection links={client.links} />

          <ClientDocumentsSection documents={client.documents} />

          <ClientNotesSection notes={client.notes} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ClientDetailsSheet;
