
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, FileCheck, Plus } from 'lucide-react';

interface ClientCardStatsProps {
  totalHours: number;
  unbilledHours: number;
  paidInvoices: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  formatDisplayAmount: (amount: number) => string;
  onLogTimeClick: (e: React.MouseEvent) => void;
}

const ClientCardStats = ({
  totalHours,
  unbilledHours,
  paidInvoices,
  totalInvoices,
  totalInvoiceAmount,
  formatDisplayAmount,
  onLogTimeClick
}: ClientCardStatsProps) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-slate-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{totalHours} hours</span>
          {unbilledHours > 0 && <span className="text-xs text-orange-600 ml-1">({unbilledHours} unbilled)</span>}
        </div>
        <div className="flex items-center text-slate-600">
          <FileCheck className="w-4 h-4 mr-1" />
          <span className="text-sm">{paidInvoices}/{totalInvoices} invoices paid</span>
        </div>
        <div className="flex items-center text-green-600">
          <span className="text-sm font-medium">{formatDisplayAmount(totalInvoiceAmount)}</span>
        </div>
      </div>
      <Button variant="primary" size="sm" onClick={onLogTimeClick}>
        <Plus className="w-3 h-3 mr-1" />
        Log Time
      </Button>
    </div>
  );
};

export default ClientCardStats;
