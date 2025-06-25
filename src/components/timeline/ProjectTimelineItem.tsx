import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import TaskTrackRenderer, { getTaskTracks } from './TaskTrackRenderer';
import MilestoneRenderer from './MilestoneRenderer';

interface Client {
  id: number;
  name: string;
}

interface ProjectTimelineItemProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
}

const ProjectTimelineItem = ({ project, tasks, milestones, clients }: ProjectTimelineItemProps) => {
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

  const getTimelineBackgroundColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'active':
        return 'bg-blue-100';
      case 'on-hold':
        return 'bg-yellow-100';
      case 'in-progress':
        return 'bg-blue-100';
      case 'pending':
        return 'bg-gray-100';
      default:
        return 'bg-blue-100';
    }
  };

  const calculateProjectDuration = (project: Project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.estimatedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const projectMilestones = milestones.filter(milestone => milestone.projectId === project.id);
  const duration = calculateProjectDuration(project);
  const tasksWithTracks = getTaskTracks(projectTasks, project);
  const maxTracks = Math.max(1, Math.max(...tasksWithTracks.map(t => t.trackIndex + 1), 0));
  const trackHeight = 22;
  const baseHeight = 32;
  const totalHeight = baseHeight + (maxTracks > 1 ? (maxTracks - 1) * trackHeight : 0);

  return (
    <div className="space-y-3">
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
        <div 
          className={`${getTimelineBackgroundColor(project.status)} rounded-md relative overflow-hidden`}
          style={{ height: `${totalHeight}px` }}
        >
          {/* Tasks with Track-based Positioning */}
          <TaskTrackRenderer tasks={tasksWithTracks} totalHeight={totalHeight} />
          
          {/* Milestones */}
          <MilestoneRenderer 
            milestones={projectMilestones} 
            project={project} 
            totalHeight={totalHeight} 
          />
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
};

export default ProjectTimelineItem;
