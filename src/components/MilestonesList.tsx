
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MilestoneCard from './MilestoneCard';
import { Milestone } from '@/hooks/useMilestones';

interface Invoice {
  id: string;
  status: string;
  amount: number;
  milestoneId?: string;
}

interface MilestonesListProps {
  milestones: Milestone[];
  projectInvoices: Invoice[];
  isCreatingInvoice: string | null;
  onAddMilestone: () => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onCreateInvoiceForMilestone: (milestone: Milestone) => void;
  onQuickMarkAsPaid: (milestone: Milestone) => void;
  onInvoiceStatusChange: () => void;
  hasClient: boolean;
}

const MilestonesList = ({
  milestones,
  projectInvoices,
  isCreatingInvoice,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onCreateInvoiceForMilestone,
  onQuickMarkAsPaid,
  onInvoiceStatusChange,
  hasClient
}: MilestonesListProps) => {
  const getMilestoneInvoice = (milestoneId: string) => {
    return projectInvoices.find(inv => inv.milestoneId === milestoneId);
  };

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 mb-4">No milestones yet for this project</p>
        <Button
          onClick={onAddMilestone}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Milestone
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const milestoneInvoice = getMilestoneInvoice(milestone.id);
        const isCreatingForThisMilestone = isCreatingInvoice === milestone.id;
        
        return (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            milestoneInvoice={milestoneInvoice}
            isCreatingInvoice={isCreatingForThisMilestone}
            onEdit={onEditMilestone}
            onDelete={onDeleteMilestone}
            onCreateInvoice={onCreateInvoiceForMilestone}
            onMarkAsPaid={onQuickMarkAsPaid}
            onInvoiceStatusChange={onInvoiceStatusChange}
            hasClient={hasClient}
          />
        );
      })}
    </div>
  );
};

export default MilestonesList;
