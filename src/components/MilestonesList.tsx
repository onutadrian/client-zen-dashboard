
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MilestoneCard from './MilestoneCard';
import { Milestone } from '@/hooks/useMilestones';

interface MilestonesListProps {
  milestones: Milestone[];
  onAddMilestone: () => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onViewMilestone?: (milestone: Milestone) => void;
  canAdd?: boolean;
}

const MilestonesList = ({
  milestones,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onViewMilestone,
  canAdd = true
}: MilestonesListProps) => {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 mb-4">No milestones yet for this project</p>
        <Button
          onClick={onAddMilestone}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
          disabled={!canAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Milestone
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          onEdit={onEditMilestone}
          onDelete={onDeleteMilestone}
          onView={onViewMilestone}
        />
      ))}
    </div>
  );
};

export default MilestonesList;
