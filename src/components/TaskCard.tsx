
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileText, Link as LinkIcon, CheckCircle, Play, Pause } from 'lucide-react';

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

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: number, status: Task['status'], actualHours?: number) => void;
  isHourlyClient: boolean;
}

const TaskCard = ({ task, onUpdateStatus, isHourlyClient }: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-slate-300 text-slate-900 border-slate-400';
      case 'in-progress':
        return 'bg-slate-200 text-slate-900 border-slate-300';
      case 'pending':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCompleteTask = () => {
    if (isHourlyClient && task.estimatedHours) {
      // Always use estimated hours as actual hours for hourly clients when completing
      onUpdateStatus(task.id, 'completed', task.estimatedHours);
    } else {
      onUpdateStatus(task.id, 'completed');
    }
  };

  const handleStartTask = () => {
    onUpdateStatus(task.id, 'in-progress');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{task.clientName}</span>
              </div>
              {task.estimatedHours && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{task.estimatedHours}h estimated</span>
                </div>
              )}
              {task.actualHours && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{task.actualHours}h actual</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ')}
            </Badge>
            {task.status === 'pending' && (
              <Button size="sm" variant="outline" onClick={handleStartTask} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            )}
            {task.status === 'in-progress' && (
              <Button size="sm" className="bg-slate-800 hover:bg-slate-900 text-white" onClick={handleCompleteTask}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-slate-600 text-sm mb-3">{task.description}</p>
        )}
        
        {task.notes && (
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FileText className="w-4 h-4 mr-1 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Notes</span>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{task.notes}</p>
          </div>
        )}
        
        {task.assets.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <LinkIcon className="w-4 h-4 mr-1 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Assets ({task.assets.length})</span>
            </div>
            <div className="space-y-1">
              {task.assets.map((asset, index) => (
                <div key={index} className="text-sm">
                  {asset.startsWith('http') ? (
                    <a 
                      href={asset} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-slate-900 hover:underline font-medium"
                    >
                      {asset}
                    </a>
                  ) : (
                    <span className="text-slate-600">{asset}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-slate-500 pt-2 border-t">
          Created: {new Date(task.createdDate).toLocaleDateString()}
          {task.completedDate && (
            <>
              {' • '}
              Completed: {new Date(task.completedDate).toLocaleDateString()}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
