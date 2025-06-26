
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ClientSelectDropdown from '@/components/forms/ClientSelectDropdown';
import ProjectSelectDropdown from '@/components/forms/ProjectSelectDropdown';
import TaskFormFields from './task/TaskFormFields';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: null as number | null,
    projectId: null as string | null,
    estimatedHours: undefined as number | undefined,
    notes: '',
    assetsInput: '',
    startDate: '',
    endDate: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        clientId: task.clientId,
        projectId: task.projectId || null,
        estimatedHours: task.estimatedHours,
        notes: task.notes,
        assetsInput: task.assets.join('\n'),
        startDate: task.startDate || '',
        endDate: task.endDate || ''
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        clientId: null,
        projectId: null,
        estimatedHours: undefined,
        notes: '',
        assetsInput: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [task]);

  const selectedClient = clients.find(c => c.id === formData.clientId);
  const availableProjects = projects.filter(p => !formData.clientId || p.clientId === formData.clientId);

  const handleClientChange = (newClientId: number | null) => {
    setFormData(prev => ({
      ...prev,
      clientId: newClientId,
      projectId: null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!formData.clientId) {
      toast.error('Please select a client');
      return;
    }

    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    const assets = formData.assetsInput
      .split('\n')
      .map(asset => asset.trim())
      .filter(asset => asset.length > 0);

    onAdd({
      title: formData.title.trim(),
      description: formData.description.trim(),
      clientId: formData.clientId,
      clientName: selectedClient?.name || '',
      projectId: formData.projectId,
      estimatedHours: formData.estimatedHours,
      notes: formData.notes.trim(),
      assets,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    });

    handleClose();
    toast.success(task ? 'Task updated successfully' : 'Task added successfully');
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      clientId: null,
      projectId: null,
      estimatedHours: undefined,
      notes: '',
      assetsInput: '',
      startDate: '',
      endDate: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskFormFields
            formData={formData}
            setFormData={setFormData}
            clients={clients}
            availableProjects={availableProjects}
            selectedClient={selectedClient}
            onClientChange={handleClientChange}
          />

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
