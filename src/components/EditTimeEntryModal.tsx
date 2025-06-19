
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Clock } from 'lucide-react';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { useMilestones } from '@/hooks/useMilestones';
import { formatDateForInput } from '@/lib/utils';

interface EditTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntry: HourEntry;
}

const EditTimeEntryModal = ({ isOpen, onClose, timeEntry }: EditTimeEntryModalProps) => {
  const [hours, setHours] = useState(timeEntry.hours.toString());
  const [description, setDescription] = useState(timeEntry.description || '');
  const [date, setDate] = useState(timeEntry.date);
  const [billed, setBilled] = useState(timeEntry.billed);
  const [milestoneId, setMilestoneId] = useState(timeEntry.milestoneId || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateHourEntry } = useHourEntries();
  const { milestones } = useMilestones();

  // Filter milestones for the same project as the time entry
  const projectMilestones = milestones.filter(milestone => milestone.projectId === timeEntry.projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || parseFloat(hours) <= 0) return;

    setIsUpdating(true);
    try {
      await updateHourEntry(timeEntry.id, {
        hours: parseFloat(hours),
        description: description || undefined,
        date,
        billed,
        milestoneId: milestoneId || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error updating time entry:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Edit Time Entry
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0.1"
                step="0.1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0.0"
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
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a milestone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No milestone</SelectItem>
                {projectMilestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.title} ({new Date(milestone.targetDate).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
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
              disabled={isUpdating}
              className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeEntryModal;
