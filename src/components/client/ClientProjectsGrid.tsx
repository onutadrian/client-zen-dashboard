import React from 'react';
import type { Project } from '@/hooks/useProjects';
import ClientProjectCard from './ClientProjectCard';

interface ClientProjectsGridProps {
  projects: Project[];
  clientName?: string;
}

const ClientProjectsGrid = ({ projects, clientName }: ClientProjectsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ClientProjectCard key={project.id} project={project} clientName={clientName} />
      ))}
    </div>
  );
};

export default ClientProjectsGrid;

