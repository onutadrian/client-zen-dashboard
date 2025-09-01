
export interface HourEntry {
  id: number;
  projectId: string;
  clientId: number;
  hours: number;
  description?: string;
  date: string;
  billed: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  milestoneId?: string;
  taskId?: number;
}
