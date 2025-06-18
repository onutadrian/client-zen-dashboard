
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '@/components/ProjectHeader';
import ProjectOverview from '@/components/ProjectOverview';
import ProjectTeamMembers from '@/components/ProjectTeamMembers';
import ProjectBudgetTracking from '@/components/ProjectBudgetTracking';
import ProjectSettings from '@/components/ProjectSettings';
import ProjectActivitySidebar from '@/components/ProjectActivitySidebar';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('overview');

  const { projects, updateProject, archiveProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { tasks, addTask, updateTask, deleteTask, editTask } = useTasks();
  const { milestones, addMilestone, updateMilestone } = useMilestones();

  const project = projects.find(p => p.id === id);
  const client = clients.find(c => c.id === project?.clientId);
  const projectTasks = tasks.filter(task => task.projectId === id);
  const projectMilestones = milestones.filter(milestone => milestone.projectId === id);

  if (!project) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Project not found</h1>
          <Button onClick={() => navigate('/projects')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="flex">
        {/* Main Content - 70% */}
        <div className="flex-1 p-6 pr-3">
          <div className="max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {isMobile && <SidebarTrigger />}
                <Button 
                  onClick={() => navigate('/projects')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Projects</span>
                </Button>
              </div>
            </div>

            <ProjectHeader 
              project={project} 
              client={client} 
              tasks={projectTasks}
              milestones={projectMilestones}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team Members</TabsTrigger>
                <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
                <TabsTrigger value="settings">Project Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <ProjectOverview 
                  project={project}
                  client={client}
                  tasks={projectTasks}
                  milestones={projectMilestones}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onEditTask={editTask}
                  onAddMilestone={addMilestone}
                  onUpdateMilestone={updateMilestone}
                  onUpdateProject={updateProject}
                />
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <ProjectTeamMembers 
                  project={project}
                  onUpdateProject={updateProject}
                />
              </TabsContent>

              <TabsContent value="budget" className="mt-6">
                <ProjectBudgetTracking 
                  project={project}
                  client={client}
                  tasks={projectTasks}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <ProjectSettings 
                  project={project}
                  onUpdateProject={updateProject}
                  onArchiveProject={archiveProject}
                  onDeleteProject={deleteProject}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Activity Sidebar - 30% */}
        <div className="w-[30%] border-l bg-white">
          <ProjectActivitySidebar 
            project={project}
            client={client}
            onAddTask={addTask}
            onAddMilestone={addMilestone}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
