
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Users, FileText } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';

interface ProjectActivitySidebarProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

const ProjectActivitySidebar = ({ project, tasks, milestones }: ProjectActivitySidebarProps) => {
  // Generate mock activity data since we don't have real activity tracking yet
  const generateRecentActivity = () => {
    const activities = [];

    // Add recent task completions
    const recentCompletedTasks = tasks
      .filter(task => task.status === 'completed' && task.completedDate)
      .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
      .slice(0, 3);

    recentCompletedTasks.forEach(task => {
      activities.push({
        type: 'task_completed',
        title: `Task completed: ${task.title}`,
        time: task.completedDate!,
        icon: CheckCircle,
        color: 'text-green-600'
      });
    });

    // Add recent task updates
    const recentTasks = tasks
      .filter(task => task.status === 'in-progress')
      .slice(0, 2);

    recentTasks.forEach(task => {
      activities.push({
        type: 'task_updated',
        title: `Task in progress: ${task.title}`,
        time: task.createdDate,
        icon: Clock,
        color: 'text-blue-600'
      });
    });

    // Add milestone updates
    const recentMilestones = milestones.slice(0, 2);
    recentMilestones.forEach(milestone => {
      activities.push({
        type: 'milestone_added',
        title: `Milestone: ${milestone.title}`,
        time: milestone.createdAt,
        icon: FileText,
        color: 'text-purple-600'
      });
    });

    // Sort by time (most recent first)
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);
  };

  const recentActivity = generateRecentActivity();

  return (
    <div className="h-full p-6 overflow-y-auto">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.time).toLocaleDateString()} at{' '}
                      {new Date(activity.time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No recent activity</h3>
              <p className="text-slate-500">Activity will appear here as you work on the project</p>
            </div>
          )}

          {/* Project Stats */}
          <div className="mt-8 space-y-4">
            <h4 className="font-medium text-slate-800">Project Stats</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Tasks</span>
                <Badge variant="secondary">{tasks.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Completed</span>
                <Badge className="bg-green-100 text-green-800">
                  {tasks.filter(t => t.status === 'completed').length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">In Progress</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Team Members</span>
                <Badge variant="secondary">{project.team?.length || 0}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Milestones</span>
                <Badge variant="secondary">{milestones.length}</Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h4 className="font-medium text-slate-800 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Add new task
              </button>
              <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Log hours
              </button>
              <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Add milestone
              </button>
              <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Update status
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectActivitySidebar;
