import React, { useState, useMemo } from 'react';
import TaskTable from '@/components/TaskTable';
import AddTaskModal from '@/components/AddTaskModal';
import { Task } from '@/types/task';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import ProjectStatusFilter, { ProjectStatus } from './ProjectStatusFilter';

interface TaskManagementSectionProps {
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  onTaskClick: (task: any) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: any) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  selectedStatuses: ProjectStatus[];
  onStatusChange: (statuses: ProjectStatus[]) => void;
}

const TaskManagementSection = ({
  tasks,
  clients,
  projects,
  onTaskClick,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
  selectedStatuses,
  onStatusChange
}: TaskManagementSectionProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
    endDate: task.endDate || '',
    assignedTo: task.assignedTo,
    assignedToName: task.assignedToName,
    urgent: task.urgent,
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleModalClose = () => {
    setShowAddTaskModal(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    if (editingTask) {
      onEditTask({ ...taskData, id: editingTask.id });
    } else {
      onAddTask(taskData);
    }
    handleModalClose();
  };

  // Filter projects by selected statuses
  const filteredProjects = useMemo(() => {
    return projects.filter(project => selectedStatuses.includes(project.status as ProjectStatus));
  }, [projects, selectedStatuses]);

  // Get project IDs for filtering tasks
  const filteredProjectIds = useMemo(() => {
    return new Set(filteredProjects.map(p => p.id));
  }, [filteredProjects]);

  // Filter tasks to only include those linked to filtered projects
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => task.projectId && filteredProjectIds.has(task.projectId));
  }, [tasks, filteredProjectIds]);

  const transformedTasks = useMemo(() => {
    return filteredTasks.map(transformTaskForTaskTable);
  }, [filteredTasks]);

  const transformedClients = useMemo(() => {
    return clients.map(client => ({
      id: client.id,
      name: client.name,
      priceType: client.priceType || 'hour',
      hourEntries: []
    }));
  }, [clients]);

  const transformedProjects = useMemo(() => {
    return filteredProjects.map(project => ({
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      useMilestones: project.useMilestones
    }));
  }, [filteredProjects]);

  return (
    <>
      <div className="mb-4">
        <ProjectStatusFilter
          selectedStatuses={selectedStatuses}
          onStatusChange={onStatusChange}
        />
      </div>

      <TaskTable
        tasks={transformedTasks}
        clients={transformedClients}
        projects={transformedProjects}
        onTaskClick={onTaskClick}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onEditTask={handleEditTask}
        onAddTaskClick={() => setShowAddTaskModal(true)}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={handleModalClose}
        onAdd={handleTaskSubmit}
        clients={clients.map(client => ({
          id: client.id,
          name: client.name,
          priceType: client.priceType || 'hour'
        }))}
        projects={projects
          .filter(project => project.status === 'active')
          .map(project => ({
            id: project.id,
            name: project.name,
            clientId: project.clientId,
            useMilestones: project.useMilestones,
            status: project.status
          }))}
        task={editingTask}
      />
    </>
  );
};

export default TaskManagementSection;
