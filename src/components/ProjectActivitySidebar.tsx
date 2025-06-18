
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Calendar, CheckCircle, DollarSign } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';

interface ProjectActivitySidebarProps {
  project: Project;
  client?: Client;
}

const ProjectActivitySidebar = ({ project, client }: ProjectActivitySidebarProps) => {
  const { tasks } = useTasks();
  const { milestones } = useMilestones();
  const { invoices } = useInvoices();

  // Filter data for this project - with safe defaults
  const projectTasks = tasks?.filter(task => task.projectId === project.id) || [];
  const projectMilestones = milestones?.filter(milestone => milestone.projectId === project.id) || [];
  const projectInvoices = invoices?.filter(invoice => invoice.projectId === project.id) || [];

  // Create activity timeline
  const activities = [
    {
      type: 'project',
      icon: Clock,
      title: 'Project created',
      date: new Date(project.startDate),
      description: `Project "${project.name}" was created`
    },
    ...projectMilestones.map(milestone => ({
      type: 'milestone',
      icon: Calendar,
      title: milestone.status === 'completed' ? 'Milestone completed' : 'Milestone created',
      date: new Date(milestone.targetDate), // Fixed: use targetDate instead of dueDate
      description: `Milestone "${milestone.title}" ${milestone.status === 'completed' ? 'completed' : 'created'}`
    })),
    ...projectTasks.filter(task => task.status === 'completed').map(task => ({
      type: 'task',
      icon: CheckCircle,
      title: 'Task completed',
      date: new Date(task.createdDate), // Fixed: use createdDate instead of createdAt
      description: `Task "${task.title}" completed`
    })),
    ...projectInvoices.map(invoice => ({
      type: 'invoice',
      icon: DollarSign,
      title: `Invoice ${invoice.status}`,
      date: new Date(invoice.date),
      description: `Invoice for ${invoice.amount} ${invoice.currency} ${invoice.status}`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10); // Show last 10 activities

  return (
    <div className="p-4">
      <Card className="border-0 shadow-none bg-transparent"> {/* Removed rounded corners background */}
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
                  {activity.date.toLocaleDateString()}
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
