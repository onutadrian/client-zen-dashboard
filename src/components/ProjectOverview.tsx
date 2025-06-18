
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Link, StickyNote } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import ProjectBilledHours from '@/components/ProjectBilledHours';

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

  return (
    <div className="space-y-6">
      {/* Billed Hours Section */}
      <ProjectBilledHours project={project} client={client} />

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks ({tasks.length})</CardTitle>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
              {tasks.slice(0, 5).map((task) => (
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
              milestones.map((milestone) => (
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
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.documents && project.documents.length > 0 ? (
              <div className="space-y-2">
                {project.documents.map((doc, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p className="text-sm">{doc}</p>
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
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-center py-4">No links yet</p>
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
    </div>
  );
};

export default ProjectOverview;
