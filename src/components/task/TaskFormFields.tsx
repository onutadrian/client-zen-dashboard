
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientSelectDropdown from '@/components/forms/ClientSelectDropdown';
import ProjectSelectDropdown from '@/components/forms/ProjectSelectDropdown';
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
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TaskFormData {
  title: string;
  description: string;
  clientId: number | null;
  projectId: string | null;
  milestoneId: string | null;
  estimatedHours?: number;
  notes: string;
  assetsInput: string;
  startDate: string;
  endDate: string;
  assignedTo?: string;
}

interface TaskFormFieldsProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  clients: Client[];
  availableProjects: Project[];
  milestones: Milestone[];
  selectedClient?: Client;
  onClientChange: (clientId: number | null) => void;
  users?: Array<{ id: string; full_name?: string; email?: string }>;
}

const TaskFormFields = ({
  formData,
  setFormData,
  clients,
  availableProjects,
  milestones,
  selectedClient,
  onClientChange,
  users = []
}: TaskFormFieldsProps) => {
  const { isAdmin } = useAuth();
  const availableMilestones = milestones.filter(m => 
    m.projectId === formData.projectId && m.status === 'in-progress'
  );
  
  // For standard users, milestone is required if there are available milestones
  const isMilestoneRequired = !isAdmin && availableMilestones.length > 0;
  return (
    <>
      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ClientSelectDropdown
          clients={clients}
          selectedClientId={formData.clientId}
          onClientChange={onClientChange}
          required={true}
        />

        <ProjectSelectDropdown
          projects={availableProjects}
          selectedProjectId={formData.projectId}
          onProjectChange={(projectId) => setFormData(prev => ({ ...prev, projectId, milestoneId: null }))}
          disabled={!formData.clientId}
          clientSelected={!!formData.clientId}
          required={true}
        />
      </div>

      {formData.projectId && (
        <div>
          <Label htmlFor="milestone">
            Milestone {isMilestoneRequired ? '*' : ''}
          </Label>
          <Select
            value={formData.milestoneId || ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, milestoneId: value || null }))}
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
          {availableMilestones.length === 0 && formData.projectId && (
            <p className="text-sm text-amber-600 mt-1">
              No in-progress milestones found. Consider creating or activating a milestone for better time tracking.
            </p>
          )}
        </div>
      )}

      {/* Assignment Field - Only show for admins */}
      {isAdmin && (
        <div>
          <Label htmlFor="assignedTo">Assign To</Label>
          <Select 
            value={formData.assignedTo || ''} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value || undefined }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            min={formData.startDate || undefined}
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
            value={formData.estimatedHours || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              estimatedHours: e.target.value ? Number(e.target.value) : undefined 
            }))}
            placeholder="Enter estimated hours"
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any additional notes"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="assets">Assets (one per line)</Label>
        <Textarea
          id="assets"
          value={formData.assetsInput}
          onChange={(e) => setFormData(prev => ({ ...prev, assetsInput: e.target.value }))}
          placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.jpg&#10;Local file: document.docx"
          rows={4}
        />
        <p className="text-sm text-slate-500 mt-1">
          Add links to files, documents, or other assets related to this task
        </p>
      </div>
    </>
  );
};

export default TaskFormFields;
