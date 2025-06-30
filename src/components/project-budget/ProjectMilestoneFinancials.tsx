
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/hooks/useProjects';
import { Milestone } from '@/hooks/useMilestones';
import { Invoice } from '@/hooks/useInvoices';
import { formatCurrency } from '@/lib/currency';

interface ProjectMilestoneFinancialsProps {
  project: Project;
  projectMilestones: Milestone[];
  projectInvoices: Invoice[];
  displayCurrency: string;
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

const ProjectMilestoneFinancials = ({ 
  project, 
  projectMilestones, 
  projectInvoices, 
  displayCurrency, 
  convert 
}: ProjectMilestoneFinancialsProps) => {
  // Format numbers: remove decimals and convert 1000+ to K format
  const formatMetric = (value: number, isCurrency = false) => {
    const rounded = Math.round(value);
    
    if (rounded >= 1000) {
      const kValue = (rounded / 1000).toFixed(2).replace(/\.?0+$/, '');
      if (isCurrency) {
        return `${displayCurrency === 'RON' ? 'RON ' : (displayCurrency === 'EUR' ? '€' : '$')}${kValue}K`;
      }
      return `${kValue}K`;
    }
    
    if (isCurrency) {
      return `${displayCurrency === 'RON' ? 'RON ' : (displayCurrency === 'EUR' ? '€' : '$')}${rounded}`;
    }
    
    return rounded.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone Financial Status</CardTitle>
      </CardHeader>
      <CardContent>
        {projectMilestones.length > 0 ? (
          <TooltipProvider>
            <div className="space-y-3">
              {projectMilestones.map((milestone) => {
                // Check if there's an invoice for this milestone
                const milestoneInvoice = projectInvoices.find(inv => inv.milestoneId === milestone.id);
                const invoiceStatus = milestoneInvoice?.status || 'unpaid';
                const milestoneAmount = convert(milestone.amount || 0, project.currency, displayCurrency);
                
                return (
                  <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-slate-600">
                          Due: {new Date(milestone.targetDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          {milestone.completionPercentage}% complete
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="font-medium cursor-help">
                            {formatMetric(milestoneAmount, true)}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatCurrency(milestoneAmount, displayCurrency)}</p>
                        </TooltipContent>
                      </Tooltip>
                      <p className={`text-sm ${
                        invoiceStatus === 'paid' ? 'text-green-600' :
                        invoiceStatus === 'pending' ? 'text-yellow-600' :
                        'text-slate-600'
                      }`}>
                        {invoiceStatus === 'paid' ? 'Paid' :
                         invoiceStatus === 'pending' ? 'Invoiced' :
                         'Not Invoiced'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        ) : (
          <p className="text-slate-500 text-center py-4">No milestones to analyze</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMilestoneFinancials;
