
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task, Project, Client, Milestone } from '@/types';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';

interface DashboardTasksTimelineProps {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
  onAddTask: (task: Omit<Task, 'id' | 'created_date'>) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onAddTaskClick: () => void;
  hideFinancialColumns?: boolean;
}

const DashboardTasksTimeline = ({
  projects,
  tasks,
  milestones,
  clients,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddTaskClick,
  hideFinancialColumns = false
}: DashboardTasksTimelineProps) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const upcomingMilestones = milestones.filter(milestone => 
    milestone.status === 'pending' && new Date(milestone.target_date) > new Date()
  );

  const TaskSection = ({ title, tasks: sectionTasks, statusIcon }: { 
    title: string; 
    tasks: Task[]; 
    statusIcon: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {statusIcon}
        <h3 className="font-medium text-slate-700">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {sectionTasks.length}
        </Badge>
      </div>
      {sectionTasks.length === 0 ? (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">No {title.toLowerCase()} found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sectionTasks.map((task) => {
            const project = projects.find(p => p.id === task.project_id);
            const client = clients.find(c => c.id === task.client_id);
            
            return (
              <TaskCard
                key={task.id}
                task={task}
                project={project}
                client={client}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                hideFinancialInfo={hideFinancialColumns}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Tasks & Timeline
          </CardTitle>
          <Button 
            onClick={onAddTaskClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6 mt-6">
            <TaskSection
              title="Pending Tasks"
              tasks={pendingTasks}
              statusIcon={<Clock className="w-4 h-4 text-slate-400" />}
            />
            <TaskSection
              title="In Progress"
              tasks={inProgressTasks}
              statusIcon={<AlertCircle className="w-4 h-4 text-blue-600" />}
            />
            <TaskSection
              title="Completed"
              tasks={completedTasks}
              statusIcon={<CheckCircle className="w-4 h-4 text-green-600" />}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <TaskSection
              title="Pending Tasks"
              tasks={pendingTasks}
              statusIcon={<Clock className="w-4 h-4 text-slate-400" />}
            />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <TaskSection
              title="In Progress"
              tasks={inProgressTasks}
              statusIcon={<AlertCircle className="w-4 h-4 text-blue-600" />}
            />
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h3 className="font-medium text-slate-700">Upcoming Milestones</h3>
                <Badge variant="outline" className="text-xs">
                  {upcomingMilestones.length}
                </Badge>
              </div>
              {upcomingMilestones.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <p className="text-sm">No upcoming milestones</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingMilestones.map((milestone) => (
                    <Card key={milestone.id} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900">{milestone.title}</h4>
                            {milestone.description && (
                              <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                              <span>📅 {new Date(milestone.target_date).toLocaleDateString()}</span>
                              {milestone.estimated_hours && (
                                <span>⏱️ {milestone.estimated_hours}h estimated</span>
                              )}
                              {!hideFinancialColumns && milestone.amount && (
                                <span>💰 ${milestone.amount}</span>
                              )}
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">
                            {milestone.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardTasksTimeline;
