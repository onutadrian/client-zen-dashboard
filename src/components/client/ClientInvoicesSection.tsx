
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Link as LinkIcon } from 'lucide-react';

interface ClientInvoicesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  newInvoice: any;
  setNewInvoice: (invoice: any) => void;
  errors: {[key: string]: string};
  setErrors: (errors: {[key: string]: string}) => void;
}

const ClientInvoicesSection = ({ formData, setFormData, newInvoice, setNewInvoice, errors, setErrors }: ClientInvoicesSectionProps) => {
  const addInvoice = () => {
    const newErrors = {...errors};
    let hasErrors = false;

    if (!newInvoice.amount || parseFloat(newInvoice.amount) <= 0) {
      newErrors.invoiceAmount = 'Amount must be greater than 0';
      hasErrors = true;
    } else {
      delete newErrors.invoiceAmount;
    }

    if (!newInvoice.date) {
      newErrors.invoiceDate = 'Date is required';
      hasErrors = true;
    } else {
      delete newErrors.invoiceDate;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setFormData({
        ...formData,
        invoices: [...formData.invoices, { 
          ...newInvoice, 
          amount: parseFloat(newInvoice.amount),
          id: Date.now() 
        }]
      });
      setNewInvoice({ amount: '', date: '', status: 'pending', url: '', currency: 'USD' });
    }
  };

  const removeInvoice = (index: number) => {
    setFormData({
      ...formData,
      invoices: formData.invoices.filter((_: any, i: number) => i !== index)
    });
  };

  const updateInvoice = (index: number, field: string, value: any) => {
    const updatedInvoices = [...formData.invoices];
    updatedInvoices[index] = { ...updatedInvoices[index], [field]: value };
    setFormData({ ...formData, invoices: updatedInvoices });
  };

  return (
    <div>
      <Label>Invoices</Label>
      <div className="space-y-3">
        <div className="grid grid-cols-6 gap-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            className={errors.invoiceAmount ? 'border-red-500' : ''}
          />
          <Input
            type="date"
            value={newInvoice.date}
            onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
            className={errors.invoiceDate ? 'border-red-500' : ''}
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
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newInvoice.currency}
            onChange={(e) => setNewInvoice({ ...newInvoice, currency: e.target.value })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RON">RON</option>
          </select>
          <Input
            placeholder="Invoice URL"
            value={newInvoice.url}
            onChange={(e) => setNewInvoice({ ...newInvoice, url: e.target.value })}
          />
          <Button type="button" onClick={addInvoice} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {errors.invoiceAmount && <p className="text-red-500 text-sm">{errors.invoiceAmount}</p>}
        {errors.invoiceDate && <p className="text-red-500 text-sm">{errors.invoiceDate}</p>}
        
        {formData.invoices.map((invoice: any, index: number) => (
          <div key={index} className="grid grid-cols-6 gap-2 items-center bg-slate-50 p-3 rounded-lg">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={invoice.amount}
              onChange={(e) => updateInvoice(index, 'amount', parseFloat(e.target.value))}
            />
            <Input
              type="date"
              value={invoice.date}
              onChange={(e) => updateInvoice(index, 'date', e.target.value)}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={invoice.status}
              onChange={(e) => updateInvoice(index, 'status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={invoice.currency || 'USD'}
              onChange={(e) => updateInvoice(index, 'currency', e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RON">RON</option>
            </select>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Invoice URL"
                value={invoice.url || ''}
                onChange={(e) => updateInvoice(index, 'url', e.target.value)}
              />
              {invoice.url && (
                <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  <LinkIcon className="w-4 h-4" />
                </a>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeInvoice(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientInvoicesSection;
