
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import ProjectBilledHours from './ProjectBilledHours';
import LogProjectHoursModal from './LogProjectHoursModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';

interface ProjectTimeTrackingSectionProps {
  project: Project;
  client?: Client;
  milestones: Milestone[];
}

const ProjectTimeTrackingSection = ({
  project,
  client,
  milestones
}: ProjectTimeTrackingSectionProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const isFixedPrice = project.pricingType === 'fixed';

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isFixedPrice ? 'Progress & Revenue Tracking' : 'Time Tracking'}
        </h3>
        {client && !isFixedPrice && (
          <Button
            onClick={() => setShowLogHoursModal(true)}
            className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Log Hours
          </Button>
        )}
        {client && isFixedPrice && milestones.length === 0 && (
          <div className="text-sm text-slate-500">
            Add milestones to track project progress and revenue
          </div>
        )}
      </div>
      
      <ProjectBilledHours project={project} client={client} milestones={milestones} />

      {client && !isFixedPrice && (
        <LogProjectHoursModal
          isOpen={showLogHoursModal}
          onClose={() => setShowLogHoursModal(false)}
          project={project}
          client={client}
        />
      )}
    </>
  );
};

export default ProjectTimeTrackingSection;
