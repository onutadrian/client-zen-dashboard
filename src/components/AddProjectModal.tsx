import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Client {
  id: number;
  name: string;
  currency?: string;
  documents?: string[];
  links?: string[];
  people?: Array<{ name: string; email: string; title: string }>;
  notes?: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: any) => void;
  clients: Client[];
}

const AddProjectModal = ({ isOpen, onClose, onAdd, clients }: AddProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    startDate: '',
    estimatedEndDate: '',
    status: 'active',
    notes: '',
    team: '',
    pricingType: 'fixed' as 'fixed' | 'hourly',
    fixedPrice: '',
    hourlyRate: '',
    urgentHourlyRate: '',
    estimatedHours: '',
    currency: 'EUR',
    useMilestones: true,
  });
  
  const [inheritOptions, setInheritOptions] = useState({
    documents: false,
    links: false,
    team: false,
    notes: false
  });

  const selectedClient = clients.find(c => c.id.toString() === formData.clientId);

  // Auto-select client currency when client is selected
  useEffect(() => {
    if (selectedClient && selectedClient.currency) {
      setFormData(prev => ({ ...prev, currency: selectedClient.currency || 'EUR' }));
    }
  }, [selectedClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let projectDocuments: string[] = [];
    let projectTeam: string[] = formData.team ? formData.team.split(',').map(t => t.trim()) : [];
    let projectNotes = formData.notes;

    // Inherit data from client if selected
    if (selectedClient) {
      if (inheritOptions.documents && selectedClient.documents) {
        projectDocuments = [...projectDocuments, ...selectedClient.documents];
      }
      
      if (inheritOptions.links && selectedClient.links) {
        // Add links with LINK: prefix to match our current storage format
        const linksWithPrefix = selectedClient.links.map(link => `LINK: ${link}`);
        projectDocuments = [...projectDocuments, ...linksWithPrefix];
      }
      
      if (inheritOptions.team && selectedClient.people) {
        const clientTeamMembers = selectedClient.people.map(person => person.name);
        projectTeam = [...new Set([...projectTeam, ...clientTeamMembers])]; // Remove duplicates
      }
      
      if (inheritOptions.notes && selectedClient.notes) {
        projectNotes = projectNotes ? `${projectNotes}\n\nFrom Client:\n${selectedClient.notes}` : selectedClient.notes;
      }
    }

    const projectData = {
      name: formData.name,
      clientId: parseInt(formData.clientId),
      startDate: formData.startDate,
      estimatedEndDate: formData.estimatedEndDate,
      status: formData.status,
      notes: projectNotes,
      documents: projectDocuments,
      team: projectTeam,
      pricingType: formData.pricingType,
      fixedPrice: formData.pricingType === 'fixed' && formData.fixedPrice ? parseFloat(formData.fixedPrice) : undefined,
      hourlyRate: formData.pricingType === 'hourly' && formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      urgentHourlyRate: formData.pricingType === 'hourly' && formData.urgentHourlyRate ? parseFloat(formData.urgentHourlyRate) : undefined,
      estimatedHours: formData.pricingType === 'hourly' && formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      currency: formData.currency,
      invoices: [],
      useMilestones: formData.useMilestones,
    };

    onAdd(projectData);
    
    // Reset form
    setFormData({
      name: '',
      clientId: '',
      startDate: '',
      estimatedEndDate: '',
      status: 'active',
      notes: '',
      team: '',
      pricingType: 'fixed',
      fixedPrice: '',
      hourlyRate: '',
      urgentHourlyRate: '',
      estimatedHours: '',
      currency: 'EUR',
      useMilestones: true,
    });
    setInheritOptions({
      documents: false,
      links: false,
      team: false,
      notes: false
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInheritChange = (field: string, checked: boolean) => {
    setInheritOptions(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleChange('clientId', value)}>
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
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
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
          <div>
            <Label>Pricing Type</Label>
            <RadioGroup 
              value={formData.pricingType} 
              onValueChange={(value: 'fixed' | 'hourly') => handleChange('pricingType', value)}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly">Hourly Rate</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Use Milestones */}
          <div className="flex items-center justify-between">
            <Label htmlFor="useMilestones">Use milestones</Label>
            <Switch
              id="useMilestones"
              checked={formData.useMilestones}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useMilestones: checked }))}
            />
          </div>

          {/* Conditional Pricing Fields */}
          {formData.pricingType === 'fixed' ? (
            <div>
              <Label htmlFor="fixedPrice">Fixed Price ({formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : 'RON'})</Label>
              <Input
                id="fixedPrice"
                type="number"
                step="0.01"
                value={formData.fixedPrice}
                onChange={(e) => handleChange('fixedPrice', e.target.value)}
                placeholder="Enter fixed price"
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ({formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : 'RON'})</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => handleChange('hourlyRate', e.target.value)}
                    placeholder="Rate per hour"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="urgentHourlyRate">Urgent Rate ({formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : 'RON'})</Label>
                  <Input
                    id="urgentHourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.urgentHourlyRate}
                    onChange={(e) => handleChange('urgentHourlyRate', e.target.value)}
                    placeholder="Urgent rate per hour"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => handleChange('estimatedHours', e.target.value)}
                  placeholder="Estimated hours"
                />
              </div>
            </div>
          )}

          {/* Inherit Options */}
          {selectedClient && (
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-medium mb-3">Inherit from Client</h4>
              <div className="space-y-2">
                {selectedClient.documents && selectedClient.documents.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inherit-documents"
                      checked={inheritOptions.documents}
                      onCheckedChange={(checked) => handleInheritChange('documents', checked as boolean)}
                    />
                    <Label htmlFor="inherit-documents" className="text-sm">
                      Documents ({selectedClient.documents.length})
                    </Label>
                  </div>
                )}
                
                {selectedClient.links && selectedClient.links.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inherit-links"
                      checked={inheritOptions.links}
                      onCheckedChange={(checked) => handleInheritChange('links', checked as boolean)}
                    />
                    <Label htmlFor="inherit-links" className="text-sm">
                      Links ({selectedClient.links.length})
                    </Label>
                  </div>
                )}
                
                {selectedClient.people && selectedClient.people.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inherit-team"
                      checked={inheritOptions.team}
                      onCheckedChange={(checked) => handleInheritChange('team', checked as boolean)}
                    />
                    <Label htmlFor="inherit-team" className="text-sm">
                      Team Members ({selectedClient.people.length})
                    </Label>
                  </div>
                )}
                
                {selectedClient.notes && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inherit-notes"
                      checked={inheritOptions.notes}
                      onCheckedChange={(checked) => handleInheritChange('notes', checked as boolean)}
                    />
                    <Label htmlFor="inherit-notes" className="text-sm">
                      Client Notes
                    </Label>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                value={formData.estimatedEndDate}
                onChange={(e) => handleChange('estimatedEndDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="team">Team Members (comma-separated)</Label>
            <Input
              id="team"
              value={formData.team}
              onChange={(e) => handleChange('team', e.target.value)}
              placeholder="John Doe, Jane Smith"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Project notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
