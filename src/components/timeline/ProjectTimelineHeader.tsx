
import React from 'react';
import { Calendar } from 'lucide-react';
import { CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/hooks/useProjects';

interface ProjectTimelineHeaderProps {
  projects: Project[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
}

const ProjectTimelineHeader = ({
  projects,
  selectedProject,
  onProjectChange
}: ProjectTimelineHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Project Timeline
      </CardTitle>
      
      <div className="flex items-center space-x-4">
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select project" />
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

export default ProjectTimelineHeader;
