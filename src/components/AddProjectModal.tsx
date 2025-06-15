
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Client {
  id: number;
  name: string;
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
    team: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      name: formData.name,
      clientId: parseInt(formData.clientId),
      startDate: formData.startDate,
      estimatedEndDate: formData.estimatedEndDate,
      status: formData.status,
      notes: formData.notes,
      documents: [],
      team: formData.team ? formData.team.split(',').map(t => t.trim()) : []
    };

    onAdd(projectData);
    setFormData({
      name: '',
      clientId: '',
      startDate: '',
      estimatedEndDate: '',
      status: 'active',
      notes: '',
      team: ''
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
