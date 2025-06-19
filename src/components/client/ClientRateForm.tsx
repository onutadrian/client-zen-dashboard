
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientRateFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: {[key: string]: string};
}

const ClientRateForm = ({ formData, setFormData, errors }: ClientRateFormProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="price">Rate *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price || ''}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          placeholder="Rate amount"
          className={errors.price ? 'border-red-500' : ''}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>
      <div>
        <Label htmlFor="priceType">Rate Type *</Label>
        <select
          id="priceType"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.priceType ? 'border-red-500' : ''}`}
          value={formData.priceType || ''}
          onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
        >
          <option value="">Select type</option>
          <option value="hour">Per Hour</option>
          <option value="day">Per Day</option>
          <option value="week">Per Week</option>
          <option value="month">Per Month</option>
        </select>
        {errors.priceType && <p className="text-red-500 text-sm mt-1">{errors.priceType}</p>}
      </div>
      <div>
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.currency || 'USD'}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
        >
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
          <option value="RON">Romanian Lei (RON)</option>
        </select>
      </div>
    </div>
  );
};

export default ClientRateForm;
