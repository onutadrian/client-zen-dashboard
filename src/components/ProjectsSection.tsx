
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddProjectModal from './AddProjectModal';
import EditProjectSheet from './EditProjectSheet';
import ProjectsGrid from './projects/ProjectsGrid';
import EmptyProjectsState from './projects/EmptyProjectsState';
import { Project } from '@/hooks/useProjects';

interface Client {
  id: number;
  name: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  clients: Client[];
  onAddProject: (project: any) => void;
  onUpdateProject: (projectId: string, updatedProject: any) => void;
  onArchiveProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectsSection = ({ 
  projects, 
  clients, 
  onAddProject, 
  onUpdateProject, 
  onArchiveProject, 
  onDeleteProject 
}: ProjectsSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsEditSheetOpen(true);
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
    setEditingProject(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects ({projects.length})</CardTitle>
            <Button variant="primary" 
              onClick={() => setShowAddModal(true)}
             
            >
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <EmptyProjectsState onAddProject={() => setShowAddModal(true)} />
          ) : (
            <ProjectsGrid 
              projects={projects}
              clients={clients}
              onEditProject={handleEditProject}
            />
          )}
        </CardContent>
      </Card>

      <AddProjectModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAddProject}
        clients={clients}
      />

      <EditProjectSheet
        project={editingProject}
        isOpen={isEditSheetOpen}
        onClose={handleCloseEditSheet}
        onUpdate={onUpdateProject}
        clients={clients}
      />
    </>
  );
};

export default ProjectsSection;
