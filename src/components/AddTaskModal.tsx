
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Client {
  id: number;
  name: string;
  priceType: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  clients: Client[];
  task?: Task | null;
}

const AddTaskModal = ({ isOpen, onClose, onAdd, clients, task }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [assetsInput, setAssetsInput] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setClientId(task.clientId);
      setEstimatedHours(task.estimatedHours);
      setNotes(task.notes);
      setAssetsInput(task.assets.join('\n'));
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setClientId(null);
      setEstimatedHours(undefined);
      setNotes('');
      setAssetsInput('');
    }
  }, [task]);

  const selectedClient = clients.find(c => c.id === clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!clientId) {
      toast.error('Please select a client');
      return;
    }

    const assets = assetsInput
      .split('\n')
      .map(asset => asset.trim())
      .filter(asset => asset.length > 0);

    onAdd({
      title: title.trim(),
      description: description.trim(),
      clientId,
      clientName: selectedClient?.name || '',
      estimatedHours,
      notes: notes.trim(),
      assets,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setClientId(null);
    setEstimatedHours(undefined);
    setNotes('');
    setAssetsInput('');
    
    onClose();
    toast.success(task ? 'Task updated successfully' : 'Task added successfully');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setClientId(null);
    setEstimatedHours(undefined);
    setNotes('');
    setAssetsInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="client">Client *</Label>
            <Select value={clientId?.toString()} onValueChange={(value) => setClientId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient?.priceType === 'hour' && (
            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                step="0.5"
                min="0"
                value={estimatedHours || ''}
                onChange={(e) => setEstimatedHours(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Enter estimated hours"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assets">Assets (one per line)</Label>
            <Textarea
              id="assets"
              value={assetsInput}
              onChange={(e) => setAssetsInput(e.target.value)}
              placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.jpg&#10;Local file: document.docx"
              rows={4}
            />
            <p className="text-sm text-slate-500 mt-1">
              Add links to files, documents, or other assets related to this task
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
