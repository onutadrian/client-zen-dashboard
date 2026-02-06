
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddMilestoneModal from './AddMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import MilestonesList from './MilestonesList';
import MilestoneDetailsSheet from './MilestoneDetailsSheet';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
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
  const [viewMilestone, setViewMilestone] = useState<Milestone | null>(null);
  const isActive = project.status === 'active';

  const isFixedPrice = project.pricingType === 'fixed';

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isFixedPrice ? 'Project Milestones' : 'Milestones'}
        </h3>
        <div className="flex items-center gap-3">
          {!isActive && (
            <span className="text-sm text-slate-500">Project is inactive</span>
          )}
          <Button variant="primary"
            onClick={() => setShowAddMilestoneModal(true)}
           
            disabled={!isActive}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <MilestonesList
            milestones={milestones}
            onAddMilestone={() => setShowAddMilestoneModal(true)}
            onEditMilestone={setEditingMilestone}
            onDeleteMilestone={onDeleteMilestone}
            onViewMilestone={setViewMilestone}
            canAdd={isActive}
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

      <MilestoneDetailsSheet
        milestone={viewMilestone}
        isOpen={!!viewMilestone}
        onClose={() => setViewMilestone(null)}
      />
    </>
  );
};

export default ProjectMilestoneSection;
