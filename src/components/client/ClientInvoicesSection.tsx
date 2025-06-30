
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ExternalLink } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface ClientInvoicesSectionProps {
  client: any;
  displayCurrency: string;
  formatCurrency: (amount: number, currency: string) => string;
}

const ClientInvoicesSection = ({ client, displayCurrency, formatCurrency }: ClientInvoicesSectionProps) => {
  const { convert } = useCurrency();
  
  if (!client.invoices || client.invoices.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium text-slate-700 mb-3 flex items-center">
        <FileCheck className="w-4 h-4 mr-2" />
        Invoices ({client.invoices.length})
      </h4>
      <div className="space-y-2">
        {client.invoices.map((invoice: any) => {
          const displayAmount = formatCurrency(convert(invoice.amount, invoice.currency || client.currency || 'USD', displayCurrency), displayCurrency);
          return (
            <div key={invoice.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
              <div>
                <div className="font-medium text-slate-800">{displayAmount}</div>
                <div className="text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {invoice.status}
                </Badge>
                {invoice.url && (
                  <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientInvoicesSection;
