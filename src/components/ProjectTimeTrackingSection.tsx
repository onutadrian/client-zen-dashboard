import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import ProjectBilledHours from './ProjectBilledHours';
import LogProjectHoursModal from './LogProjectHoursModal';
import MilestoneHoursTracker from './MilestoneHoursTracker';
import AddMilestoneModal from './AddMilestoneModal';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';

interface ProjectTimeTrackingSectionProps {
  project: Project;
  client?: Client;
  milestones: Milestone[];
  onAddMilestone?: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage' | 'paymentStatus'>) => void;
}

const ProjectTimeTrackingSection = ({
  project,
  client,
  milestones,
  onAddMilestone
}: ProjectTimeTrackingSectionProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const { hourEntries } = useHourEntries();
  
  const isFixedPrice = project.pricingType === 'fixed';
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);

  const getLogButtonText = () => {
    switch (project.pricingType) {
      case 'daily':
        return 'Log Days';
      default:
        return 'Log Hours';
    }
  };

  const handleCreateMilestone = () => {
    setShowLogHoursModal(false);
    setShowAddMilestoneModal(true);
  };

  const handleMilestoneCreated = (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage' | 'paymentStatus'>) => {
    if (onAddMilestone) {
      onAddMilestone(milestone);
    }
    setShowAddMilestoneModal(false);
    setShowLogHoursModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isFixedPrice ? 'Progress & Revenue Tracking' : 'Time Tracking'}
          </h3>
          {client && (
            <div className="flex items-center gap-2">
              {!isFixedPrice && (
                <Button
                  onClick={() => setShowLogHoursModal(true)}
                  className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {getLogButtonText()}
                </Button>
              )}
              {isFixedPrice && milestones.length === 0 && (
                <div className="text-sm text-slate-500">
                  Add milestones to track project progress and revenue
                </div>
              )}
            </div>
          )}
        </div>
        
        <ProjectBilledHours project={project} client={client} milestones={milestones} />

        {/* Show milestone hours tracker if there are any hours logged */}
        {projectHours.length > 0 && (
          <MilestoneHoursTracker 
            milestones={milestones}
            hourEntries={projectHours}
          />
        )}
      </div>

      {client && (
        <>
          <LogProjectHoursModal
            isOpen={showLogHoursModal}
            onClose={() => setShowLogHoursModal(false)}
            project={project}
            client={client}
            milestones={milestones}
            onCreateMilestone={handleCreateMilestone}
          />

          <AddMilestoneModal
            isOpen={showAddMilestoneModal}
            onClose={() => setShowAddMilestoneModal(false)}
            onAdd={handleMilestoneCreated}
            project={project}
          />
        </>
      )}
    </>
  );
};

export default ProjectTimeTrackingSection;
