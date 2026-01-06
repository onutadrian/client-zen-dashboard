
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/hooks/useProjects';
import { Milestone } from '@/hooks/useMilestones';
import { Invoice } from '@/hooks/useInvoices';
import { formatCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/useCurrency';

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
  const { demoMode } = useCurrency();

  // Format numbers: remove decimals and convert 1000+ to K format
  const formatMetric = (value: number, isCurrency = false) => {
    if (demoMode && isCurrency) {
      return '—';
    }

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

  // Calculate total paid invoices for the project
  const totalPaidInvoices = demoMode ? 0 : projectInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + convert(inv.amount || 0, inv.currency || project.currency, displayCurrency), 0);

  const totalPendingInvoices = demoMode ? 0 : projectInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + convert(inv.amount || 0, inv.currency || project.currency, displayCurrency), 0);

  // Sort milestones by target date to process in order
  const sortedMilestones = [...projectMilestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  // Calculate cumulative milestone amounts and determine payment status
  let cumulativeMilestoneAmount = 0;
  const milestonesWithStatus = sortedMilestones.map((milestone) => {
    const milestoneAmount = demoMode ? 0 : convert(milestone.amount || 0, project.currency, displayCurrency);
    cumulativeMilestoneAmount += milestoneAmount;
    
    // Determine invoice status based on cumulative amounts
    let invoiceStatus: 'paid' | 'pending' | 'unpaid';
    if (totalPaidInvoices >= cumulativeMilestoneAmount) {
      invoiceStatus = 'paid';
    } else if (totalPaidInvoices + totalPendingInvoices >= cumulativeMilestoneAmount) {
      invoiceStatus = 'pending';
    } else {
      invoiceStatus = 'unpaid';
    }
    
    return { milestone, milestoneAmount, invoiceStatus };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone Financial Status</CardTitle>
      </CardHeader>
      <CardContent>
        {projectMilestones.length > 0 ? (
          <TooltipProvider>
            <div className="space-y-3">
              {milestonesWithStatus.map(({ milestone, milestoneAmount, invoiceStatus }) => (
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
                        {demoMode ? '—' : `${milestone.completionPercentage}%`} complete
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
                        <p>{demoMode ? '—' : formatCurrency(milestoneAmount, displayCurrency)}</p>
                      </TooltipContent>
                    </Tooltip>
                    <p className={`text-sm ${
                      invoiceStatus === 'paid' ? 'text-green-600' :
                      invoiceStatus === 'pending' ? 'text-yellow-600' :
                      'text-slate-600'
                    }`}>
                      {demoMode ? '—' : (
                        invoiceStatus === 'paid' ? 'Paid' :
                        invoiceStatus === 'pending' ? 'Invoiced' :
                        'Not Invoiced'
                      )}
                    </p>
                  </div>
                </div>
              ))}
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
