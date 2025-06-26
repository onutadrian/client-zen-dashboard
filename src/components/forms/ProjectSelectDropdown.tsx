
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Project {
  id: string;
  name: string;
  clientId: number;
}

interface ProjectSelectDropdownProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
  disabled?: boolean;
  clientSelected?: boolean;
  label?: string;
  required?: boolean;
}

const ProjectSelectDropdown = ({
  projects,
  selectedProjectId,
  onProjectChange,
  disabled = false,
  clientSelected = true,
  label = "Project",
  required = false
}: ProjectSelectDropdownProps) => {
  const handleValueChange = (value: string) => {
    if (value === "no-projects") return;
    onProjectChange(value);
  };

  console.log('ProjectSelectDropdown - Available projects:', projects);
  console.log('ProjectSelectDropdown - Selected project ID:', selectedProjectId);

  return (
    <div>
      <Label htmlFor="project">
        {label} {required && "*"}
      </Label>
      <Select 
        value={selectedProjectId || ''} 
        onValueChange={handleValueChange} 
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={
            !clientSelected ? "Select a client first" : 
            projects.length === 0 ? "No projects available" : "Select a project"
          } />
        </SelectTrigger>
        <SelectContent>
          {projects.length === 0 ? (
            <SelectItem value="no-projects" disabled>
              {!clientSelected ? "Select a client first" : "No projects available"}
            </SelectItem>
          ) : (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelectDropdown;
