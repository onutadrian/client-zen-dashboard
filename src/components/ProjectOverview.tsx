
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Edit, Trash2, FileText, CheckCircle } from 'lucide-react';
import ProjectBilledHours from './ProjectBilledHours';
import LogProjectHoursModal from './LogProjectHoursModal';
import AddProjectTaskModal from './AddProjectTaskModal';
import AddMilestoneModal from './AddMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import AddInvoiceModal from './AddInvoiceModal';
import InvoiceStatusButton from './InvoiceStatusButton';
import DuplicateInvoiceWarning from './DuplicateInvoiceWarning';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectOverviewProps {
  project: Project;
  client?: Client;
  tasks: Task[];
  milestones: Milestone[];
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => void;
  onUpdateTask: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage' | 'paymentStatus'>) => void;
  onUpdateMilestone: (milestoneId: string, updatedMilestone: Partial<Milestone>) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onUpdateProject: (projectId: string, updatedProject: Partial<Project>) => void;
}

const ProjectOverview = ({
  project,
  client,
  tasks,
  milestones,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onUpdateProject
}: ProjectOverviewProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [selectedMilestoneForInvoice, setSelectedMilestoneForInvoice] = useState<Milestone | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState<string | null>(null);

  const { invoices } = useInvoices();
  const isFixedPrice = project.pricingType === 'fixed';
  const projectInvoices = invoices.filter(i => i.projectId === project.id);

  const handleCreateInvoiceForMilestone = (milestone: Milestone) => {
    // Check if invoice already exists for this milestone
    const existingInvoice = getMilestoneInvoice(milestone.id);
    if (existingInvoice) {
      // Show a warning or toast that invoice already exists
      console.warn('Invoice already exists for this milestone');
      return;
    }
    
    setIsCreatingInvoice(milestone.id);
    setSelectedMilestoneForInvoice(milestone);
    setShowAddInvoiceModal(true);
  };

  const handleQuickMarkAsPaid = async (milestone: Milestone) => {
    await onUpdateMilestone(milestone.id, { paymentStatus: 'paid' });
  };

  const handleInvoiceModalClose = () => {
    setShowAddInvoiceModal(false);
    setSelectedMilestoneForInvoice(null);
    setIsCreatingInvoice(null);
  };

  // Get invoice for milestone
  const getMilestoneInvoice = (milestoneId: string) => {
    return projectInvoices.find(inv => inv.milestoneId === milestoneId);
  };

  return (
    <div className="space-y-6">
      {/* Project Hours/Revenue Section */}
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

      {/* Milestones Section - Priority for Fixed Price Projects */}
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
          {milestones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No milestones yet for this project</p>
              <Button
                onClick={() => setShowAddMilestoneModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Milestone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => {
                const milestoneInvoice = getMilestoneInvoice(milestone.id);
                const isCreatingForThisMilestone = isCreatingInvoice === milestone.id;
                
                return (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    {/* Show duplicate invoice warning if trying to create an invoice for a milestone that already has one */}
                    {isCreatingForThisMilestone && milestoneInvoice && (
                      <div className="mb-4">
                        <DuplicateInvoiceWarning milestoneTitle={milestone.title} />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status.replace('-', ' ')}
                          </span>
                          {milestone.paymentStatus && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              milestone.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              milestone.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.paymentStatus}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{milestone.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>Due: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                          {milestone.amount && (
                            <span>Value: ${milestone.amount.toLocaleString()}</span>
                          )}
                          <span>{milestone.completionPercentage}% complete</span>
                        </div>
                        
                        {/* Invoice Status Display */}
                        {milestoneInvoice && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500">Invoice:</span>
                              <InvoiceStatusButton 
                                invoiceId={milestoneInvoice.id}
                                currentStatus={milestoneInvoice.status}
                                onStatusChange={() => {
                                  // Refresh data after status change
                                  window.location.reload();
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {milestone.status === 'completed' && milestone.paymentStatus === 'unpaid' && !milestoneInvoice && client && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateInvoiceForMilestone(milestone)}
                            disabled={isCreatingForThisMilestone}
                            className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            {isCreatingForThisMilestone ? 'Creating...' : 'Invoice'}
                          </Button>
                        )}
                        {milestone.status === 'completed' && milestone.paymentStatus === 'unpaid' && milestoneInvoice && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickMarkAsPaid(milestone)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Paid
                          </Button>
                        )}
                        {milestoneInvoice && (
                          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            Invoice exists
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMilestone(milestone)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No tasks yet for this project</p>
              <Button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-slate-600">{task.description}</p>
                      {(task.estimatedHours || task.actualHours) && (
                        <p className="text-sm text-slate-500 mt-1">
                          {task.actualHours || 0}h / {task.estimatedHours || 0}h estimated
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {client && !isFixedPrice && (
        <LogProjectHoursModal
          isOpen={showLogHoursModal}
          onClose={() => setShowLogHoursModal(false)}
          project={project}
          client={client}
        />
      )}

      <AddProjectTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={onAddTask}
        projectId={project.id}
        clientId={client?.id || 0}
        clientName={client?.name || ''}
      />

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
    </div>
  );
};

export default ProjectOverview;
