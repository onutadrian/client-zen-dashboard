
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ZoomIn, ZoomOut, Flag } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';

interface Client {
  id: number;
  name: string;
}

interface ProjectTimelineProps {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
}

type ZoomLevel = 'daily' | 'weekly' | 'monthly';

const ProjectTimeline = ({ projects, tasks, milestones, clients }: ProjectTimelineProps) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('weekly');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredProjects = useMemo(() => {
    return selectedProject === 'all' 
      ? projects 
      : projects.filter(p => p.id === selectedProject);
  }, [projects, selectedProject]);

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectMilestones = (projectId: string) => {
    return milestones.filter(milestone => milestone.projectId === projectId);
  };

  const calculateProjectDuration = (project: Project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.estimatedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskPosition = (task: Task, project: Project) => {
    if (!task.startDate || !task.endDate) return { left: 0, width: 0 };
    
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const taskStartOffset = taskStart.getTime() - projectStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const left = (taskStartOffset / projectDuration) * 100;
    const width = (taskDuration / projectDuration) * 100;
    
    return { left: Math.max(0, left), width: Math.max(2, width) };
  };

  const getMilestonePosition = (milestone: Milestone, project: Project) => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const milestoneDate = new Date(milestone.targetDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const milestoneOffset = milestoneDate.getTime() - projectStart.getTime();
    
    const position = (milestoneOffset / projectDuration) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Project Timeline
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setZoomLevel(zoomLevel === 'daily' ? 'weekly' : zoomLevel === 'weekly' ? 'monthly' : 'daily')}
              >
                {zoomLevel === 'daily' && <ZoomOut className="w-4 h-4 mr-1" />}
                {zoomLevel === 'weekly' && <Clock className="w-4 h-4 mr-1" />}
                {zoomLevel === 'monthly' && <ZoomIn className="w-4 h-4 mr-1" />}
                {zoomLevel}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No projects to display</h3>
            <p className="text-slate-500">Create projects to see them in the timeline view</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => {
              const projectTasks = getProjectTasks(project.id);
              const projectMilestones = getProjectMilestones(project.id);
              const duration = calculateProjectDuration(project);
              
              return (
                <div key={project.id} className="space-y-3">
                  {/* Project Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{project.name}</h3>
                      <p className="text-sm text-slate-600">
                        {getClientName(project.clientId)} • {duration} days
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative">
                    {/* Project Timeline Base */}
                    <div className="h-8 bg-slate-200 rounded-md relative overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(project.status)} opacity-30 rounded-md`}
                      />
                      
                      {/* Tasks */}
                      {projectTasks.map((task) => {
                        const position = getTaskPosition(task, project);
                        if (position.width === 0) return null;
                        
                        return (
                          <div
                            key={task.id}
                            className={`absolute top-1 h-6 ${getStatusColor(task.status)} rounded-sm opacity-80`}
                            style={{
                              left: `${position.left}%`,
                              width: `${position.width}%`
                            }}
                            title={`${task.title} (${task.status})`}
                          />
                        );
                      })}
                      
                      {/* Milestones */}
                      {projectMilestones.map((milestone) => {
                        const position = getMilestonePosition(milestone, project);
                        
                        return (
                          <div
                            key={milestone.id}
                            className="absolute top-0 h-8 w-1 bg-red-500 flex items-center justify-center"
                            style={{ left: `${position}%` }}
                            title={`${milestone.title} - ${new Date(milestone.targetDate).toLocaleDateString()}`}
                          >
                            <Flag className="w-3 h-3 text-red-500 absolute -top-1" />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Date Labels */}
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      <span>{new Date(project.estimatedEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Tasks Summary */}
                  {projectTasks.length > 0 && (
                    <div className="pl-4 space-y-1">
                      <h4 className="text-sm font-medium text-slate-700">Tasks ({projectTasks.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectTasks.slice(0, 5).map((task) => (
                          <Badge key={task.id} variant="outline" className="text-xs">
                            {task.title}
                          </Badge>
                        ))}
                        {projectTasks.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{projectTasks.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
