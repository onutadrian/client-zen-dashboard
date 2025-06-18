
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Save } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: Omit<Milestone, 'id'>) => void;
  project: Project;
}

const AddMilestoneModal = ({ isOpen, onClose, onAdd, project }: AddMilestoneModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;

    onAdd({
      projectId: project.id,
      title,
      description: description || undefined,
      targetDate,
      status
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTargetDate('');
    setStatus('pending');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Add Milestone for {project.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Milestone Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter milestone title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the milestone"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              Add Milestone
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneModal;
