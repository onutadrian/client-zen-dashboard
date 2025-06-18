
import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';
import AddProjectModal from '@/components/AddProjectModal';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useCurrency } from '@/hooks/useCurrency';

const ProjectsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { displayCurrency } = useCurrency();
  const {
    clients
  } = useClients();
  const {
    projects,
    showArchived,
    setShowArchived,
    addProject,
    updateProject,
    archiveProject,
    deleteProject
  } = useProjects();
  const {
    isMobile
  } = useSidebar();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-archived" checked={showArchived} onCheckedChange={setShowArchived} />
              <Label htmlFor="show-archived">Show Archived</Label>
            </div>
          </div>
        </div>
        
        <ProjectsSection 
          projects={projects} 
          clients={clients} 
          onAddProject={addProject} 
          onUpdateProject={updateProject} 
          onArchiveProject={archiveProject} 
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
