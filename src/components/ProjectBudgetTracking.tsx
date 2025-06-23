import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import { Invoice, useInvoices } from '@/hooks/useInvoices';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';
import { useHourEntries } from '@/hooks/useHourEntries';

interface ProjectBudgetTrackingProps {
  project: Project;
  client?: any;
  tasks: Task[];
  milestones: Milestone[];
}

const ProjectBudgetTracking = ({ project, client, tasks, milestones }: ProjectBudgetTrackingProps) => {
  const { invoices } = useInvoices();
  const { hourEntries } = useHourEntries();
  const { displayCurrency, convert } = useCurrency();
  const isFixedPrice = project.pricingType === 'fixed';
  
  // Filter project-specific data
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);
  
  // Calculate total hours worked on this project
  const totalHoursWorked = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate milestone-based financials with currency conversion
  const totalMilestoneAmount = projectMilestones.reduce((sum, milestone) => {
    const amount = milestone.amount || 0;
    const convertedAmount = convert(amount, project.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const totalInvoiceAmount = projectInvoices.reduce((sum, invoice) => {
    const convertedAmount = convert(invoice.amount, invoice.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const paidInvoices = projectInvoices.filter(i => i.status === 'paid');
  const totalPaidAmount = paidInvoices.reduce((sum, invoice) => {
    const convertedAmount = convert(invoice.amount, invoice.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  // Calculate progress metrics
  const completedMilestones = projectMilestones.filter(m => m.status === 'completed').length;
  const milestoneProgress = projectMilestones.length > 0 ? (completedMilestones / projectMilestones.length) * 100 : 0;
  const averageCompletion = projectMilestones.length > 0 
    ? projectMilestones.reduce((sum, m) => sum + m.completionPercentage, 0) / projectMilestones.length 
    : 0;
  
  // Task-based metrics for context
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const totalActualHours = totalHoursWorked || tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  const hourlyRate = isFixedPrice ? (client?.price || 0) : (project.hourlyRate || 0);

  // Budget calculations based on project type with currency conversion
  let budgetMetrics;
  if (isFixedPrice) {
    const fixedBudget = convert(project.fixedPrice || totalMilestoneAmount, project.currency, displayCurrency);
    const costSoFar = totalActualHours * convert(hourlyRate, project.currency, displayCurrency);
    
    // Calculate budget progress - ensure we have a valid percentage
    let budgetProgress = 0;
    if (fixedBudget > 0) {
      budgetProgress = (costSoFar / fixedBudget) * 100;
    }
    
    budgetMetrics = {
      totalBudget: fixedBudget,
      spentAmount: costSoFar,
      remainingBudget: fixedBudget - costSoFar,
      budgetProgress: budgetProgress,
      revenueEarned: totalPaidAmount,
      revenueProgress: fixedBudget > 0 ? (totalPaidAmount / fixedBudget) * 100 : 0
    };
  } else {
    const estimatedBudget = (project.estimatedHours || totalEstimatedHours) * convert(hourlyRate, project.currency, displayCurrency);
    const actualCost = totalActualHours * convert(hourlyRate, project.currency, displayCurrency);
    
    // Calculate budget progress - ensure we have a valid percentage
    let budgetProgress = 0;
    if (estimatedBudget > 0) {
      budgetProgress = (actualCost / estimatedBudget) * 100;
    }
    
    budgetMetrics = {
      totalBudget: estimatedBudget,
      spentAmount: actualCost,
      remainingBudget: estimatedBudget - actualCost,
      budgetProgress: budgetProgress,
      revenueEarned: totalPaidAmount,
      revenueProgress: estimatedBudget > 0 ? (totalPaidAmount / estimatedBudget) * 100 : 0
    };
  }

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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Project Type Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isFixedPrice 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isFixedPrice ? 'Fixed Price Project' : 'Hourly Project'}
          </span>
          {isFixedPrice && (
            <span className="text-sm text-slate-600">
              Budget: {formatCurrency(budgetMetrics.totalBudget, displayCurrency)}
            </span>
          )}
          {!isFixedPrice && (
            <span className="text-sm text-slate-600">
              Rate: {formatCurrency(convert(project.hourlyRate || 0, project.currency, displayCurrency), displayCurrency)}/hr
            </span>
          )}
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-zinc-950 text-4xl font-normal cursor-help">
                  {formatMetric(budgetMetrics.totalBudget, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formatCurrency(budgetMetrics.totalBudget, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Total Budget</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className={`text-4xl font-normal cursor-help ${budgetMetrics.budgetProgress > 100 ? 'text-red-600' : 'text-zinc-950'}`}>
                  {budgetMetrics.budgetProgress.toFixed(1)}%
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{budgetMetrics.budgetProgress.toFixed(1)}% of budget used</p>
                {budgetMetrics.budgetProgress > 100 && (
                  <p className="text-red-600">Over budget by {(budgetMetrics.budgetProgress - 100).toFixed(1)}%</p>
                )}
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Budget Used</p>
          </div>
        </div>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Progress vs Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Milestone Completion</span>
                <span className="text-sm text-slate-600">{averageCompletion.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(averageCompletion, 100)} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Revenue Progress</span>
                <span className="text-sm text-slate-600">{budgetMetrics.revenueProgress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(budgetMetrics.revenueProgress, 100)} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Budget Usage</span>
                <span className={`text-sm ${budgetMetrics.budgetProgress > 100 ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
                  {budgetMetrics.budgetProgress.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={Math.min(budgetMetrics.budgetProgress, 100)} 
                className={`h-3 ${budgetMetrics.budgetProgress > 100 ? '[&>div]:bg-red-500' : ''}`} 
              />
              {budgetMetrics.budgetProgress > 100 && (
                <div className="mt-1">
                  <span className="text-xs text-red-600">
                    Over budget by {(budgetMetrics.budgetProgress - 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {budgetMetrics.budgetProgress > averageCompletion + 15 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Budget usage is significantly ahead of milestone completion. Review project scope or budget allocation.
                </p>
              </div>
            )}

            {budgetMetrics.revenueProgress < averageCompletion - 20 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Consider invoicing for completed milestones to improve cash flow.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestone Financial Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Financial Status</CardTitle>
          </CardHeader>
          <CardContent>
            {projectMilestones.length > 0 ? (
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
            ) : (
              <p className="text-slate-500 text-center py-4">No milestones to analyze</p>
            )}
          </CardContent>
        </Card>

        {/* Hours vs Revenue Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Time Investment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Total Hours Worked</span>
                <span className="font-bold">{totalActualHours}h</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Effective Hourly Rate</span>
                <span className="font-bold">
                  {formatCurrency(totalActualHours > 0 ? (budgetMetrics.revenueEarned / totalActualHours) : 0, displayCurrency)}/hr
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Revenue per Hour</span>
                <span className="font-bold">
                  {formatCurrency(totalActualHours > 0 ? (totalInvoiceAmount / totalActualHours) : 0, displayCurrency)}/hr
                </span>
              </div>
              {isFixedPrice && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Target Hourly Rate</span>
                  <span className="font-bold">
                    {formatCurrency(totalEstimatedHours > 0 ? (budgetMetrics.totalBudget / totalEstimatedHours) : 0, displayCurrency)}/hr
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ProjectBudgetTracking;