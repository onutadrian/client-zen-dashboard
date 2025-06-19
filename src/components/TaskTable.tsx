
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import CaptureWorkedHoursModal from './CaptureWorkedHoursModal';

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  workedHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
}

interface Client {
  id: number;
  name: string;
  priceType: string;
  hourEntries?: Array<{
    id: number;
    hours: number;
    description: string;
    date: string;
    billed?: boolean;
  }>;
}

interface Project {
  id: string;
  name: string;
  clientId: number;
}

interface TaskTableProps {
  tasks: Task[];
  clients: Client[];
  projects?: Project[];
  onTaskClick: (task: Task) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

const TaskTable = ({ 
  tasks, 
  clients, 
  projects = [],
  onTaskClick, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask 
}: TaskTableProps) => {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const isBilled = (task: Task) => {
    const client = clients.find(c => c.id === task.clientId);
    if (!client || !client.hourEntries) return false;

    const taskDescription = `Completed task: ${task.title}`;
    const taskHourEntry = client.hourEntries.find(entry => 
      entry.description === taskDescription && entry.billed === true
    );

    return !!taskHourEntry;
  };

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    if (newStatus === 'completed' && task.status !== 'completed') {
      setSelectedTask(task);
      setShowHoursModal(true);
    } else {
      onUpdateTask(task.id, newStatus);
    }
  };

  const handleWorkedHoursSubmit = (workedHours: number) => {
    if (selectedTask) {
      onUpdateTask(selectedTask.id, 'completed', workedHours);
    }
    setSelectedTask(null);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Billed</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.id} 
                className="cursor-pointer hover:bg-slate-50" 
                onClick={() => onTaskClick(task)}
              >
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{task.clientName}</TableCell>
                <TableCell>
                  <span className="text-sm text-slate-600">
                    {getProjectName(task.projectId)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={task.status}
                      onValueChange={(value: Task['status']) => handleStatusChange(task, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span>Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>In Progress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Completed</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {task.workedHours && task.workedHours > 0 ? (
                      <div className="text-green-600 font-medium">{task.workedHours}h</div>
                    ) : (
                      <div className="text-slate-400">-</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={isBilled(task) ? "default" : "secondary"}
                    className={isBilled(task) ? "bg-green-100 text-green-800" : ""}
                  >
                    {isBilled(task) ? "Billed" : "Not Billed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {new Date(task.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTask(task)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CaptureWorkedHoursModal
        isOpen={showHoursModal}
        onClose={() => {
          setShowHoursModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onComplete={handleWorkedHoursSubmit}
      />
    </>
  );
};

export default TaskTable;
