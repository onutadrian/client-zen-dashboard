
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ClientSelectDropdown from '@/components/forms/ClientSelectDropdown';
import ProjectSelectDropdown from '@/components/forms/ProjectSelectDropdown';
import TaskFormFields from './task/TaskFormFields';
import { useMilestones } from '@/hooks/useMilestones';
import { useAuth } from '@/hooks/useAuth';

interface Client {
  id: number;
  name: string;
  priceType: string;
}

interface Project {
  id: string;
  name: string;
  clientId: number;
  useMilestones?: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  milestoneId?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  assignedToName?: string;
  urgent?: boolean;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  clients: Client[];
  projects: Project[];
  task?: Task | null;
}

import { useUsers } from '@/hooks/useUsers';

// Admin-only wrapper to fetch users, avoiding profile fetch for non-admins
const AdminUsersWrapper = (props: Omit<React.ComponentProps<typeof TaskFormFields>, 'users'>) => {
  const { users } = useUsers();
  return <TaskFormFields {...props} users={users} />;
};

const AddTaskModal = ({ isOpen, onClose, onAdd, clients, projects, task }: AddTaskModalProps) => {
  const { milestones } = useMilestones();
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: null as number | null,
    projectId: null as string | null,
    milestoneId: null as string | null,
    estimatedHours: undefined as number | undefined,
    notes: '',
    assetsInput: '',
    startDate: '',
    endDate: '',
    assignedTo: undefined as string | undefined,
    urgent: false,
  });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        clientId: task.clientId,
        projectId: task.projectId || null,
        milestoneId: task.milestoneId || null,
        estimatedHours: task.estimatedHours,
        notes: task.notes,
        assetsInput: task.assets.join('\n'),
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        assignedTo: task.assignedTo || undefined,
        urgent: task.urgent || false,
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        clientId: null,
        projectId: null,
        milestoneId: null,
        estimatedHours: undefined,
        notes: '',
        assetsInput: '',
        startDate: '',
        endDate: '',
        assignedTo: undefined,
        urgent: false,
      });
    }
  }, [task]);

  const selectedClient = clients.find(c => c.id === formData.clientId);
  const availableProjects = projects.filter(p => !formData.clientId || p.clientId === formData.clientId);
  const selectedProject = availableProjects.find(p => p.id === formData.projectId) || null;

  const handleClientChange = (newClientId: number | null) => {
    setFormData(prev => ({
      ...prev,
      clientId: newClientId,
      projectId: null,
      milestoneId: null
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

    // Check if milestone is required for standard users
    if (!isAdmin && formData.projectId) {
      const availableMilestones = milestones.filter(m => 
        m.projectId === formData.projectId && m.status === 'in-progress'
      );
      
      if (availableMilestones.length > 0 && (!formData.milestoneId || formData.milestoneId === 'none')) {
        toast.error('Please select a milestone - it is required for this project');
        return;
      }
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
      milestoneId: formData.milestoneId === 'none' ? null : formData.milestoneId,
      estimatedHours: formData.estimatedHours,
      notes: formData.notes.trim(),
      assets,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      assignedTo: formData.assignedTo,
      urgent: formData.urgent,
    });

    handleClose();
    // Remove the duplicate toast here since the hook already shows one
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      clientId: null,
      projectId: null,
      milestoneId: null,
      estimatedHours: undefined,
      notes: '',
      assetsInput: '',
      startDate: '',
      endDate: '',
      assignedTo: undefined,
      urgent: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update task details and assignment' : 'Create a new task with client, project and optional milestone'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin ? (
            <AdminUsersWrapper
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              availableProjects={availableProjects}
              milestones={milestones}
              selectedClient={selectedClient}
              onClientChange={handleClientChange}
            />
          ) : (
            <TaskFormFields
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              availableProjects={availableProjects}
              milestones={milestones}
              selectedClient={selectedClient}
              onClientChange={handleClientChange}
              users={[]}
            />
          )}

          {/* Urgent toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="urgent" className="text-sm font-medium">Mark as Urgent</Label>
            <Switch
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, urgent: checked }))}
            />
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
