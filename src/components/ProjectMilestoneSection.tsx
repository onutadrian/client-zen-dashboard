
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddMilestoneModal from './AddMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import MilestonesList from './MilestonesList';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';

interface ProjectMilestoneSectionProps {
  project: Project;
  client?: Client;
  milestones: Milestone[];
  onAddMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage'>) => void;
  onUpdateMilestone: (milestoneId: string, updatedMilestone: Partial<Milestone>) => void;
  onDeleteMilestone: (milestoneId: string) => void;
}

const ProjectMilestoneSection = ({
  project,
  client,
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone
}: ProjectMilestoneSectionProps) => {
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const isFixedPrice = project.pricingType === 'fixed';

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isFixedPrice ? 'Project Milestones' : 'Milestones'}
        </h3>
        <Button
          onClick={() => setShowAddMilestoneModal(true)}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <MilestonesList
            milestones={milestones}
            onAddMilestone={() => setShowAddMilestoneModal(true)}
            onEditMilestone={setEditingMilestone}
            onDeleteMilestone={onDeleteMilestone}
          />
        </CardContent>
      </Card>

      <AddMilestoneModal
        isOpen={showAddMilestoneModal}
        onClose={() => setShowAddMilestoneModal(false)}
        onAdd={onAddMilestone}
        project={project}
      />

      {editingMilestone && (
        <EditMilestoneModal
          isOpen={true}
          onClose={() => setEditingMilestone(null)}
          onUpdate={onUpdateMilestone}
          milestone={editingMilestone}
        />
      )}
    </>
  );
};

export default ProjectMilestoneSection;
