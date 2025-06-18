import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
interface ProjectHeaderProps {
  project: Project;
  client?: any;
  tasks: Task[];
  milestones: Milestone[];
}
const ProjectHeader = ({
  project,
  client,
  tasks,
  milestones
}: ProjectHeaderProps) => {
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
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completedMilestones = milestones.filter(milestone => milestone.status === 'completed').length;
  return <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{project.name}</h1>
            <p className="text-lg text-slate-600">{client?.name || 'Unknown Client'}</p>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Duration</p>
              <p className="text-xs font-semibold">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.estimatedEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Team Size</p>
              <p className="text-xs font-semibold">{project.team?.length || 0} members</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Tasks</p>
              <p className="text-xs font-semibold">{completedTasks}/{tasks.length} completed</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Milestones</p>
              <p className="text-xs font-semibold">{completedMilestones}/{milestones.length} completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ProjectHeader;