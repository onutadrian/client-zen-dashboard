
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Save, Plus } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';

interface LogProjectHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  client: Client;
  milestones: Milestone[];
  onCreateMilestone?: () => void;
}

const LogProjectHoursModal = ({ 
  isOpen, 
  onClose, 
  project, 
  client, 
  milestones,
  onCreateMilestone 
}: LogProjectHoursModalProps) => {
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billed, setBilled] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const { addHourEntry } = useHourEntries();

  // Filter milestones that are not completed
  const availableMilestones = milestones.filter(m => 
    m.status === 'pending' || m.status === 'in-progress'
  );

  const getTimeLabel = () => {
    switch (client.priceType) {
      case 'hour':
        return 'Hours Worked';
      case 'day':
        return 'Days Worked';
      case 'week':
        return 'Weeks Worked';
      case 'month':
        return 'Months Worked';
      default:
        return 'Time Worked';
    }
  };

  const getStepValue = () => {
    switch (client.priceType) {
      case 'hour':
        return '0.25';
      case 'day':
        return '0.5';
      case 'week':
        return '0.25';
      case 'month':
        return '0.1';
      default:
        return '0.1';
    }
  };

  const getPlaceholder = () => {
    switch (client.priceType) {
      case 'hour':
        return 'e.g., 2.5';
      case 'day':
        return 'e.g., 1.5';
      case 'week':
        return 'e.g., 0.5';
      case 'month':
        return 'e.g., 0.3';
      default:
        return 'e.g., 1';
    }
  };

  const getButtonText = () => {
    switch (client.priceType) {
      case 'day':
        return 'Log Days';
      case 'week':
        return 'Log Weeks';
      case 'month':
        return 'Log Months';
      default:
        return 'Log Hours';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || isNaN(Number(hours)) || Number(hours) <= 0) {
      return;
    }
    
    // Convert everything to hours for consistent storage
    const convertToHours = (value: number, type: string) => {
      switch (type) {
        case 'hour':
          return value;
        case 'day':
          return value * 8; // 8 hours per day
        case 'week':
          return value * 40; // 40 hours per week
        case 'month':
          return value * 160; // ~160 hours per month (4 weeks)
        default:
          return value;
      }
    };

    const hoursEquivalent = convertToHours(Number(hours), client.priceType);
    
    await addHourEntry({
      projectId: project.id,
      clientId: client.id,
      hours: hoursEquivalent,
      description,
      date,
      billed,
      milestoneId: selectedMilestoneId || undefined
    });

    // Reset form
    setHours('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setBilled(false);
    setSelectedMilestoneId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {getButtonText()} for {project.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">{getTimeLabel()}</Label>
              <Input
                id="hours"
                type="number"
                step={getStepValue()}
                min="0.1"
                placeholder={getPlaceholder()}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="milestone">Milestone (Optional)</Label>
            <div className="flex gap-2">
              <Select value={selectedMilestoneId} onValueChange={setSelectedMilestoneId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select milestone or leave unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No milestone (unassigned)</SelectItem>
                  {availableMilestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {onCreateMilestone && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCreateMilestone}
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="billed"
              checked={billed}
              onCheckedChange={setBilled}
            />
            <Label htmlFor="billed">Mark as billed</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {getButtonText()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogProjectHoursModal;
