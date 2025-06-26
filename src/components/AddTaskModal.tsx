
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ClientSelectDropdown from '@/components/forms/ClientSelectDropdown';
import ProjectSelectDropdown from '@/components/forms/ProjectSelectDropdown';

interface Client {
  id: number;
  name: string;
  priceType: string;
}

interface Project {
  id: string;
  name: string;
  clientId: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  clients: Client[];
  projects: Project[];
  task?: Task | null;
}

const AddTaskModal = ({ isOpen, onClose, onAdd, clients, projects, task }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [assetsInput, setAssetsInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  console.log('AddTaskModal - Received clients:', clients);
  console.log('AddTaskModal - Received projects:', projects);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setClientId(task.clientId);
      setProjectId(task.projectId || null);
      setEstimatedHours(task.estimatedHours);
      setNotes(task.notes);
      setAssetsInput(task.assets.join('\n'));
      setStartDate(task.startDate || '');
      setEndDate(task.endDate || '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setClientId(null);
      setProjectId(null);
      setEstimatedHours(undefined);
      setNotes('');
      setAssetsInput('');
      setStartDate('');
      setEndDate('');
    }
  }, [task]);

  const selectedClient = clients.find(c => c.id === clientId);
  const availableProjects = projects.filter(p => !clientId || p.clientId === clientId);

  const handleClientChange = (newClientId: number | null) => {
    console.log('AddTaskModal - Client changed to:', newClientId);
    setClientId(newClientId);
    setProjectId(null); // Reset project when client changes
  };

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

    if (!projectId) {
      toast.error('Please select a project');
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
      projectId,
      estimatedHours,
      notes: notes.trim(),
      assets,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setClientId(null);
    setProjectId(null);
    setEstimatedHours(undefined);
    setNotes('');
    setAssetsInput('');
    setStartDate('');
    setEndDate('');
    
    onClose();
    toast.success(task ? 'Task updated successfully' : 'Task added successfully');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setClientId(null);
    setProjectId(null);
    setEstimatedHours(undefined);
    setNotes('');
    setAssetsInput('');
    setStartDate('');
    setEndDate('');
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

          <div className="grid grid-cols-2 gap-4">
            <ClientSelectDropdown
              clients={clients}
              selectedClientId={clientId}
              onClientChange={handleClientChange}
              required={true}
            />

            <ProjectSelectDropdown
              projects={availableProjects}
              selectedProjectId={projectId}
              onProjectChange={setProjectId}
              disabled={!clientId}
              clientSelected={!!clientId}
              required={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={clients.length === 0}>
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
