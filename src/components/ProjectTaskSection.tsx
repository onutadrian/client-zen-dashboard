
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddProjectTaskModal from './AddProjectTaskModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { Task } from '@/types/task';

interface ProjectTaskSectionProps {
  project: Project;
  client?: Client;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
}

const ProjectTaskSection = ({
  project,
  client,
  tasks,
  onAddTask
}: ProjectTaskSectionProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const isActive = project.status === 'active';
  const [viewTask, setViewTask] = useState<Task | null>(null);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <div className="flex items-center gap-3">
          {!isActive && (
            <span className="text-sm text-slate-500">Project is inactive</span>
          )}
          <Button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
            disabled={!isActive}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No tasks yet for this project</p>
              <Button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
                disabled={!isActive}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50" onClick={() => setViewTask(task)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {task.urgent && (
                        <div className="mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">Urgent</span>
                        </div>
                      )}
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      )}
                      {task.workedHours && task.workedHours > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          {task.workedHours}h worked
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddProjectTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        projectId={project.id}
        clientId={client?.id || 0}
        clientName={client?.name || ''}
        useMilestonesEnabled={project.useMilestones as any}
      />

      <TaskDetailsSheet
        task={viewTask}
        isOpen={!!viewTask}
        onClose={() => setViewTask(null)}
        projects={[{ id: project.id, name: project.name, pricingType: project.pricingType }]}
      />
    </>
  );
};

export default ProjectTaskSection;
import TaskDetailsSheet from './TaskDetailsSheet';
