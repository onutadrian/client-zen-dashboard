
import { useState } from 'react';

export interface Task {
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

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete overhaul of the company website with modern design",
      clientId: 1,
      clientName: "Acme Corporation",
      estimatedHours: 40,
      status: "in-progress",
      notes: "Focus on mobile responsiveness and SEO optimization",
      assets: ["https://figma.com/design-file", "Brand guidelines.pdf"],
      createdDate: "2024-06-01",
    }
  ]);

  const addTask = (newTask: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now(),
      status: 'pending',
      createdDate: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
  };

  const updateTask = (taskId: number, status: Task['status'], actualHours?: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        
        if (status === 'completed') {
          updatedTask.completedDate = new Date().toISOString();
          
          const hoursToLog = actualHours || task.estimatedHours;
          if (hoursToLog) {
            updatedTask.actualHours = hoursToLog;
          }
        }
        
        return updatedTask;
      }
      return task;
    }));

    // Return the task and hours for client update
    const completedTask = tasks.find(t => t.id === taskId);
    if (status === 'completed' && completedTask) {
      const hoursToLog = actualHours || completedTask.estimatedHours;
      return { task: completedTask, hoursToLog };
    }
    return null;
  };

  return {
    tasks,
    addTask,
    updateTask
  };
};
