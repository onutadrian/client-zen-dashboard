import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Project } from '@/integrations/supabase/types';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectActivitySidebarProps {
  project: Project;
  onClose: () => void;
}

const ProjectActivitySidebar = ({ project, onClose }: ProjectActivitySidebarProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'project_created',
      message: 'Project created',
      timestamp: project.created_at || new Date().toISOString(),
      user: 'System'
    },
    {
      id: 2,
      type: 'task_added',
      message: 'Task "Design Mockups" added',
      timestamp: new Date().toISOString(),
      user: 'Adrian'
    },
    {
      id: 3,
      type: 'invoice_sent',
      message: 'Invoice #1001 sent to client',
      timestamp: new Date().toISOString(),
      user: 'System'
    },
    {
      id: 4,
      type: 'payment_received',
      message: 'Payment received for Invoice #1001',
      timestamp: new Date().toISOString(),
      user: 'System'
    },
  ];

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <SheetHeader className="space-y-2">
          <SheetTitle>Project Activity</SheetTitle>
          <SheetClose asChild>
            <button
              aria-label="Close"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
        </SheetHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{activity.message}</div>
                  <div className="text-sm text-gray-500">{activity.user}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(activity.timestamp)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectActivitySidebar;
