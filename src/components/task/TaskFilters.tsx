
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';

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

interface TaskFiltersProps {
  statusFilter: 'all' | Task['status'];
  clientFilter: 'all' | string;
  projectFilter: 'all' | string;
  onStatusFilterChange: (value: 'all' | Task['status']) => void;
  onClientFilterChange: (value: 'all' | string) => void;
  onProjectFilterChange: (value: 'all' | string) => void;
  availableClients: Client[];
  projects: Project[];
}

const TaskFilters = ({
  statusFilter,
  clientFilter,
  projectFilter,
  onStatusFilterChange,
  onClientFilterChange,
  onProjectFilterChange,
  availableClients,
  projects
}: TaskFiltersProps) => {
  return (
    <div className="flex items-center space-x-4 pt-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600">Status:</span>
        <Select value={statusFilter} onValueChange={(value: any) => onStatusFilterChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600">Client:</span>
        <Select value={clientFilter} onValueChange={onClientFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {availableClients.map(client => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600">Project:</span>
        <Select value={projectFilter} onValueChange={onProjectFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskFilters;
