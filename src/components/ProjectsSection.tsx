
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Edit } from 'lucide-react';
import AddProjectModal from './AddProjectModal';
import EditProjectSheet from './EditProjectSheet';
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
  onDeleteProject: (projectId: string) => void;
}

const ProjectsSection = ({ projects, clients, onAddProject, onUpdateProject, onDeleteProject }: ProjectsSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const navigate = useNavigate();

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsEditSheetOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
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
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 rounded-sm transition-colors"
            >
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-4">Create your first project to get started</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                Add Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="relative cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{project.name}</CardTitle>
                        <p className="text-sm text-slate-600">{getClientName(project.clientId)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditProject(e, project)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.estimatedEndDate).toLocaleDateString()}</span>
                      </div>
                      {project.team && project.team.length > 0 && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{project.team.length} team member{project.team.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {project.notes && (
                        <p className="text-sm text-slate-600 line-clamp-2">{project.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
