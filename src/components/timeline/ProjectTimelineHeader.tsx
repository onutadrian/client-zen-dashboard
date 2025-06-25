
import React from 'react';
import { Calendar, Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/hooks/useProjects';

type ZoomLevel = 'daily' | 'weekly' | 'monthly';

interface ProjectTimelineHeaderProps {
  projects: Project[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  zoomLevel: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

const ProjectTimelineHeader = ({
  projects,
  selectedProject,
  onProjectChange,
  zoomLevel,
  onZoomChange
}: ProjectTimelineHeaderProps) => {
  const handleZoomClick = () => {
    const nextLevel = zoomLevel === 'daily' ? 'weekly' : zoomLevel === 'weekly' ? 'monthly' : 'daily';
    onZoomChange(nextLevel);
  };

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
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleZoomClick}
          >
            {zoomLevel === 'daily' && <ZoomOut className="w-4 h-4 mr-1" />}
            {zoomLevel === 'weekly' && <Clock className="w-4 h-4 mr-1" />}
            {zoomLevel === 'monthly' && <ZoomIn className="w-4 h-4 mr-1" />}
            {zoomLevel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimelineHeader;
