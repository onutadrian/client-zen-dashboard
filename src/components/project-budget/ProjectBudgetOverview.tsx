
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/hooks/useProjects';
import { formatCurrency } from '@/lib/currency';

interface BudgetMetrics {
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  budgetProgress: number;
  revenueEarned: number;
  revenueProgress: number;
}

interface ProjectBudgetOverviewProps {
  project: Project;
  budgetMetrics: BudgetMetrics;
  displayCurrency: string;
}

const ProjectBudgetOverview = ({ project, budgetMetrics, displayCurrency }: ProjectBudgetOverviewProps) => {
  const isFixedPrice = project.pricingType === 'fixed';

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
              Rate: {formatCurrency(project.hourlyRate || 0, displayCurrency)}/hr
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
      </div>
    </TooltipProvider>
  );
};

export default ProjectBudgetOverview;
