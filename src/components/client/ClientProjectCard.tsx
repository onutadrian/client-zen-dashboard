import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import type { Project } from '@/hooks/useProjects';

interface ClientProjectCardProps {
  project: Project;
  clientName?: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'ui-pill ui-pill--success';
    case 'completed':
      return 'ui-pill ui-pill--info';
    case 'paused':
      return 'ui-pill ui-pill--warning';
    case 'canceled':
      return 'ui-pill ui-pill--danger';
    default:
      return 'ui-pill ui-pill--neutral';
  }
};

const ClientProjectCard = ({ project, clientName }: ClientProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/client/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">{project.name}</CardTitle>
            <p className="text-sm text-slate-600">{clientName || 'Your project'}</p>
          </div>
          <Badge className={statusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="ui-card-content space-y-2">
        <div className="flex items-center text-sm text-slate-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.estimatedEndDate).toLocaleDateString()}</span>
        </div>
        {project.team && project.team.length > 0 && (
          <div className="flex items-center text-sm text-slate-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{project.team.length} team member{project.team.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        {project.notes && (
          <p className="text-sm text-slate-600 line-clamp-2">{project.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientProjectCard;
