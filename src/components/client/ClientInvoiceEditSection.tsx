
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ClientInvoiceEditSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  newInvoice: any;
  setNewInvoice: (invoice: any) => void;
  errors: {[key: string]: string};
  setErrors: (errors: {[key: string]: string}) => void;
}

const ClientInvoiceEditSection = ({ 
  formData, 
  setFormData, 
  newInvoice, 
  setNewInvoice, 
  errors, 
  setErrors 
}: ClientInvoiceEditSectionProps) => {
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
      setNewInvoice({ amount: '', date: '', status: 'pending', url: '', currency: formData.currency || 'USD' });
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

  return (
    <div>
      <Label>Invoices</Label>
      <div className="space-y-3">
        <div className="grid grid-cols-6 gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            className={errors.invoiceAmount ? 'border-red-500' : ''}
          />
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
        {errors.invoiceAmount && <p className="text-red-500 text-sm">{errors.invoiceAmount}</p>}
        {formData.invoices.map((invoice: any, index: number) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div>
              <div className="font-medium">${invoice.amount}</div>
              <div className="text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={invoice.status === 'paid' ? 'ui-pill ui-pill--success' : 'ui-pill ui-pill--neutral'}>
                {invoice.status}
              </Badge>
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

export default ClientInvoiceEditSection;
