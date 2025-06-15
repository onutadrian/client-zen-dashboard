
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckSquare } from 'lucide-react';
import TaskCard from './TaskCard';
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
}

const TasksSection = ({
  tasks,
  clients,
  onAddTask,
  onUpdateTask
}: TasksSectionProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [clientFilter, setClientFilter] = useState<'all' | string>('all');

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CheckSquare className="w-6 h-6 mr-2 text-slate-700" />
            Tasks ({taskStats.total})
          </CardTitle>
          <Button onClick={() => setShowAddModal(true)} className="bg-slate-800 hover:bg-slate-900 text-white rounded-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 pt-2">
          <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-200">{taskStats.pending} Pending</Badge>
          <Badge className="bg-slate-200 text-slate-900 border-slate-300">{taskStats.inProgress} In Progress</Badge>
          <Badge className="bg-slate-300 text-slate-900 border-slate-400">{taskStats.completed} Completed</Badge>
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
            <Button onClick={() => setShowAddModal(true)} className="bg-slate-700 hover:bg-slate-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const client = clients.find(c => c.id === task.clientId);
              return (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onUpdateStatus={onUpdateTask} 
                  isHourlyClient={client?.priceType === 'hour'} 
                />
              );
            })}
          </div>
        )}
      </CardContent>

      <AddTaskModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={onAddTask} 
        clients={clients} 
      />
    </Card>
  );
};

export default TasksSection;
