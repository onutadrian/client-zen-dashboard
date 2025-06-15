
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface TaskTableProps {
  tasks: Task[];
  clients: Client[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

const TaskTable = ({ tasks, clients, onTaskClick, onUpdateTask, onDeleteTask, onEditTask }: TaskTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleComplete = (task: Task) => {
    const client = clients.find(c => c.id === task.clientId);
    const isHourlyClient = client?.priceType === 'hour';
    
    if (isHourlyClient && task.estimatedHours) {
      onUpdateTask(task.id, 'completed', task.estimatedHours);
    } else {
      onUpdateTask(task.id, 'completed');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow 
            key={task.id} 
            className="cursor-pointer hover:bg-slate-50"
            onClick={() => onTaskClick(task)}
          >
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.clientName}</TableCell>
            <TableCell>
              {task.estimatedHours ? `${task.estimatedHours}h` : '-'}
              {task.actualHours && ` (${task.actualHours}h actual)`}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {task.status !== 'completed' && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(task);
                    }}>
                      Complete
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
