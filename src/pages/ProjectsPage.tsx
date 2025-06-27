
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import ProjectsSection from '@/components/ProjectsSection';
import ProjectTimeline from '@/components/ProjectTimeline';
import AddProjectModal from '@/components/AddProjectModal';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useCurrency } from '@/hooks/useCurrency';

const ProjectsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const { displayCurrency } = useCurrency();
  const { clients } = useClients();
  const { projects, showArchived, setShowArchived, addProject, updateProject, archiveProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const { milestones } = useMilestones();

  return (
    <DashboardContainer>
      <div className="min-h-screen" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="show-archived" checked={showArchived} onCheckedChange={setShowArchived} />
                <Label htmlFor="show-archived">Show Archived</Label>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <ProjectsSection 
                projects={projects} 
                clients={clients} 
                onAddProject={addProject} 
                onUpdateProject={updateProject} 
                onArchiveProject={archiveProject} 
                onDeleteProject={deleteProject} 
              />
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <ProjectTimeline
                projects={projects.map(project => ({
                  id: project.id,
                  name: project.name,
                  clientId: project.clientId,
                  startDate: project.startDate,
                  estimatedEndDate: project.estimatedEndDate,
                  endDate: project.endDate,
                  status: project.status,
                  notes: project.notes,
                  documents: project.documents,
                  team: project.team,
                  archived: project.archived,
                  pricingType: project.pricingType,
                  fixedPrice: project.fixedPrice,
                  hourlyRate: project.hourlyRate,
                  dailyRate: project.dailyRate,
                  estimatedHours: project.estimatedHours,
                  currency: project.currency,
                  invoices: project.invoices
                }))}
                tasks={tasks.map(task => ({
                  id: task.id,
                  title: task.title,
                  description: task.description || '',
                  status: task.status,
                  projectId: task.projectId || '',
                  clientId: task.clientId,
                  clientName: task.clientName,
                  estimatedHours: task.estimatedHours,
                  actualHours: task.actualHours,
                  workedHours: task.workedHours,
                  startDate: task.startDate,
                  endDate: task.endDate,
                  completedDate: task.completedDate,
                  createdDate: task.createdDate,
                  notes: task.notes,
                  assets: task.assets
                }))}
                milestones={milestones.map(milestone => ({
                  id: milestone.id,
                  title: milestone.title,
                  description: milestone.description || '',
                  projectId: milestone.projectId,
                  status: milestone.status,
                  targetDate: milestone.targetDate,
                  amount: milestone.amount,
                  currency: milestone.currency || 'USD',
                  estimatedHours: milestone.estimatedHours,
                  completionPercentage: milestone.completionPercentage,
                  createdAt: milestone.createdAt,
                  updatedAt: milestone.updatedAt
                }))}
                clients={clients.map(client => ({
                  id: client.id,
                  name: client.name
                }))}
              />
            </TabsContent>
          </Tabs>

          <AddProjectModal 
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={addProject}
            clients={clients}
          />
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ProjectsPage;
