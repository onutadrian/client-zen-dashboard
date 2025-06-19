
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText, CheckCircle } from 'lucide-react';
import InvoiceStatusButton from './InvoiceStatusButton';
import DuplicateInvoiceWarning from './DuplicateInvoiceWarning';
import { Milestone } from '@/hooks/useMilestones';
import { formatDate } from '@/lib/utils';

interface Invoice {
  id: string;
  status: string;
  amount: number;
}

interface MilestoneCardProps {
  milestone: Milestone;
  milestoneInvoice?: Invoice;
  isCreatingInvoice: boolean;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestoneId: string) => void;
  onCreateInvoice: (milestone: Milestone) => void;
  onMarkAsPaid: (milestone: Milestone) => void;
  onInvoiceStatusChange: () => void;
  hasClient: boolean;
}

const MilestoneCard = ({
  milestone,
  milestoneInvoice,
  isCreatingInvoice,
  onEdit,
  onDelete,
  onCreateInvoice,
  onMarkAsPaid,
  onInvoiceStatusChange,
  hasClient
}: MilestoneCardProps) => {
  return (
    <div className="border rounded-lg p-4">
      {isCreatingInvoice && milestoneInvoice && (
        <div className="mb-4">
          <DuplicateInvoiceWarning milestoneTitle={milestone.title} />
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium">{milestone.title}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
              milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {milestone.status.replace('-', ' ')}
            </span>
            {milestone.paymentStatus && (
              <span className={`px-2 py-1 rounded text-xs ${
                milestone.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                milestone.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {milestone.paymentStatus}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-1">{milestone.description}</p>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Due: {formatDate(milestone.targetDate)}</span>
            {milestone.amount && (
              <span>Value: ${milestone.amount.toLocaleString()}</span>
            )}
            <span>{milestone.completionPercentage}% complete</span>
          </div>
          
          {milestoneInvoice && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Invoice:</span>
                <InvoiceStatusButton 
                  invoiceId={milestoneInvoice.id}
                  currentStatus={milestoneInvoice.status}
                  onStatusChange={onInvoiceStatusChange}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Top right action buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {milestone.status === 'completed' && milestone.paymentStatus === 'unpaid' && milestoneInvoice && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkAsPaid(milestone)}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Paid
            </Button>
          )}
          {milestone.status === 'completed' && milestone.paymentStatus === 'unpaid' && !milestoneInvoice && hasClient && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCreateInvoice(milestone)}
              disabled={isCreatingInvoice}
              className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-1" />
              {isCreatingInvoice ? 'Creating...' : 'Invoice'}
            </Button>
          )}
          {milestoneInvoice && (
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Invoice exists
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(milestone)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(milestone.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
