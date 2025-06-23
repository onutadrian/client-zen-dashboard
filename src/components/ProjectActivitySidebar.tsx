import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Calendar, CheckCircle, DollarSign, Target, User } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';
import { useHourEntries } from '@/hooks/useHourEntries';

interface ProjectActivitySidebarProps {
  project: Project;
  client?: Client;
}

interface Activity {
  type: string;
  icon: React.ElementType;
  title: string;
  date: Date;
  description: string;
}

const ProjectActivitySidebar = ({ project, client }: ProjectActivitySidebarProps) => {
  const { tasks } = useTasks();
  const { milestones } = useMilestones();
  const { invoices } = useInvoices();
  const { hourEntries } = useHourEntries();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Update activities when data changes
  useEffect(() => {
    // Filter data for this project
    const projectTasks = tasks?.filter(task => task.projectId === project.id) || [];
    const projectMilestones = milestones?.filter(milestone => milestone.projectId === project.id) || [];
    const projectInvoices = invoices?.filter(invoice => invoice.projectId === project.id) || [];
    const projectHours = hourEntries?.filter(entry => entry.projectId === project.id) || [];

    // Create activity timeline
    const allActivities: Activity[] = [
      // Project creation
      {
        type: 'project',
        icon: Clock,
        title: 'Project created',
        date: new Date(project.createdAt || project.startDate),
        description: `Project "${project.name}" was created`
      },
      
      // Milestones
      ...projectMilestones.map(milestone => ({
        type: 'milestone',
        icon: Target,
        title: milestone.status === 'completed' ? 'Milestone completed' : 'Milestone created',
        date: milestone.status === 'completed' ? new Date(milestone.updatedAt) : new Date(milestone.createdAt || milestone.targetDate),
        description: `Milestone "${milestone.title}" ${milestone.status === 'completed' ? 'completed' : 'created'}`
      })),
      
      // Tasks
      ...projectTasks.map(task => ({
        type: 'task',
        icon: CheckCircle,
        title: task.status === 'completed' ? 'Task completed' : 'Task created',
        date: task.status === 'completed' ? new Date(task.completedDate || task.createdDate) : new Date(task.createdDate),
        description: `Task "${task.title}" ${task.status === 'completed' ? 'completed' : 'created'}`
      })),
      
      // Invoices
      ...projectInvoices.map(invoice => ({
        type: 'invoice',
        icon: DollarSign,
        title: `Invoice ${invoice.status}`,
        date: new Date(invoice.date),
        description: `Invoice for ${invoice.amount} ${invoice.currency} ${invoice.status}`
      })),
      
      // Hour entries
      ...projectHours.map(entry => ({
        type: 'hours',
        icon: Clock,
        title: 'Time logged',
        date: new Date(entry.date),
        description: `${entry.hours} hours logged${entry.description ? `: ${entry.description}` : ''}`
      }))
    ];

    // Sort by date (newest first) and limit to 15
    const sortedActivities = allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 15);
    
    setActivities(sortedActivities);
  }, [project, tasks, milestones, invoices, hourEntries]);

  return (
    <div className="p-4">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="text-sm text-slate-600">
                <div className="flex items-center space-x-2 mb-1">
                  <activity.icon className="w-4 h-4" />
                  <span className="font-medium">{activity.title}</span>
                </div>
                <div className="text-xs text-slate-500 ml-6 mb-1">
                  {activity.description}
                </div>
                <div className="text-xs text-slate-400 ml-6">
                  {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">
              No recent activity for this project.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectActivitySidebar;