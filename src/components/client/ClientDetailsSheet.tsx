
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import ClientHourEntriesSection from './ClientHourEntriesSection';
import ClientNotesSection from './ClientNotesSection';
import ClientTeamSection from './ClientTeamSection';
import ClientDocumentsSection from './ClientDocumentsSection';
import ClientLinksSection from './ClientLinksSection';
import ClientInvoicesSection from './ClientInvoicesSection';

interface HourEntry {
  id: number;
  hours: number;
  description: string;
  date: string;
  billed?: boolean;
}

interface ClientDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  hourEntries: HourEntry[];
  billedHours: number;
  unbilledHours: number;
  onToggleBilledStatus: (entryId: number) => void;
  displayCurrency: string;
  formatCurrency: (amount: number, currency: string) => string;
}

const ClientDetailsSheet = ({
  isOpen,
  onOpenChange,
  client,
  hourEntries,
  billedHours,
  unbilledHours,
  onToggleBilledStatus,
  displayCurrency,
  formatCurrency
}: ClientDetailsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{client.name} - Details</SheetTitle>
          <SheetDescription>
            View and manage client information, logged hours, and project details.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <ClientHourEntriesSection
            hourEntries={hourEntries}
            billedHours={billedHours}
            unbilledHours={unbilledHours}
            onToggleBilledStatus={onToggleBilledStatus}
          />
          
          <ClientNotesSection notes={client.notes} />
          
          <ClientTeamSection people={client.people} />
          
          <ClientDocumentsSection documents={client.documents} />
          
          <ClientLinksSection links={client.links} />
          
          <ClientInvoicesSection
            client={client}
            displayCurrency={displayCurrency}
            formatCurrency={formatCurrency}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ClientDetailsSheet;
