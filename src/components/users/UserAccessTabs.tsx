
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import ClientAccessTab from './ClientAccessTab';
import ProjectAccessTab from './ProjectAccessTab';

interface UserAccessTabsProps {
  projects: Project[];
  clients: Client[];
  selectedProjects: string[];
  selectedClients: number[];
  loading: boolean;
  isUpdating: boolean;
  onProjectToggle: (projectId: string, isChecked: boolean) => void;
}

const UserAccessTabs = ({ 
  projects, 
  clients, 
  selectedProjects, 
  selectedClients, 
  loading, 
  isUpdating, 
  onProjectToggle 
}: UserAccessTabsProps) => {
  return (
    <Tabs defaultValue="clients" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="clients">Client Access ({selectedClients.length})</TabsTrigger>
        <TabsTrigger value="projects">Project Access ({selectedProjects.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="clients">
        <ClientAccessTab
          clients={clients}
          projects={projects}
          selectedClients={selectedClients}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectAccessTab
          projects={projects}
          clients={clients}
          selectedProjects={selectedProjects}
          loading={loading}
          isUpdating={isUpdating}
          onProjectToggle={onProjectToggle}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserAccessTabs;
