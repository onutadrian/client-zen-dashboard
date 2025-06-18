
import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';
import AddProjectModal from '@/components/AddProjectModal';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';

const ProjectsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { clients } = useClients();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { isMobile } = useSidebar();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        
        <ProjectsSection 
          projects={projects} 
          clients={clients} 
          onAddProject={addProject} 
          onUpdateProject={updateProject} 
          onDeleteProject={deleteProject} 
        />

        <AddProjectModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={addProject}
          clients={clients}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
