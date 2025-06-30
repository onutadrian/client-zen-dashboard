
import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/hooks/useProjects';

interface Client {
  id: number;
  name: string;
}

interface ProjectsGridProps {
  projects: Project[];
  clients: Client[];
  onEditProject: (e: React.MouseEvent, project: Project) => void;
}

const ProjectsGrid = ({ projects, clients, onEditProject }: ProjectsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          clients={clients}
          onEditProject={onEditProject}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
