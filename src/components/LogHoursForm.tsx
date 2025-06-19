
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';
import { getTimeLabel, getStepValue, getPlaceholder, getButtonText, convertToHours } from '@/utils/pricingUtils';

interface LogHoursFormProps {
  project: Project;
  client: Client;
  milestones: Milestone[];
  onClose: () => void;
  onCreateMilestone?: () => void;
}

const LogHoursForm = ({ 
  project, 
  client, 
  milestones, 
  onClose, 
  onCreateMilestone 
}: LogHoursFormProps) => {
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billed, setBilled] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('unassigned');
  const { addHourEntry } = useHourEntries();

  // Filter milestones that are not completed
  const availableMilestones = milestones.filter(m => 
    m.status === 'pending' || m.status === 'in-progress'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || isNaN(Number(hours)) || Number(hours) <= 0) {
      return;
    }
    
    const hoursEquivalent = convertToHours(Number(hours), project.pricingType);
    
    await addHourEntry({
      projectId: project.id,
      clientId: client.id,
      hours: hoursEquivalent,
      description,
      date,
      billed,
      milestoneId: selectedMilestoneId === 'unassigned' ? undefined : selectedMilestoneId
    });

    // Reset form
    setHours('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setBilled(false);
    setSelectedMilestoneId('unassigned');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hours">{getTimeLabel(project.pricingType)}</Label>
          <Input
            id="hours"
            type="number"
            step="any"
            min="0"
            placeholder={getPlaceholder(project.pricingType)}
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
              <SelectItem value="unassigned">No milestone (unassigned)</SelectItem>
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
          {getButtonText(project.pricingType)}
        </Button>
      </div>
    </form>
  );
};

export default LogHoursForm;
