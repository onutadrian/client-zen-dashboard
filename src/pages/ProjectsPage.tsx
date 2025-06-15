
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ProjectsSection from '@/components/ProjectsSection';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';

const ProjectsPage = () => {
  const { clients } = useClients();
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
        </div>
        
        <ProjectsSection 
          projects={projects}
          clients={clients}
          onAddProject={addProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
