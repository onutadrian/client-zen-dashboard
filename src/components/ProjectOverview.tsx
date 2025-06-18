
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Link, StickyNote, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import ProjectBilledHours from '@/components/ProjectBilledHours';
import AddProjectTaskModal from '@/components/AddProjectTaskModal';
import AddDocumentModal from '@/components/AddDocumentModal';

interface ProjectOverviewProps {
  project: Project;
  client?: any;
  tasks: Task[];
  milestones: Milestone[];
  onAddTask: (task: any) => void;
  onUpdateTask: (taskId: number, status: any, actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: any) => void;
  onAddMilestone: (milestone: any) => void;
  onUpdateMilestone: (milestoneId: string, updates: any) => void;
  onUpdateProject: (projectId: string, updates: any) => void;
}

const ProjectOverview = ({
  project,
  client,
  tasks,
  milestones,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddMilestone,
  onUpdateMilestone,
  onUpdateProject
}: ProjectOverviewProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddDocument = (document: string) => {
    const updatedDocuments = [...(project.documents || []), document];
    onUpdateProject(project.id, {
      ...project,
      documents: updatedDocuments
    });
  };

  const handleAddLink = (link: string) => {
    // For now, we'll store links in a links array (we'd need to add this to the project schema)
    // Since the current schema only has documents, we'll prefix links with "LINK: "
    const linkWithPrefix = `LINK: ${link}`;
    const updatedDocuments = [...(project.documents || []), linkWithPrefix];
    onUpdateProject(project.id, {
      ...project,
      documents: updatedDocuments
    });
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = (project.documents || []).filter((_, i) => i !== index);
    onUpdateProject(project.id, {
      ...project,
      documents: updatedDocuments
    });
  };

  const isLink = (doc: string) => doc.startsWith('LINK: ');
  const getDisplayName = (doc: string) => isLink(doc) ? doc.replace('LINK: ', '') : doc;

  return (
    <div className="space-y-6">
      {/* Billed Hours Section */}
      <ProjectBilledHours project={project} client={client} />

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks ({tasks.length})</CardTitle>
            <Button 
              onClick={() => setShowAddTaskModal(true)}
              size="sm" 
              className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              ))}
              {tasks.length > 5 && (
                <p className="text-sm text-slate-500 text-center">
                  And {tasks.length - 5} more tasks...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No milestones yet</p>
            ) : (
              milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-sm text-slate-600">Due: {new Date(milestone.targetDate).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents & Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents
              </CardTitle>
              <Button 
                onClick={() => setShowAddDocumentModal(true)}
                size="sm" 
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.documents && project.documents.filter(doc => !isLink(doc)).length > 0 ? (
              <div className="space-y-2">
                {project.documents
                  .filter(doc => !isLink(doc))
                  .map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <p className="text-sm flex-1">{doc}</p>
                      <Button
                        onClick={() => handleRemoveDocument(project.documents?.indexOf(doc) || 0)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No documents yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Links
              </CardTitle>
              <Button 
                onClick={() => setShowAddLinkModal(true)}
                size="sm" 
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.documents && project.documents.filter(doc => isLink(doc)).length > 0 ? (
              <div className="space-y-2">
                {project.documents
                  .filter(doc => isLink(doc))
                  .map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <a 
                        href={getDisplayName(doc).startsWith('http') ? getDisplayName(doc) : `https://${getDisplayName(doc)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex-1"
                      >
                        {getDisplayName(doc)}
                      </a>
                      <Button
                        onClick={() => handleRemoveDocument(project.documents?.indexOf(doc) || 0)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No links yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <StickyNote className="w-5 h-5 mr-2" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.notes ? (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-700">{project.notes}</p>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No notes yet</p>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddProjectTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        projectId={project.id}
        clientId={project.clientId}
        clientName={client?.name || 'Unknown Client'}
      />

      <AddDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
        onAdd={handleAddDocument}
        type="document"
      />

      <AddDocumentModal
        isOpen={showAddLinkModal}
        onClose={() => setShowAddLinkModal(false)}
        onAdd={handleAddLink}
        type="link"
      />
    </div>
  );
};

export default ProjectOverview;
