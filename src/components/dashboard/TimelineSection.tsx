
import React from 'react';
import ProjectTimeline from '@/components/ProjectTimeline';
import { Task } from '@/types/task';
import { Project } from '@/hooks/useProjects';

interface TimelineSectionProps {
  projects: Project[];
  tasks: Task[];
  milestones: any[];
  clients: any[];
}

const TimelineSection = ({ projects, tasks, milestones, clients }: TimelineSectionProps) => {
  return (
    <ProjectTimeline
      projects={projects.map(project => ({
        id: project.id,
        name: project.name,
        clientId: project.clientId,
        startDate: project.startDate,
        estimatedEndDate: project.estimatedEndDate,
        endDate: project.endDate,
        status: project.status,
        notes: project.notes,
        documents: project.documents,
        team: project.team,
        archived: project.archived,
        pricingType: project.pricingType,
        fixedPrice: project.fixedPrice,
        hourlyRate: project.hourlyRate,
        dailyRate: project.dailyRate,
        estimatedHours: project.estimatedHours,
        currency: project.currency,
        invoices: project.invoices
      }))}
      tasks={tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        projectId: task.projectId || '',
        clientId: task.clientId,
        clientName: task.clientName,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        workedHours: task.workedHours,
        startDate: task.startDate,
        endDate: task.endDate,
        completedDate: task.completedDate,
        createdDate: task.createdDate,
        notes: task.notes,
        assets: task.assets
      }))}
      milestones={milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description || '',
        projectId: milestone.projectId,
        status: milestone.status,
        targetDate: milestone.targetDate,
        amount: milestone.amount,
        currency: milestone.currency || 'USD',
        estimatedHours: milestone.estimatedHours,
        completionPercentage: milestone.completionPercentage,
        createdAt: milestone.createdAt,
        updatedAt: milestone.updatedAt
      }))}
      clients={clients.map(client => ({
        id: client.id,
        name: client.name
      }))}
    />
  );
};

export default TimelineSection;
