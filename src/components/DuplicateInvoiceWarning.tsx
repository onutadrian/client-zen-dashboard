
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface DuplicateInvoiceWarningProps {
  milestoneTitle: string;
}

const DuplicateInvoiceWarning = ({ milestoneTitle }: DuplicateInvoiceWarningProps) => {
  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Invoice Already Exists</strong>
        <br />
        An invoice has already been created for milestone "{milestoneTitle}". 
        Each milestone can only have one invoice to prevent duplicate billing.
      </AlertDescription>
    </Alert>
  );
};

export default DuplicateInvoiceWarning;
