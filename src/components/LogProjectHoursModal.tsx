import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { Milestone } from '@/hooks/useMilestones';
import LogHoursForm from './LogHoursForm';
import { getButtonText } from '@/utils/pricingUtils';

interface LogProjectHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  client: Client;
  milestones: Milestone[];
  onCreateMilestone?: () => void;
}

const LogProjectHoursModal = ({ 
  isOpen, 
  onClose, 
  project, 
  client, 
  milestones,
  onCreateMilestone 
}: LogProjectHoursModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {getButtonText(project.pricingType)} for {project.name}
          </DialogTitle>
          <DialogDescription>
            Log hours worked on this project and track your progress.
          </DialogDescription>
        </DialogHeader>
        <LogHoursForm
          project={project}
          client={client}
          milestones={milestones}
          onClose={onClose}
          onCreateMilestone={onCreateMilestone}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LogProjectHoursModal;
