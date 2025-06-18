
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Mail, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectTeamMembersProps {
  project: Project;
  onUpdateProject: (projectId: string, updates: any) => void;
}

const ProjectTeamMembers = ({ project, onUpdateProject }: ProjectTeamMembersProps) => {
  const [newMember, setNewMember] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = () => {
    if (newMember.trim()) {
      const updatedTeam = [...(project.team || []), newMember.trim()];
      onUpdateProject(project.id, { ...project, team: updatedTeam });
      setNewMember('');
      setIsAdding(false);
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    const updatedTeam = (project.team || []).filter(member => member !== memberToRemove);
    onUpdateProject(project.id, { ...project, team: updatedTeam });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Members ({project.team?.length || 0})
            </CardTitle>
            <Button 
              onClick={() => setIsAdding(!isAdding)}
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Enter team member name or email"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Button onClick={handleAddMember} size="sm">
                Add
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          )}

          {project.team && project.team.length > 0 ? (
            <div className="space-y-3">
              {project.team.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-slate-600 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Team Member
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button
                      onClick={() => handleRemoveMember(member)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No team members yet</h3>
              <p className="text-slate-500 mb-4">Add team members to start collaborating on this project</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">No recent team activity</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTeamMembers;
