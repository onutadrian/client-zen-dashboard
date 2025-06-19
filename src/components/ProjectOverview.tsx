
import React from 'react';
import ProjectTimeTrackingSection from './ProjectTimeTrackingSection';
import ProjectMilestoneSection from './ProjectMilestoneSection';
import ProjectTaskSection from './ProjectTaskSection';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { Task } from '@/types/task';

interface ProjectOverviewProps {
  project: Project;
  client?: Client;
  tasks: Task[];
  milestones: Milestone[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage' | 'paymentStatus'>) => void;
  onUpdateMilestone: (milestoneId: string, updatedMilestone: Partial<Milestone>) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onUpdateProject: (projectId: string, updatedProject: Partial<Project>) => void;
}

const ProjectOverview = ({
  project,
  client,
  tasks,
  milestones,
  onAddTask,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone
}: ProjectOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Project Hours/Revenue Section */}
      <ProjectTimeTrackingSection 
        project={project}
        client={client}
        milestones={milestones}
        onAddMilestone={onAddMilestone}
      />

      {/* Milestones Section */}
      <ProjectMilestoneSection
        project={project}
        client={client}
        milestones={milestones}
        onAddMilestone={onAddMilestone}
        onUpdateMilestone={onUpdateMilestone}
        onDeleteMilestone={onDeleteMilestone}
      />

      {/* Tasks Section */}
      <ProjectTaskSection
        project={project}
        client={client}
        tasks={tasks}
        onAddTask={onAddTask}
      />
    </div>
  );
};

export default ProjectOverview;
