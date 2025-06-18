
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import ProjectBilledHours from './ProjectBilledHours';
import LogProjectHoursModal from './LogProjectHoursModal';
import AddProjectTaskModal from './AddProjectTaskModal';
import AddMilestoneModal from './AddMilestoneModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ProjectOverviewProps {
  project: Project;
  client?: Client;
  tasks: Task[];
  milestones: Milestone[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (milestoneId: string, updatedMilestone: Partial<Milestone>) => void;
  onUpdateProject: (projectId: string, updatedProject: Partial<Project>) => void;
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
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Project Hours Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Time Tracking</h3>
        {client && (
          <Button
            onClick={() => setShowLogHoursModal(true)}
            className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Log Hours
          </Button>
        )}
      </div>
      
      <ProjectBilledHours project={project} client={client} />

      {/* Tasks Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No tasks yet for this project</p>
              <Button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-slate-600">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Milestones</h3>
        <Button
          onClick={() => setShowAddMilestoneModal(true)}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {milestones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No milestones yet for this project</p>
              <Button
                onClick={() => setShowAddMilestoneModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Milestone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-slate-600">{milestone.description}</p>
                      <p className="text-sm text-slate-500">Due: {new Date(milestone.targetDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default ProjectOverview;
