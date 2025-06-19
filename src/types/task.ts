
export interface Task {
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

export type TaskStatus = Task['status'];
export type CreateTaskData = Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>;
export type UpdateTaskData = Partial<Task>;
