
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckSquare } from 'lucide-react';
import TaskTable from './TaskTable';
import TaskDetailsSheet from './TaskDetailsSheet';
import AddTaskModal from './AddTaskModal';

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
}
interface Client {
  id: number;
  name: string;
  priceType: string;
}
interface TasksSectionProps {
  tasks: Task[];
  clients: Client[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
}
const TasksSection = ({
  tasks,
  clients,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask
}: TasksSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [clientFilter, setClientFilter] = useState<'all' | string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const clientMatch = clientFilter === 'all' || task.clientId.toString() === clientFilter;
    return statusMatch && clientMatch;
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

          {/* Stats */}
          <div className="flex items-center space-x-4 pt-2">
            <Badge variant="secondary" className="hover:bg-secondary">{taskStats.pending} Pending</Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{taskStats.inProgress} In Progress</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{taskStats.completed} Completed</Badge>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Status:</span>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Client:</span>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
            <TaskTable
              tasks={filteredTasks}
              clients={clients}
              onTaskClick={handleTaskClick}
              onUpdateTask={onUpdateTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          )}
        </CardContent>

        <AddTaskModal 
          isOpen={showAddModal} 
          onClose={handleModalClose} 
          onAdd={handleTaskSubmit} 
          clients={clients}
          task={editingTask}
        />
      </Card>

      <TaskDetailsSheet
        task={selectedTask}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </>
  );
};

export default TasksSection;
