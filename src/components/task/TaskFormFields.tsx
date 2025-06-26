
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface TaskFormData {
  title: string;
  description: string;
  clientId: number | null;
  projectId: string | null;
  estimatedHours?: number;
  notes: string;
  assetsInput: string;
  startDate: string;
  endDate: string;
}

interface TaskFormFieldsProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  clients: Client[];
  availableProjects: Project[];
  selectedClient?: Client;
  onClientChange: (clientId: number | null) => void;
}

const TaskFormFields = ({
  formData,
  setFormData,
  clients,
  availableProjects,
  selectedClient,
  onClientChange
}: TaskFormFieldsProps) => {
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
          onProjectChange={(projectId) => setFormData(prev => ({ ...prev, projectId }))}
          disabled={!formData.clientId}
          clientSelected={!!formData.clientId}
          required={true}
        />
      </div>

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
