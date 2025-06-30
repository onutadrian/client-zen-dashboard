
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Briefcase } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';

interface ProjectAccessTabProps {
  projects: Project[];
  clients: Client[];
  selectedProjects: string[];
  loading: boolean;
  isUpdating: boolean;
  onProjectToggle: (projectId: string, isChecked: boolean) => void;
}

const ProjectAccessTab = ({ 
  projects, 
  clients, 
  selectedProjects, 
  loading, 
  isUpdating, 
  onProjectToggle 
}: ProjectAccessTabProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center mb-4">
        <Briefcase className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-medium">Project Access</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-3">
            {projects.map((project) => {
              const client = clients.find(c => c.id === project.clientId);
              
              return (
                <div key={project.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => onProjectToggle(project.id, checked as boolean)}
                    disabled={isUpdating}
                  />
                  <label
                    htmlFor={`project-${project.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-slate-500">
                      Client: {client?.name || 'Unknown'} | Status: {project.status}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
      
      <div className="mt-4 text-sm text-slate-600">
        Selected projects: {selectedProjects.length} of {projects.length}
      </div>
    </div>
  );
};

export default ProjectAccessTab;
