import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck } from 'lucide-react';
import type { Project } from '@/hooks/useProjects';

interface TeamMember {
  name: string;
  title: string;
  notes: string;
}

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

const ClientTeamMembers = ({ project }: { project: Project }) => {
  const team = project.team || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Members ({team.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.length > 0 ? (
            <div className="space-y-3">
              {team.map((member, index) => {
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
                    <Badge className="ui-pill ui-pill--success">Active</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No team members yet</h3>
              <p className="text-slate-500">Your project team will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientTeamMembers;
