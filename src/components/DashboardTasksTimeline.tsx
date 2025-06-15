import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ZoomIn, ZoomOut, Flag, CheckSquare, Plus } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import { Client } from '@/hooks/useClients';
import TaskTable from './TaskTable';
import TaskDetailsSheet from './TaskDetailsSheet';
import AddTaskModal from './AddTaskModal';

interface DashboardTasksTimelineProps {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
}

type ZoomLevel = 'daily' | 'weekly' | 'monthly';

const DashboardTasksTimeline = ({ 
  projects, 
  tasks, 
  milestones, 
  clients, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask 
}: DashboardTasksTimelineProps) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('weekly');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all');
  const [clientFilter, setClientFilter] = useState<'all' | string>('all');
  const [projectFilter, setProjectFilter] = useState<'all' | string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredProjects = useMemo(() => {
    return selectedProject === 'all' 
      ? projects 
      : projects.filter(p => p.id === selectedProject);
  }, [projects, selectedProject]);

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

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectMilestones = (projectId: string) => {
    return milestones.filter(milestone => milestone.projectId === projectId);
  };

  const calculateProjectDuration = (project: Project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.estimatedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskPosition = (task: Task, project: Project) => {
    if (!task.startDate || !task.endDate) return { left: 0, width: 0 };
    
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const taskStartOffset = taskStart.getTime() - projectStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const left = (taskStartOffset / projectDuration) * 100;
    const width = (taskDuration / projectDuration) * 100;
    
    return { left: Math.max(0, left), width: Math.max(2, width) };
  };

  const getMilestonePosition = (milestone: Milestone, project: Project) => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const milestoneDate = new Date(milestone.targetDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const milestoneOffset = milestoneDate.getTime() - projectStart.getTime();
    
    const position = (milestoneOffset / projectDuration) * 100;
    return Math.max(0, Math.min(100, position));
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
              Tasks & Timeline ({taskStats.total})
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 rounded-sm transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Task Stats */}
          <div className="flex items-center space-x-4 pt-2">
            <Badge variant="secondary" className="hover:bg-secondary">{taskStats.pending} Pending</Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{taskStats.inProgress} In Progress</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{taskStats.completed} Completed</Badge>
          </div>

          {/* Task Filters */}
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

        <CardContent className="space-y-8">
          {/* Tasks Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2" />
              Tasks
            </h3>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h4>
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
                tasks={filteredTasks.slice(0, 5)}
                clients={clients}
                projects={projects}
                onTaskClick={handleTaskClick}
                onUpdateTask={onUpdateTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            )}
            {filteredTasks.length > 5 && (
              <p className="text-sm text-slate-500 text-center mt-4">
                +{filteredTasks.length - 5} more tasks
              </p>
            )}
          </div>

          {/* Timeline Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Project Timeline
              </h3>
              
              <div className="flex items-center space-x-4">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setZoomLevel(zoomLevel === 'daily' ? 'weekly' : zoomLevel === 'weekly' ? 'monthly' : 'daily')}
                >
                  {zoomLevel === 'daily' && <ZoomOut className="w-4 h-4 mr-1" />}
                  {zoomLevel === 'weekly' && <Clock className="w-4 h-4 mr-1" />}
                  {zoomLevel === 'monthly' && <ZoomIn className="w-4 h-4 mr-1" />}
                  {zoomLevel}
                </Button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-600 mb-2">No projects to display</h4>
                <p className="text-slate-500">Create projects to see them in the timeline view</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.slice(0, 3).map((project) => {
                  const projectTasks = getProjectTasks(project.id);
                  const projectMilestones = getProjectMilestones(project.id);
                  const duration = calculateProjectDuration(project);
                  
                  return (
                    <div key={project.id} className="space-y-3">
                      {/* Project Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800">{project.name}</h3>
                          <p className="text-sm text-slate-600">
                            {getClientName(project.clientId)} • {duration} days
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      {/* Timeline Bar */}
                      <div className="relative">
                        {/* Project Timeline Base */}
                        <div className="h-8 bg-slate-200 rounded-md relative overflow-hidden">
                          <div 
                            className={`h-full ${getStatusColor(project.status)} opacity-30 rounded-md`}
                          />
                          
                          {/* Tasks */}
                          {projectTasks.map((task) => {
                            const position = getTaskPosition(task, project);
                            if (position.width === 0) return null;
                            
                            return (
                              <div
                                key={task.id}
                                className={`absolute top-1 h-6 ${getStatusColor(task.status)} rounded-sm opacity-80`}
                                style={{
                                  left: `${position.left}%`,
                                  width: `${position.width}%`
                                }}
                                title={`${task.title} (${task.status})`}
                              />
                            );
                          })}
                          
                          {/* Milestones */}
                          {projectMilestones.map((milestone) => {
                            const position = getMilestonePosition(milestone, project);
                            
                            return (
                              <div
                                key={milestone.id}
                                className="absolute top-0 h-8 w-1 bg-red-500 flex items-center justify-center"
                                style={{ left: `${position}%` }}
                                title={`${milestone.title} - ${new Date(milestone.targetDate).toLocaleDateString()}`}
                              >
                                <Flag className="w-3 h-3 text-red-500 absolute -top-1" />
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Date Labels */}
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>{new Date(project.startDate).toLocaleDateString()}</span>
                          <span>{new Date(project.estimatedEndDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProjects.length > 3 && (
                  <p className="text-sm text-slate-500 text-center">
                    +{filteredProjects.length - 3} more projects
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <AddTaskModal 
          isOpen={showAddModal} 
          onClose={handleModalClose} 
          onAdd={handleTaskSubmit} 
          clients={clients}
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

export default DashboardTasksTimeline;
