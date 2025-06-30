
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Edit, Archive } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { formatCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/useCurrency';

interface Client {
  id: number;
  name: string;
}

interface ProjectCardProps {
  project: Project;
  clients: Client[];
  onEditProject: (e: React.MouseEvent, project: Project) => void;
}

const ProjectCard = ({ project, clients, onEditProject }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { demoMode } = useCurrency();

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPricingDisplay = (project: Project) => {
    if (demoMode) {
      return {
        type: project.pricingType === 'fixed' ? 'Fixed' : 'Hourly',
        amount: '—',
        color: project.pricingType === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      };
    }

    if (project.pricingType === 'fixed') {
      return {
        type: 'Fixed',
        amount: project.fixedPrice ? formatCurrency(project.fixedPrice, project.currency) : 'TBD',
        color: 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        type: 'Hourly',
        amount: project.hourlyRate ? `${formatCurrency(project.hourlyRate, project.currency)}/hr` : 'TBD',
        color: 'bg-green-100 text-green-800'
      };
    }
  };

  const getTotalInvoiced = (project: Project) => {
    if (demoMode) {
      return '—';
    }

    const totalPaid = project.invoices
      ?.filter(invoice => invoice.status === 'paid')
      ?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
    
    return formatCurrency(totalPaid, project.currency);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const pricingInfo = getPricingDisplay(project);
  const totalInvoiced = getTotalInvoiced(project);

  return (
    <Card 
      className={`relative cursor-pointer hover:shadow-md transition-shadow ${
        project.archived ? 'opacity-75 border-slate-300' : ''
      }`}
      onClick={() => handleProjectClick(project.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold mb-2">{project.name}</CardTitle>
              {project.archived && <Archive className="w-4 h-4 text-slate-500" />}
            </div>
            <p className="text-sm text-slate-600">{getClientName(project.clientId)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onEditProject(e, project)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.estimatedEndDate).toLocaleDateString()}</span>
          </div>
          
          {/* Pricing Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{pricingInfo.amount}</span>
            </div>
            <Badge className={pricingInfo.color} variant="secondary">
              {pricingInfo.type}
            </Badge>
          </div>

          {/* Invoice Information */}
          {project.invoices && project.invoices.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Invoiced:</span>
              <span className={`font-medium ${demoMode ? 'text-slate-600' : 'text-green-600'}`}>
                {totalInvoiced}
              </span>
            </div>
          )}

          {project.team && project.team.length > 0 && (
            <div className="flex items-center text-sm text-slate-600">
              <Users className="w-4 h-4 mr-2" />
              <span>{project.team.length} team member{project.team.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {project.notes && (
            <p className="text-sm text-slate-600 line-clamp-2">{project.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
