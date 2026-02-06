
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, UserCheck, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';

interface ProjectTeamMembersProps {
  project: Project;
  client?: Client;
  onUpdateProject: (projectId: string, updates: any) => void;
}

interface TeamMember {
  name: string;
  title: string;
  notes: string;
}

const ProjectTeamMembers = ({
  project,
  client,
  onUpdateProject
}: ProjectTeamMembersProps) => {
  const [newMember, setNewMember] = useState({ name: '', title: '', notes: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Parse team members - support both old string[] format and new object format
  const parseTeamMembers = (): TeamMember[] => {
    if (!project.team || project.team.length === 0) return [];
    
    return project.team.map(member => {
      if (typeof member === 'string') {
        // Legacy format - just a name string
        return { name: member, title: '', notes: '' };
      }
      // New format - already an object
      return member as unknown as TeamMember;
    });
  };

  const teamMembers = parseTeamMembers();

  const handleAddMember = () => {
    if (newMember.name.trim()) {
      const updatedTeam = [...(project.team || []), JSON.stringify(newMember)];
      onUpdateProject(project.id, {
        ...project,
        team: updatedTeam
      });
      setNewMember({ name: '', title: '', notes: '' });
      setIsAdding(false);
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedTeam = (project.team || []).filter((_, i) => i !== index);
    onUpdateProject(project.id, {
      ...project,
      team: updatedTeam
    });
  };

  const getMemberData = (member: string | any): TeamMember => {
    if (typeof member === 'string') {
      try {
        const parsed = JSON.parse(member);
        return { name: parsed.name || member, title: parsed.title || '', notes: parsed.notes || '' };
      } catch {
        return { name: member, title: '', notes: '' };
      }
    }
    return member as TeamMember;
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
            <Button variant="primary" 
              onClick={() => setIsAdding(!isAdding)} 
              size="sm" 
             
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <Input
                    placeholder="Team member name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    placeholder="Job title (e.g., Developer)"
                    value={newMember.title}
                    onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Input
                  placeholder="Additional notes"
                  value={newMember.notes}
                  onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="primary" onClick={handleAddMember} size="sm">
                  Add Member
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {project.team && project.team.length > 0 ? (
            <div className="space-y-3">
              {project.team.map((member, index) => {
                const memberData = getMemberData(member);
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{memberData.name}</p>
                        {memberData.title && (
                          <p className="text-sm text-slate-600">{memberData.title}</p>
                        )}
                        {memberData.notes && (
                          <p className="text-xs text-slate-500 mt-1">{memberData.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="ui-pill ui-pill--success">Active</Badge>
                      <Button variant="danger" onClick={() => handleRemoveMember(index)} size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
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
