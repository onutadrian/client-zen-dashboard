
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import AddProjectTaskModal from './AddProjectTaskModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { Task } from '@/types/task';
import TaskManagementSectionV2 from '@/components/dashboard/TaskManagementSectionV2';
import { ENABLE_TASK_LIST_V2 } from '@/lib/features';
import TaskDetailsSheet from './TaskDetailsSheet';

interface ProjectTaskSectionProps {
  project: Project;
  client?: Client;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask?: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onAddTaskTimeLog?: (taskId: number, hoursText: string) => Promise<Task | void | null> | Task | void | null;
  onDeleteTask?: (taskId: number) => void;
  onEditTask?: (taskId: number, updatedTask: Partial<Task>) => void;
}

const ProjectTaskSection = ({
  project,
  client,
  tasks,
  onAddTask,
  onUpdateTask,
  onAddTaskTimeLog,
  onDeleteTask,
  onEditTask,
}: ProjectTaskSectionProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const isActive = project.status === 'active';
  const [viewTask, setViewTask] = useState<Task | null>(null);

  React.useEffect(() => {
    if (!viewTask) return;
    const latestTask = tasks.find(task => task.id === viewTask.id);
    if (latestTask) {
      setViewTask(latestTask);
    }
  }, [tasks, viewTask]);

  if (ENABLE_TASK_LIST_V2) {
    return (
      <>
        <TaskManagementSectionV2
          mode="project"
          tasks={tasks}
          clients={client ? [client] : []}
          projects={[project]}
          onTaskClick={(task) => setViewTask(task)}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onEditTask={task => onEditTask?.(task.id, task)}
          onAddTask={onAddTask as any}
        />

        <TaskDetailsSheet
          task={viewTask}
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
          projects={[{ id: project.id, name: project.name, pricingType: project.pricingType }]}
          onAddTimeLog={onAddTaskTimeLog}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <div className="flex items-center gap-3">
          {!isActive && (
            <span className="text-sm text-slate-500">Project is inactive</span>
          )}
          <Button variant="primary"
            onClick={() => setShowAddTaskModal(true)}
           
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
              <Button variant="primary"
                onClick={() => setShowAddTaskModal(true)}
               
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
                          <Badge className="ui-pill ui-pill--danger">Urgent</Badge>
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
                      <Badge
                        className={
                          task.status === 'completed'
                            ? 'ui-pill ui-pill--success'
                            : task.status === 'in-progress'
                              ? 'ui-pill ui-pill--info'
                              : 'ui-pill ui-pill--neutral'
                        }
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
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
        onAddTimeLog={onAddTaskTimeLog}
      />
    </>
  );
};

export default ProjectTaskSection;
