
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { useUserProjectAssignments } from '@/hooks/useUserProjectAssignments';
import { useCurrency } from '@/hooks/useCurrency';
import UserInfoSection from './users/UserInfoSection';
import UserAccessTabs from './users/UserAccessTabs';

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
          <UserInfoSection user={user} />

          {/* Access Management for Standard Users */}
          {user.role === 'standard' && (
            <UserAccessTabs
              projects={projects}
              clients={clients}
              selectedProjects={selectedProjects}
              selectedClients={selectedClients}
              loading={loading}
              isUpdating={isUpdating}
              onProjectToggle={handleProjectToggle}
            />
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
