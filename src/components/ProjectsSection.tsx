
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderOpen, Calendar, User } from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface Project {
  id: string;
  name: string;
  clientId: number;
  startDate: string;
  estimatedEndDate: string;
  endDate?: string;
  status: string;
  notes: string;
  documents: string[];
  team: string[];
}

interface Client {
  id: number;
  name: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  clients: Client[];
  onAddProject: (project: any) => void;
  onUpdateProject: (projectId: string, project: any) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectsSection = ({ 
  projects, 
  clients, 
  onAddProject,
  onUpdateProject,
  onDeleteProject 
}: ProjectsSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Projects ({projectStats.total})
            </CardTitle>
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 pt-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {projectStats.active} Active
            </Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              {projectStats.completed} Completed
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              {projectStats.onHold} On Hold
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-4">Create your first project to organize your work</p>
              <Button 
                onClick={() => setShowAddModal(true)} 
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-800 text-sm">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {getClientName(project.clientId)}
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        {formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}
                      </div>
                      
                      {project.team.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-xs text-slate-500">
                            Team: {project.team.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {project.notes && (
                      <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                        {project.notes}
                      </p>
                    )}
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
    </>
  );
};

export default ProjectsSection;
