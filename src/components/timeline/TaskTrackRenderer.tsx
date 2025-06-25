
import React from 'react';
import { Task } from '@/hooks/useTasks';
import { Project } from '@/hooks/useProjects';

interface TaskWithPosition extends Task {
  position: { left: number; width: number };
  trackIndex: number;
}

interface TaskTrackRendererProps {
  tasks: TaskWithPosition[];
  totalHeight: number;
}

const TaskTrackRenderer = ({ tasks, totalHeight }: TaskTrackRendererProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-600';
      case 'on-hold':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      {tasks.map((task) => {
        const topOffset = 4 + (task.trackIndex * 22);
        
        return (
          <div
            key={task.id}
            className={`absolute h-5 ${getStatusColor(task.status)} rounded-sm opacity-90 border border-white shadow-sm`}
            style={{
              left: `${task.position.left}%`,
              width: `${task.position.width}%`,
              top: `${topOffset}px`
            }}
            title={`${task.title} (${task.status})`}
          />
        );
      })}
    </>
  );
};

// Helper function to detect overlapping tasks and assign them to tracks
export const getTaskTracks = (projectTasks: Task[], project: Project): TaskWithPosition[] => {
  const getTaskPosition = (task: Task, project: Project) => {
    if (!task.startDate || !task.endDate) return { left: 0, width: 0 };
    
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const taskStartOffset = taskStart.getTime() - projectStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const left = (taskStartOffset / projectDuration) * 100;
    const width = (taskDuration / projectDuration) * 100;
    
    return { left: Math.max(0, left), width: Math.max(2, width) };
  };

  // Filter tasks with valid dates and calculate positions
  const tasksWithPositions = projectTasks
    .filter(task => task.startDate && task.endDate)
    .map(task => ({
      ...task,
      position: getTaskPosition(task, project),
      trackIndex: 0
    }))
    .filter(task => task.position.width > 0)
    .sort((a, b) => a.position.left - b.position.left);

  if (tasksWithPositions.length === 0) return [];

  // Assign tracks using interval scheduling algorithm
  const tracks: Array<{ endPosition: number }> = [];
  
  tasksWithPositions.forEach(task => {
    const taskStart = task.position.left;
    const taskEnd = task.position.left + task.position.width;
    
    // Find the first available track
    let assignedTrack = -1;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].endPosition <= taskStart) {
        assignedTrack = i;
        break;
      }
    }
    
    // If no available track found, create a new one
    if (assignedTrack === -1) {
      assignedTrack = tracks.length;
      tracks.push({ endPosition: taskEnd });
    } else {
      tracks[assignedTrack].endPosition = taskEnd;
    }
    
    task.trackIndex = assignedTrack;
  });

  return tasksWithPositions;
};

export default TaskTrackRenderer;
