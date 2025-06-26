
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile } from '@/types/auth';
import { Project } from '@/hooks/useProjects';
import { useUserProjectAssignments } from '@/hooks/useUserProjectAssignments';
import { Loader2, User, Briefcase } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  projects: Project[];
}

const EditUserModal = ({ isOpen, onClose, user, projects }: EditUserModalProps) => {
  const { assignments, loading, assignUserToProject, removeUserFromProject, getUserAssignments } = useUserProjectAssignments();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      const userAssignments = getUserAssignments(user.id);
      setSelectedProjects(userAssignments.map(a => a.project_id));
    }
  }, [user, assignments, isOpen]);

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
    } catch (error) {
      console.error('Error toggling project assignment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Edit User: {user.full_name || user.email}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium">{user.full_name || 'No name'}</h3>
              <p className="text-sm text-slate-600">{user.email}</p>
              <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Project Assignments */}
          {user.role === 'standard' && (
            <div>
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
                    {projects.map((project) => (
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
                            Status: {project.status} | Client ID: {project.clientId}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <div className="mt-4 text-sm text-slate-600">
                Selected projects: {selectedProjects.length} of {projects.length}
              </div>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-800">
                <strong>Admin users</strong> have access to all projects and data automatically.
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
