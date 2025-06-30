
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/types/auth';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { useUserProjectAssignments } from '@/hooks/useUserProjectAssignments';
import { useCurrency } from '@/hooks/useCurrency';
import { Loader2, User, Briefcase, Users } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  projects: Project[];
  clients?: Client[];
}

const EditUserModal = ({ isOpen, onClose, user, projects, clients = [] }: EditUserModalProps) => {
  const { assignments, loading, assignUserToProject, removeUserFromProject, getUserAssignments } = useUserProjectAssignments();
  const { demoMode } = useCurrency();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      const userAssignments = getUserAssignments(user.id);
      const assignedProjectIds = userAssignments.map(a => a.project_id);
      setSelectedProjects(assignedProjectIds);
      
      // Determine which clients are accessible based on assigned projects
      const assignedClientIds = projects
        .filter(p => assignedProjectIds.includes(p.id))
        .map(p => p.clientId);
      setSelectedClients([...new Set(assignedClientIds)]);
    }
  }, [user, assignments, isOpen, projects]);

  const handleProjectToggle = async (projectId: string, isChecked: boolean) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      if (isChecked) {
        await assignUserToProject(user.id, projectId);
        setSelectedProjects(prev => [...prev, projectId]);
      } else {
        await removeUserFromProject(user.id, projectId);
        setSelectedProjects(prev => prev.filter(id => id !== projectId));
      }
      
      // Update selected clients based on new project selection
      const newSelectedProjects = isChecked 
        ? [...selectedProjects, projectId]
        : selectedProjects.filter(id => id !== projectId);
      
      const newSelectedClientIds = projects
        .filter(p => newSelectedProjects.includes(p.id))
        .map(p => p.clientId);
      setSelectedClients([...new Set(newSelectedClientIds)]);
    } catch (error) {
      console.error('Error toggling project assignment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getAvailableProjects = () => {
    return projects.filter(project => selectedClients.includes(project.clientId));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Edit User: {user.full_name || (demoMode ? 'Demo User' : user.email)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium">{user.full_name || 'No name'}</h3>
              <p className="text-sm text-slate-600">{demoMode ? '—' : user.email}</p>
              <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Access Management for Standard Users */}
          {user.role === 'standard' && (
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="clients">Client Access ({selectedClients.length})</TabsTrigger>
                <TabsTrigger value="projects">Project Access ({selectedProjects.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="mt-4">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium">Client Access</h3>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div className="space-y-3">
                      {clients.map((client) => {
                        const hasAccess = selectedClients.includes(client.id);
                        const relatedProjects = projects.filter(p => p.clientId === client.id);
                        
                        return (
                          <div key={client.id} className={`p-3 rounded border ${hasAccess ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-slate-500">
                                  {relatedProjects.length} project{relatedProjects.length !== 1 ? 's' : ''} available
                                </div>
                                {hasAccess && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Access granted via project assignments
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center">
                                <Checkbox
                                  checked={hasAccess}
                                  disabled={true}
                                  className="ml-2"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Client access is automatically granted when you assign projects to the user. 
                    Select projects in the "Project Access" tab to grant access to their associated clients.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-4">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium">Project Access</h3>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div className="space-y-3">
                      {projects.map((project) => {
                        const client = clients.find(c => c.id === project.clientId);
                        
                        return (
                          <div key={project.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded">
                            <Checkbox
                              id={`project-${project.id}`}
                              checked={selectedProjects.includes(project.id)}
                              onCheckedChange={(checked) => handleProjectToggle(project.id, checked as boolean)}
                              disabled={isUpdating}
                            />
                            <label
                              htmlFor={`project-${project.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-slate-500">
                                Client: {client?.name || 'Unknown'} | Status: {project.status}
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
                
                <div className="mt-4 text-sm text-slate-600">
                  Selected projects: {selectedProjects.length} of {projects.length}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {user.role === 'admin' && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-800">
                <strong>Admin users</strong> have access to all clients and projects automatically.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
