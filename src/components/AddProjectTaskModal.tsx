
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMilestones } from '@/hooks/useMilestones';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AddProjectTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: any) => void;
  projectId: string;
  clientId: number;
  clientName: string;
  useMilestonesEnabled?: boolean;
}

const AddProjectTaskModal = ({ isOpen, onClose, onAdd, projectId, clientId, clientName, useMilestonesEnabled = true }: AddProjectTaskModalProps) => {
  const { milestones } = useMilestones();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedHours: '',
    milestoneId: '',
    notes: '',
    startDate: '',
    endDate: '',
    urgent: false,
  });

  const availableMilestones = milestones.filter(m => 
    m.projectId === projectId && m.status === 'in-progress'
  );
  
  // For standard users, milestone is required if there are available milestones
  const isMilestoneRequired = !isAdmin && useMilestonesEnabled && availableMilestones.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if milestone is required for standard users
    if (isMilestoneRequired && (!formData.milestoneId || formData.milestoneId === 'none')) {
      toast.error('Please select a milestone - it is required for this project');
      return;
    }
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      clientId,
      clientName,
      projectId,
      milestoneId: formData.milestoneId === 'none' ? undefined : formData.milestoneId || undefined,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      notes: formData.notes,
      assets: [],
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      urgent: formData.urgent,
    };

    onAdd(taskData);
    setFormData({
      title: '',
      description: '',
      estimatedHours: '',
      milestoneId: '',
      notes: '',
      startDate: '',
      endDate: '',
      urgent: false,
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
          <DialogTitle>Add Task to Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Task description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              placeholder="Enter estimated hours"
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="milestone">
              Milestone {isMilestoneRequired ? '*' : ''}
            </Label>
            <Select
              value={formData.milestoneId}
              onValueChange={(value) => handleChange('milestoneId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  availableMilestones.length === 0 
                    ? "No in-progress milestones available"
                    : isMilestoneRequired 
                      ? "Select a milestone (required)" 
                      : "Select a milestone (optional)"
                } />
              </SelectTrigger>
              <SelectContent>
                {!isMilestoneRequired && <SelectItem value="none">No milestone</SelectItem>}
                {availableMilestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isMilestoneRequired && (
              <p className="text-sm text-blue-600 mt-1">
                Milestone selection is required for standard users.
              </p>
            )}
            {availableMilestones.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                No in-progress milestones found. Consider creating or activating a milestone for better time tracking.
              </p>
            )}
          </div>

          {/* Urgent flag */}
          <div className="flex items-center justify-between">
            <Label htmlFor="urgent" className="text-sm font-medium">Mark as Urgent</Label>
            <Switch
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, urgent: checked }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectTaskModal;
