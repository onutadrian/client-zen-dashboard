
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Plus, Target } from 'lucide-react';
import { Task, Project, Milestone, Client } from '@/types';
import { format, isToday, isTomorrow, isYesterday, parseISO, addDays } from 'date-fns';
import TaskCard from '@/components/TaskCard';
import AddTaskModal from '@/components/AddTaskModal';

interface DashboardTasksTimelineProps {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  clients: Client[];
  onAddTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
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
  hideFinancialColumns = false
}: DashboardTasksTimelineProps) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Group tasks by date
  const groupTasksByDate = (tasks: Task[]) => {
    const groups: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      let dateKey = '';
      let displayDate = '';
      
      if (task.startDate) {
        const taskDate = parseISO(task.startDate);
        
        if (isToday(taskDate)) {
          dateKey = 'today';
          displayDate = 'Today';
        } else if (isTomorrow(taskDate)) {
          dateKey = 'tomorrow';
          displayDate = 'Tomorrow';
        } else if (isYesterday(taskDate)) {
          dateKey = 'yesterday';
          displayDate = 'Yesterday';
        } else {
          dateKey = format(taskDate, 'yyyy-MM-dd');
          displayDate = format(taskDate, 'EEEE, MMMM d');
        }
      } else {
        dateKey = 'no-date';
        displayDate = 'No Date Set';
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    
    // Sort each group by priority and status
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 'in-progress') return -1;
          if (b.status === 'in-progress') return 1;
          if (a.status === 'pending') return -1;
          if (b.status === 'pending') return 1;
        }
        return 0;
      });
    });
    
    return groups;
  };

  // Group milestones by date
  const groupMilestonesByDate = (milestones: Milestone[]) => {
    const groups: Record<string, Milestone[]> = {};
    
    milestones.forEach(milestone => {
      let dateKey = '';
      let displayDate = '';
      
      const milestoneDate = parseISO(milestone.targetDate);
      
      if (isToday(milestoneDate)) {
        dateKey = 'today';
        displayDate = 'Today';
      } else if (isTomorrow(milestoneDate)) {
        dateKey = 'tomorrow';
        displayDate = 'Tomorrow';
      } else if (isYesterday(milestoneDate)) {
        dateKey = 'yesterday';
        displayDate = 'Yesterday';
      } else {
        dateKey = format(milestoneDate, 'yyyy-MM-dd');
        displayDate = format(milestoneDate, 'EEEE, MMMM d');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(milestone);
    });
    
    return groups;
  };

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const activeMilestones = milestones.filter(milestone => milestone.status !== 'completed');
  
  const taskGroups = groupTasksByDate(activeTasks);
  const milestoneGroups = groupMilestonesByDate(activeMilestones);

  // Sort date keys for proper timeline order
  const sortDateKeys = (keys: string[]) => {
    const priorityOrder = ['yesterday', 'today', 'tomorrow'];
    
    return keys.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a);
      const bIndex = priorityOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      if (a === 'no-date') return 1;
      if (b === 'no-date') return -1;
      
      return a.localeCompare(b);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Timeline & Tasks
            </CardTitle>
            <Button onClick={() => setShowAddTaskModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Tasks ({activeTasks.length})
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Milestones ({activeMilestones.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-6">
              {Object.keys(taskGroups).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Active Tasks</h3>
                  <p className="text-sm">Create your first task to get started!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortDateKeys(Object.keys(taskGroups)).map(dateKey => {
                    const displayDate = dateKey === 'today' ? 'Today' :
                                      dateKey === 'tomorrow' ? 'Tomorrow' :
                                      dateKey === 'yesterday' ? 'Yesterday' :
                                      dateKey === 'no-date' ? 'No Date Set' :
                                      format(parseISO(dateKey), 'EEEE, MMMM d');
                    
                    return (
                      <div key={dateKey}>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            dateKey === 'today' ? 'bg-green-500' :
                            dateKey === 'tomorrow' ? 'bg-blue-500' :
                            dateKey === 'yesterday' ? 'bg-red-500' :
                            'bg-slate-400'
                          }`} />
                          {displayDate}
                        </h3>
                        <div className="grid gap-4">
                          {taskGroups[dateKey].map(task => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              project={projects.find(p => p.id === task.projectId)}
                              client={clients.find(c => c.id === task.clientId)}
                              onUpdateTask={onUpdateTask}
                              onDeleteTask={onDeleteTask}
                              onEditTask={onEditTask}
                              hideFinancialInfo={hideFinancialColumns}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="mt-6">
              {Object.keys(milestoneGroups).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Active Milestones</h3>
                  <p className="text-sm">Milestones will appear here when projects have them.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortDateKeys(Object.keys(milestoneGroups)).map(dateKey => {
                    const displayDate = dateKey === 'today' ? 'Today' :
                                      dateKey === 'tomorrow' ? 'Tomorrow' :
                                      dateKey === 'yesterday' ? 'Yesterday' :
                                      format(parseISO(dateKey), 'EEEE, MMMM d');
                    
                    return (
                      <div key={dateKey}>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            dateKey === 'today' ? 'bg-green-500' :
                            dateKey === 'tomorrow' ? 'bg-blue-500' :
                            dateKey === 'yesterday' ? 'bg-red-500' :
                            'bg-slate-400'
                          }`} />
                          {displayDate}
                        </h3>
                        <div className="grid gap-4">
                          {milestoneGroups[dateKey].map(milestone => {
                            const project = projects.find(p => p.id === milestone.projectId);
                            const client = clients.find(c => c.id === project?.clientId);
                            
                            return (
                              <Card key={milestone.id} className="border border-slate-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Target className="w-4 h-4 text-amber-600" />
                                        <h4 className="font-medium text-slate-900">{milestone.title}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                          'bg-slate-100 text-slate-800'
                                        }`}>
                                          {milestone.status}
                                        </span>
                                      </div>
                                      
                                      {milestone.description && (
                                        <p className="text-sm text-slate-600 mb-2">{milestone.description}</p>
                                      )}
                                      
                                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                                        <span>📋 {project?.name || 'Unknown Project'}</span>
                                        <span>👤 {client?.name || 'Unknown Client'}</span>
                                        {!hideFinancialColumns && milestone.amount && (
                                          <span>💰 ${milestone.amount}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        projects={projects}
        clients={clients}
      />
    </div>
  );
};

export default DashboardTasksTimeline;
