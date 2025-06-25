
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task, Project, Client } from '@/types';
import { CheckCircle, Clock, Edit2, Trash2, PlayCircle, PauseCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  project?: Project;
  client?: Client;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  hideFinancialInfo?: boolean;
}

const TaskCard = ({ 
  task, 
  project, 
  client, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask,
  hideFinancialInfo = false
}: TaskCardProps) => {
  const handleStatusUpdate = (newStatus: Task['status']) => {
    const updates: Partial<Task> = { status: newStatus };
    
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    
    onUpdateTask(task.id, updates);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card className="border border-slate-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon()}
              <h4 className="font-medium text-slate-900">{task.title}</h4>
              <Badge className={getStatusColor()}>
                {task.status}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-sm text-slate-600 mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>📋 {project?.name || 'Unknown Project'}</span>
              <span>👤 {client?.name || 'Unknown Client'}</span>
              
              {task.estimatedHours && (
                <span>⏱️ {task.estimatedHours}h estimated</span>
              )}
              
              {task.workedHours && task.workedHours > 0 && (
                <span>✅ {task.workedHours}h worked</span>
              )}
              
              {task.endDate && (
                <span>📅 Due {format(parseISO(task.endDate), 'MMM d')}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {task.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('in-progress')}
                className="text-blue-600 hover:text-blue-700"
              >
                <PlayCircle className="w-4 h-4" />
              </Button>
            )}
            
            {task.status === 'in-progress' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('pending')}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <PauseCircle className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('completed')}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditTask(task)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteTask(task.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
