
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Calendar, Plus } from 'lucide-react';
import AddProjectTaskModal from './AddProjectTaskModal';
import LogProjectHoursModal from './LogProjectHoursModal';
import AddMilestoneModal from './AddMilestoneModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';

interface ProjectActivitySidebarProps {
  project: Project;
  client?: Client;
  onAddTask: (task: any) => void;
  onAddMilestone: (milestone: any) => void;
}

const ProjectActivitySidebar = ({ project, client, onAddTask, onAddMilestone }: ProjectActivitySidebarProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-slate-600">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4" />
              <span>Project created</span>
            </div>
            <div className="text-xs text-slate-500 ml-6">
              {new Date(project.startDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => setShowLogHoursModal(true)}
            className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            variant="outline"
          >
            <Clock className="w-4 h-4 mr-2" />
            Log Hours
          </Button>
          
          <Button
            onClick={() => setShowAddTaskModal(true)}
            className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          
          <Button
            onClick={() => setShowAddMilestoneModal(true)}
            className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      {client && (
        <LogProjectHoursModal
          isOpen={showLogHoursModal}
          onClose={() => setShowLogHoursModal(false)}
          project={project}
          client={client}
        />
      )}

      <AddProjectTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        projectId={project.id}
        clientId={client?.id || 0}
        clientName={client?.name || ''}
      />

      <AddMilestoneModal
        isOpen={showAddMilestoneModal}
        onClose={() => setShowAddMilestoneModal(false)}
        onAdd={onAddMilestone}
        project={project}
      />
    </div>
  );
};

export default ProjectActivitySidebar;
