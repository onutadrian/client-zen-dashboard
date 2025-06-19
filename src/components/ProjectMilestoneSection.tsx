
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddMilestoneModal from './AddMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import AddInvoiceModal from './AddInvoiceModal';
import MilestonesList from './MilestonesList';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';

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
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [selectedMilestoneForInvoice, setSelectedMilestoneForInvoice] = useState<Milestone | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { invoices } = useInvoices();
  const isFixedPrice = project.pricingType === 'fixed';
  const projectInvoices = invoices.filter(i => i.projectId === project.id);

  const handleCreateInvoiceForMilestone = (milestone: Milestone) => {
    const existingInvoice = projectInvoices.find(inv => inv.milestoneId === milestone.id);
    if (existingInvoice) {
      console.warn('Invoice already exists for this milestone');
      return;
    }
    
    setIsCreatingInvoice(milestone.id);
    setSelectedMilestoneForInvoice(milestone);
    setShowAddInvoiceModal(true);
  };

  const handleQuickMarkAsPaid = async (milestone: Milestone) => {
    // This functionality is no longer needed since we removed paymentStatus
    console.log('Mark as paid functionality removed');
  };

  const handleInvoiceModalClose = () => {
    setShowAddInvoiceModal(false);
    setSelectedMilestoneForInvoice(null);
    setIsCreatingInvoice(null);
    // Force refresh to show updated invoice status
    setRefreshKey(prev => prev + 1);
  };

  const handleInvoiceStatusChange = () => {
    // Force a re-render by updating the refresh key
    setRefreshKey(prev => prev + 1);
  };

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

      <Card key={refreshKey}>
        <CardContent className="p-6">
          <MilestonesList
            milestones={milestones}
            projectInvoices={projectInvoices}
            isCreatingInvoice={isCreatingInvoice}
            onAddMilestone={() => setShowAddMilestoneModal(true)}
            onEditMilestone={setEditingMilestone}
            onDeleteMilestone={onDeleteMilestone}
            onCreateInvoiceForMilestone={handleCreateInvoiceForMilestone}
            onQuickMarkAsPaid={handleQuickMarkAsPaid}
            onInvoiceStatusChange={handleInvoiceStatusChange}
            hasClient={!!client}
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

      {client && (
        <AddInvoiceModal
          isOpen={showAddInvoiceModal}
          onClose={handleInvoiceModalClose}
          project={project}
          client={client}
          milestone={selectedMilestoneForInvoice || undefined}
        />
      )}
    </>
  );
};

export default ProjectMilestoneSection;
