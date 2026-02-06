import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProjectHeader from '@/components/ProjectHeader';
import ClientProjectSummary from '@/components/client/ClientProjectSummary';
import ClientTeamMembers from '@/components/client/ClientTeamMembers';
import TimelineSection from '@/components/dashboard/TimelineSection';
import TaskDetailsSheet from '@/components/TaskDetailsSheet';
import { useClientData } from '@/hooks/client/useClientData';
import { useAuth } from '@/hooks/useAuth';
import TaskManagementSection from '@/components/dashboard/TaskManagementSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClientProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const { client, projects, tasks, milestones, loading } = useClientData();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  if (role !== 'client') {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
            <p className="text-slate-600">This area is for clients only.</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectMilestones = milestones.filter(m => m.projectId === id);

  if (!project && !loading) {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Project not found</h1>
            <Button onClick={() => navigate('/client/projects')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate('/client/projects')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          {project && (
            <>
              <ProjectHeader project={project} client={client} tasks={projectTasks as any} milestones={projectMilestones as any} />

              <ClientProjectSummary project={project} tasks={projectTasks} />

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white border border-slate-200">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <TaskManagementSection
                      tasks={projectTasks}
                      clients={client ? [client] : []}
                      projects={[project]}
                      onTaskClick={(task) => setSelectedTask(task)}
                      selectedStatuses={[project.status as any]}
                      onStatusChange={() => {}}
                      readOnly
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    <TimelineSection
                      projects={[project] as any}
                      tasks={projectTasks as any}
                      milestones={projectMilestones as any}
                      clients={client ? [client] : []}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="team" className="mt-4 space-y-4">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <ClientTeamMembers project={project} />
                </TabsContent>
              </Tabs>

              <TaskDetailsSheet
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                projects={[project] as any}
              />
            </>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ClientProjectDetailsPage;
