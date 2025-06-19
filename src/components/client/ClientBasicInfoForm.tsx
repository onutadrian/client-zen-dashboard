
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientBasicInfoFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: {[key: string]: string};
}

const ClientBasicInfoForm = ({ formData, setFormData, errors }: ClientBasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Client Name *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Client name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.status ? 'border-red-500' : ''}`}
          value={formData.status || ''}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
      </div>
    </div>
  );
};

export default ClientBasicInfoForm;
