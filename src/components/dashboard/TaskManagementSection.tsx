
import React, { useState } from 'react';
import TaskTable from '@/components/TaskTable';
import AddTaskModal from '@/components/AddTaskModal';
import { Task } from '@/types/task';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';

interface TaskManagementSectionProps {
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  onTaskClick: (task: any) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: any) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
}

const TaskManagementSection = ({
  tasks,
  clients,
  projects,
  onTaskClick,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddTask
}: TaskManagementSectionProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const transformTaskForTaskTable = (task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    clientId: task.clientId,
    clientName: task.clientName,
    projectId: task.projectId || '',
    estimatedHours: task.estimatedHours || 0,
    actualHours: task.actualHours || 0,
    workedHours: task.workedHours || 0,
    status: task.status,
    notes: task.notes || '',
    assets: task.assets || [],
    createdDate: task.createdDate,
    completedDate: task.completedDate || '',
    startDate: task.startDate || '',
    endDate: task.endDate || ''
  });

  return (
    <>
      <TaskTable
        tasks={tasks.map(transformTaskForTaskTable)}
        clients={clients.map(client => ({
          id: client.id,
          name: client.name,
          priceType: client.priceType || 'hour',
          hourEntries: []
        }))}
        projects={projects.map(project => ({
          id: project.id,
          name: project.name,
          clientId: project.clientId
        }))}
        onTaskClick={onTaskClick}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onAddTaskClick={() => setShowAddTaskModal(true)}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        clients={clients.map(client => ({
          id: client.id,
          name: client.name,
          priceType: client.priceType || 'hour'
        }))}
        projects={projects.map(project => ({
          id: project.id,
          name: project.name,
          clientId: project.clientId
        }))}
      />
    </>
  );
};

export default TaskManagementSection;
