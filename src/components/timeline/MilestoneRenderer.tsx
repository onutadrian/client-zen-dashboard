
import React from 'react';
import { Flag } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';
import { Project } from '@/hooks/useProjects';

interface MilestoneRendererProps {
  milestones: Milestone[];
  project: Project;
  totalHeight: number;
}

const MilestoneRenderer = ({ milestones, project, totalHeight }: MilestoneRendererProps) => {
  const getMilestonePosition = (milestone: Milestone, project: Project) => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.estimatedEndDate);
    const milestoneDate = new Date(milestone.targetDate);
    
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    const milestoneOffset = milestoneDate.getTime() - projectStart.getTime();
    
    const position = (milestoneOffset / projectDuration) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <>
      {milestones.map((milestone) => {
        const position = getMilestonePosition(milestone, project);
        
        return (
          <div
            key={milestone.id}
            className="absolute w-1 bg-red-500 flex items-center justify-center"
            style={{ 
              left: `${position}%`,
              top: '0px',
              height: `${totalHeight}px`
            }}
            title={`${milestone.title} - ${new Date(milestone.targetDate).toLocaleDateString()}`}
          >
            <Flag className="w-3 h-3 text-red-500 absolute -top-1" />
          </div>
        );
      })}
    </>
  );
};

export default MilestoneRenderer;
