
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvoices } from '@/hooks/useInvoices';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface InvoiceStatusButtonProps {
  invoiceId: string;
  currentStatus: 'paid' | 'pending' | 'overdue';
  onStatusChange?: () => void;
}

const InvoiceStatusButton = ({ invoiceId, currentStatus, onStatusChange }: InvoiceStatusButtonProps) => {
  const { updateInvoice } = useInvoices();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'paid' | 'pending' | 'overdue') => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      await updateInvoice(invoiceId, { status: newStatus });
      onStatusChange?.();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'paid':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 px-2 py-1 rounded border text-xs ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="capitalize">{currentStatus}</span>
      </div>
      
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange} 
        disabled={isUpdating}
      >
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue placeholder="Change" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default InvoiceStatusButton;
