
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '@/components/ProjectHeader';
import ProjectOverview from '@/components/ProjectOverview';
import ProjectTeamMembers from '@/components/ProjectTeamMembers';
import ProjectBudgetTracking from '@/components/ProjectBudgetTracking';
import ProjectSettings from '@/components/ProjectSettings';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SupabaseProject = Tables<'projects'>;

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('overview');
  const [forceRefresh, setForceRefresh] = useState(0);
  const [supabaseProject, setSupabaseProject] = useState<SupabaseProject | null>(null);
  const { displayCurrency } = useCurrency();

  const { projects, updateProject, archiveProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { refreshHourEntries } = useHourEntries();
  const { tasks, addTask, updateTask, deleteTask, editTask } = useTasks(refreshHourEntries);
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones();

  const project = projects.find(p => p.id === id);
  const client = clients.find(c => c.id === project?.clientId);
  const projectTasks = tasks.filter(task => task.projectId === id);
  const projectMilestones = milestones.filter(milestone => milestone.projectId === id);

  // Fetch Supabase project for future use
  useEffect(() => {
    const fetchSupabaseProject = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setSupabaseProject(data);
      }
    };

    fetchSupabaseProject();
  }, [id]);

  // Hide budget tracking for fixed price projects
  const showBudgetTracking = project?.pricingType !== 'fixed';

  // Listen for currency changes to force refresh
  useEffect(() => {
    const handleCurrencyChange = () => {
      setForceRefresh(prev => prev + 1);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  // Redirect to overview if current tab is budget and it's hidden
  useEffect(() => {
    if (activeTab === 'budget' && !showBudgetTracking) {
      setActiveTab('overview');
    }
  }, [activeTab, showBudgetTracking]);

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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto">
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
          <TabsList className={`grid w-full ${showBudgetTracking ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            {showBudgetTracking && <TabsTrigger value="budget">Budget Tracking</TabsTrigger>}
            <TabsTrigger value="settings">Project Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ProjectOverview 
              key={`overview-${displayCurrency}-${forceRefresh}`}
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
              onDeleteMilestone={deleteMilestone}
              onUpdateProject={updateProject}
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <ProjectTeamMembers 
              project={project}
              client={client}
              onUpdateProject={updateProject}
            />
          </TabsContent>

          {showBudgetTracking && (
            <TabsContent value="budget" className="mt-6">
              <ProjectBudgetTracking 
                key={`budget-${displayCurrency}-${forceRefresh}`}
                project={project}
                client={client}
                tasks={projectTasks}
                milestones={projectMilestones}
              />
            </TabsContent>
          )}

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
  );
};

export default ProjectDetailsPage;
