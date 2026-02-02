
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare } from 'lucide-react';
import TaskTable from './TaskTable';
import TaskDetailsSheet from './TaskDetailsSheet';
import AddTaskModal from './AddTaskModal';
import TaskFilters from './task/TaskFilters';
import TaskStats from './task/TaskStats';
import { Task } from '@/types/task';
import TaskMobileCards from '@/components/task/TaskMobileCards';

interface Client {
  id: number;
  name: string;
  priceType: string;
}

interface Project {
  id: string;
  name: string;
  clientId: number;
  pricingType?: 'fixed' | 'hourly' | 'daily';
}

interface TasksSectionProps {
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
}

const TasksSection = ({
  tasks,
  clients,
  projects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask
}: TasksSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [clientFilter, setClientFilter] = useState<'all' | string>('all');
  const [projectFilter, setProjectFilter] = useState<'all' | string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get client IDs from projects that the user has access to
  const assignedClientIds = projects.map(p => p.clientId);
  // Filter clients to only include those that have projects assigned to the user
  const availableClients = clients.filter(client => assignedClientIds.includes(client.id));

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const clientMatch = clientFilter === 'all' || task.clientId.toString() === clientFilter;
    const projectMatch = projectFilter === 'all' || task.projectId === projectFilter;
    return statusMatch && clientMatch && projectMatch;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    onDeleteTask(taskId);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => {
    if (editingTask) {
      onEditTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    handleModalClose();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              Tasks ({taskStats.total})
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 rounded-sm transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          <TaskStats stats={taskStats} />

          <TaskFilters
            statusFilter={statusFilter}
            clientFilter={clientFilter}
            projectFilter={projectFilter}
            onStatusFilterChange={setStatusFilter}
            onClientFilterChange={setClientFilter}
            onProjectFilterChange={setProjectFilter}
            availableClients={availableClients}
            projects={projects}
          />
        </CardHeader>

        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
              <p className="text-slate-500 mb-4">
                {tasks.length === 0 ? "Create your first task to get started" : "Try adjusting your filters or create a new task"}
              </p>
              <Button onClick={() => setShowAddModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden sm:block">
                <TaskTable
                  tasks={filteredTasks}
                  clients={availableClients}
                  projects={projects}
                  onTaskClick={handleTaskClick}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                />
              </div>
              <div className="sm:hidden">
                <TaskMobileCards
                  tasks={filteredTasks}
                  projects={projects}
                  onTaskClick={handleTaskClick}
                  onStatusChange={(task, status) => onUpdateTask(task.id, status)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </>
          )}
        </CardContent>

        <AddTaskModal 
          isOpen={showAddModal} 
          onClose={handleModalClose} 
          onAdd={handleTaskSubmit} 
          clients={availableClients}
          projects={projects}
          task={editingTask}
        />
      </Card>

      <TaskDetailsSheet
        task={selectedTask}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        projects={projects}
      />
    </>
  );
};

export default TasksSection;
