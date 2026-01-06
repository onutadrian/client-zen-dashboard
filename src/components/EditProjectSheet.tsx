
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Project } from '@/hooks/useProjects';

interface Client {
  id: number;
  name: string;
}

interface EditProjectSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (projectId: string, updatedProject: Project) => void;
  clients: Client[];
}

const EditProjectSheet = ({ project, isOpen, onClose, onUpdate, clients }: EditProjectSheetProps) => {
  const [formData, setFormData] = useState<Partial<Project>>({});

  React.useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && formData) {
      onUpdate(project.id, formData as Project);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!project) return null;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'RON': return 'RON';
      default: return currency;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select 
              value={formData.clientId?.toString() || ''} 
              onValueChange={(value) => handleInputChange('clientId', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency || 'USD'} 
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="RON">RON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pricing Type Selection */}
          <div className="space-y-2">
            <Label>Pricing Type</Label>
            <RadioGroup 
              value={formData.pricingType || 'fixed'} 
              onValueChange={(value: 'fixed' | 'hourly' | 'daily') => handleInputChange('pricingType', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="edit-fixed" />
                <Label htmlFor="edit-fixed">Fixed Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="edit-hourly" />
                <Label htmlFor="edit-hourly">Hourly Rate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="edit-daily" />
                <Label htmlFor="edit-daily">Daily Rate</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional Pricing Fields */}
          {formData.pricingType === 'fixed' ? (
            <div className="space-y-2">
              <Label htmlFor="fixedPrice">Fixed Price ({getCurrencySymbol(formData.currency || 'USD')})</Label>
              <Input
                id="fixedPrice"
                type="number"
                step="0.01"
                value={formData.fixedPrice || ''}
                onChange={(e) => handleInputChange('fixedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Enter fixed price"
              />
            </div>
          ) : formData.pricingType === 'hourly' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ({getCurrencySymbol(formData.currency || 'USD')})</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Rate per hour"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgentHourlyRate">Urgent Rate ({getCurrencySymbol(formData.currency || 'USD')})</Label>
                  <Input
                    id="urgentHourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.urgentHourlyRate || ''}
                    onChange={(e) => handleInputChange('urgentHourlyRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Urgent rate per hour"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours || ''}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Estimated hours"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate ({getCurrencySymbol(formData.currency || 'USD')})</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  value={formData.dailyRate || ''}
                  onChange={(e) => handleInputChange('dailyRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Rate per day"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours || ''}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Estimated hours"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                value={formData.estimatedEndDate || ''}
                onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status || ''} 
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500">
              Update Project
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditProjectSheet;
