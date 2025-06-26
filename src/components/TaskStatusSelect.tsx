
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskStatusSelectProps {
  status: Task['status'];
  onStatusChange: (status: Task['status']) => void;
}

const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  return (
    <Select
      value={status}
      onValueChange={(value: Task['status']) => onStatusChange(value)}
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
  );
};

export default TaskStatusSelect;
