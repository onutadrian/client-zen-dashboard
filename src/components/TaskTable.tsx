
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CaptureWorkedHoursModal from './CaptureWorkedHoursModal';
import TaskTableHeader from './TaskTableHeader';
import TaskTableRow from './TaskTableRow';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';

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
  onAddTaskClick?: () => void;
}

const TaskTable = ({ 
  tasks, 
  clients, 
  projects = [],
  onTaskClick, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask,
  onAddTaskClick
}: TaskTableProps) => {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isAdmin } = useAuth();

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
      <div className="space-y-4">
        <TaskTableHeader 
          taskCount={tasks.length}
          onAddTaskClick={onAddTaskClick}
        />

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours Worked</TableHead>
                {isAdmin && <TableHead>Billed</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskTableRow
                  key={task.id}
                  task={task}
                  clients={clients}
                  projects={projects}
                  onTaskClick={onTaskClick}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </div>
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
