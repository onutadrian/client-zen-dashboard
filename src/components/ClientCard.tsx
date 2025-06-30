
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LogHoursModal from './LogHoursModal';
import EditClientModal from './EditClientModal';
import ClientCardHeader from './client/ClientCardHeader';
import ClientCardStats from './client/ClientCardStats';
import ClientDetailsSheet from './client/ClientDetailsSheet';
import { useCurrency } from '@/hooks/useCurrency';

interface HourEntry {
  id: number;
  hours: number;
  description: string;
  date: string;
  billed?: boolean;
}

interface ClientCardProps {
  client: any;
  onUpdateClient?: (clientId: number, updatedClient: any) => void;
  displayCurrency?: string;
  formatCurrency?: (amount: number, currency: string) => string;
}

const ClientCard = ({
  client,
  onUpdateClient,
  displayCurrency = 'USD',
  formatCurrency
}: ClientCardProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hourEntries, setHourEntries] = useState<HourEntry[]>(client.hourEntries || []);
  const { convert } = useCurrency();

  // Update hour entries when client data changes
  useEffect(() => {
    console.log('Client hour entries updated:', client.hourEntries);
    setHourEntries(client.hourEntries || []);
  }, [client.hourEntries]);

  const getPriceDisplay = () => {
    const typeMap = {
      hour: '/hr',
      day: '/day',
      week: '/week',
      month: '/month'
    };
    
    const convertedPrice = convert(client.price, client.currency || 'USD', displayCurrency);
    return `${formatCurrency(convertedPrice, displayCurrency)}${typeMap[client.priceType] || ''}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-l-gray-300 hover:border-l-green-500';
      case 'inactive':
        return 'border-l-gray-300 hover:border-l-gray-500';
      case 'pending':
        return 'border-l-gray-300 hover:border-l-yellow-500';
      default:
        return 'border-l-gray-300 hover:border-l-gray-500';
    }
  };

  const handleLogHours = (hours: number, description: string, date: string) => {
    const newEntry: HourEntry = {
      id: Date.now(),
      hours,
      description,
      date,
      billed: false
    };
    const updatedEntries = [...hourEntries, newEntry];
    setHourEntries(updatedEntries);

    // Update the client's total hours
    const totalHours = updatedEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const updatedClient = {
      ...client,
      totalHours,
      hourEntries: updatedEntries
    };
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const handleEditClient = (updatedClient: any) => {
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const toggleBilledStatus = (entryId: number) => {
    const updatedEntries = hourEntries.map(entry => entry.id === entryId ? {
      ...entry,
      billed: !entry.billed
    } : entry);
    setHourEntries(updatedEntries);
    const updatedClient = {
      ...client,
      hourEntries: updatedEntries
    };
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open sheet if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    setIsSheetOpen(true);
  };

  const totalInvoiceAmount = client.invoices?.reduce((sum: number, inv: any) => {
    const convertedAmount = convert(inv.amount, inv.currency || client.currency || 'USD', displayCurrency);
    return sum + convertedAmount;
  }, 0) || 0;
  
  const paidInvoices = client.invoices?.filter((inv: any) => inv.status === 'paid').length || 0;
  const totalInvoices = client.invoices?.length || 0;
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = hourEntries.filter(entry => entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = totalHours - billedHours;
  
  const formatDisplayAmount = (amount: number) => {
    if (formatCurrency) {
      return formatCurrency(amount, displayCurrency);
    }
    return `$${amount.toLocaleString()}`;
  };
  
  return (
    <>
      <Card 
        className={`
          transition-all duration-300 border-l-4 cursor-pointer
          ${getBorderColor(client.status)}
        `} 
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <ClientCardHeader
            client={client}
            getPriceDisplay={getPriceDisplay}
            getStatusColor={getStatusColor}
            onEditClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
          />
          
          <ClientCardStats
            totalHours={totalHours}
            unbilledHours={unbilledHours}
            paidInvoices={paidInvoices}
            totalInvoices={totalInvoices}
            totalInvoiceAmount={totalInvoiceAmount}
            formatDisplayAmount={formatDisplayAmount}
            onLogTimeClick={(e) => {
              e.stopPropagation();
              setShowLogHoursModal(true);
            }}
          />
        </CardHeader>
      </Card>

      <ClientDetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        client={client}
        hourEntries={hourEntries}
        billedHours={billedHours}
        unbilledHours={unbilledHours}
        onToggleBilledStatus={toggleBilledStatus}
        displayCurrency={displayCurrency}
        formatCurrency={formatCurrency}
      />

      <LogHoursModal 
        isOpen={showLogHoursModal} 
        onClose={() => setShowLogHoursModal(false)} 
        onLogHours={handleLogHours} 
        clientName={client.name} 
        priceType={client.priceType} 
      />

      <EditClientModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        client={client} 
        onSave={handleEditClient} 
      />
    </>
  );
};

export default ClientCard;
