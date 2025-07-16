
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, ExternalLink, Plus, X } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import InvoiceStatusButton from '@/components/InvoiceStatusButton';

interface ClientInvoicesSectionProps {
  // For display mode (ClientDetailsSheet)
  client?: any;
  displayCurrency?: string;
  formatCurrency?: (amount: number, currency: string) => string;
  onInvoiceStatusUpdate?: (invoiceId: number, newStatus: string) => void;
  // For edit mode (EditClientModal)
  formData?: any;
  setFormData?: (data: any) => void;
  newInvoice?: any;
  setNewInvoice?: (invoice: any) => void;
  errors?: {[key: string]: string};
  setErrors?: (errors: {[key: string]: string}) => void;
}

const ClientInvoicesSection = ({ 
  client, 
  displayCurrency, 
  formatCurrency,
  onInvoiceStatusUpdate,
  formData,
  setFormData,
  newInvoice,
  setNewInvoice,
  errors,
  setErrors
}: ClientInvoicesSectionProps) => {
  const { convert } = useCurrency();
  
  // Display mode (for ClientDetailsSheet)
  if (client && !formData) {
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
                  <select
                    className={`text-xs px-2 py-1 rounded border ${
                      invoice.status === 'paid' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : invoice.status === 'overdue' 
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                    value={invoice.status}
                    onChange={(e) => {
                      if (onInvoiceStatusUpdate) {
                        onInvoiceStatusUpdate(invoice.id, e.target.value);
                      }
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
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
  }

  // Edit mode (for EditClientModal)
  if (!formData || !setFormData || !newInvoice || !setNewInvoice) return null;

  const addInvoice = () => {
    if (newInvoice.amount && newInvoice.date) {
      if (isNaN(parseFloat(newInvoice.amount)) || parseFloat(newInvoice.amount) <= 0) {
        setErrors({...errors, invoiceAmount: 'Please enter a valid amount'});
        return;
      }
      setFormData({
        ...formData,
        invoices: [...formData.invoices, { ...newInvoice, id: Date.now(), amount: parseFloat(newInvoice.amount) }]
      });
      setNewInvoice({ amount: '', date: '', status: 'pending', url: '', currency: 'USD' });
      const newErrors = {...errors};
      delete newErrors.invoiceAmount;
      setErrors(newErrors);
    }
  };

  const removeInvoice = (index: number) => {
    setFormData({
      ...formData,
      invoices: formData.invoices.filter((_: any, i: number) => i !== index)
    });
  };

  const updateInvoiceStatus = (index: number, newStatus: string) => {
    const updatedInvoices = [...formData.invoices];
    updatedInvoices[index] = { ...updatedInvoices[index], status: newStatus };
    setFormData({
      ...formData,
      invoices: updatedInvoices
    });
  };

  return (
    <div>
      <Label>Invoices</Label>
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            className={errors?.invoiceAmount ? 'border-red-500' : ''}
          />
          <Input
            type="date"
            value={newInvoice.date}
            onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newInvoice.status}
            onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <Input
            placeholder="Invoice URL (optional)"
            value={newInvoice.url}
            onChange={(e) => setNewInvoice({ ...newInvoice, url: e.target.value })}
          />
          <Button type="button" onClick={addInvoice} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {errors?.invoiceAmount && <p className="text-red-500 text-sm">{errors.invoiceAmount}</p>}
        {formData.invoices.map((invoice: any, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div>
              <div className="font-medium">${invoice.amount}</div>
              <div className="text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="text-xs px-2 py-1 rounded border"
                value={invoice.status}
                onChange={(e) => updateInvoiceStatus(index, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInvoice(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientInvoicesSection;
