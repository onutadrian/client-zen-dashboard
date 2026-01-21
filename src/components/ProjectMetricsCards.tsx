
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/currency';

interface ProjectMetricsCardsProps {
  isFixedPrice: boolean;
  hasMilestones: boolean;
  totalHours: number;
  billedHours: number;
  unbilledHours: number;
  paidInvoicedRevenue: number;
  valueFromBilledHours: number;
  unbilledRevenue: number;
  totalMilestoneValue?: number;
  completedMilestoneValue?: number;
  fixedProjectValue?: number;
  fixedBilledRevenue?: number;
  fixedUnbilledRevenue?: number;
  displayCurrency: string;
  demoMode?: boolean;
}

const ProjectMetricsCards = ({
  isFixedPrice,
  hasMilestones,
  totalHours,
  billedHours,
  unbilledHours,
  paidInvoicedRevenue,
  valueFromBilledHours,
  unbilledRevenue,
  totalMilestoneValue = 0,
  completedMilestoneValue = 0,
  fixedProjectValue = 0,
  fixedBilledRevenue = 0,
  fixedUnbilledRevenue = 0,
  displayCurrency,
  demoMode = false
}: ProjectMetricsCardsProps) => {
  
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

  // Calculate percentages for fixed price projects
  const billedPercentage = fixedProjectValue > 0 ? (fixedBilledRevenue / fixedProjectValue) * 100 : 0;

  // FIXED PRICE PROJECTS: Simple billed/unbilled revenue view
  if (isFixedPrice) {
    return (
      <TooltipProvider>
        <>
          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-foreground text-4xl font-normal cursor-help">
                  {formatMetric(fixedProjectValue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(fixedProjectValue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[24px] text-base">Project Value</p>
          </div>

          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-foreground text-4xl font-normal">
                    {formatMetric(fixedBilledRevenue, true)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {demoMode ? '—' : `${billedPercentage.toFixed(0)}%`}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(fixedBilledRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[16px] text-base">Billed Revenue</p>
          </div>

          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-foreground text-4xl font-normal">
                    {formatMetric(fixedUnbilledRevenue, true)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {demoMode ? '—' : `${(100 - billedPercentage).toFixed(0)}%`}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(fixedUnbilledRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[16px] text-base">Unbilled Revenue</p>
          </div>

          {totalHours > 0 && (
            <div className="flex-1 text-center p-4 rounded-lg bg-muted">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-foreground text-4xl font-normal cursor-help">
                    {totalHours >= 1000 ? `${(totalHours / 1000).toFixed(1)}K` : totalHours.toFixed(1)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{totalHours.toFixed(2)} hours logged</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-muted-foreground py-[24px] text-base">Hours Logged</p>
            </div>
          )}
        </>
      </TooltipProvider>
    );
  }

  // HOURLY/DAILY PROJECTS WITH MILESTONES: Show milestone-based tracking
  if (hasMilestones && totalMilestoneValue > 0) {
    return (
      <TooltipProvider>
        <>
          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-foreground text-4xl font-normal cursor-help">
                  {formatMetric(unbilledRevenue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(unbilledRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[24px] text-base">Unbilled Revenue</p>
          </div>

          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-foreground text-4xl font-normal cursor-help">
                  {formatMetric(totalMilestoneValue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(totalMilestoneValue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[24px] text-base">Total Value</p>
          </div>

          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-foreground text-4xl font-normal cursor-help">
                  {formatMetric(completedMilestoneValue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(completedMilestoneValue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[24px] text-base">Earned Value</p>
          </div>

          <div className="flex-1 text-center p-4 rounded-lg bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-foreground text-4xl font-normal cursor-help">
                  {formatMetric(paidInvoicedRevenue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(paidInvoicedRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground py-[24px] text-base">Paid Invoices</p>
          </div>
        </>
      </TooltipProvider>
    );
  }

  // TIME & MATERIALS (HOURLY/DAILY WITHOUT MILESTONES): Simple hours + revenue tracking
  return (
    <TooltipProvider>
      <>
        <div className="flex-1 text-center p-4 rounded-lg bg-muted">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-foreground text-4xl font-normal cursor-help">
                {totalHours >= 1000 ? `${(totalHours / 1000).toFixed(1)}K` : totalHours.toFixed(2)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{totalHours.toFixed(2)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground py-[24px] text-base">Total Hours</p>
        </div>

        <div className="flex-1 text-center p-4 rounded-lg bg-muted">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-foreground font-normal text-4xl cursor-help">
                {formatMetric(valueFromBilledHours, true)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{demoMode ? '—' : formatCurrency(valueFromBilledHours, displayCurrency)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground py-[24px] text-base">Billed Revenue</p>
        </div>

        <div className="flex-1 text-center p-4 rounded-lg bg-muted">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-foreground font-normal text-4xl cursor-help">
                {formatMetric(unbilledRevenue, true)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{demoMode ? '—' : formatCurrency(unbilledRevenue, displayCurrency)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground py-[24px] text-base">Unbilled Revenue</p>
        </div>

        <div className="flex-1 text-center p-4 rounded-lg bg-muted">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-foreground font-normal text-4xl cursor-help">
                {formatMetric(paidInvoicedRevenue, true)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{demoMode ? '—' : formatCurrency(paidInvoicedRevenue, displayCurrency)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground py-[24px] text-base">Paid Invoices</p>
        </div>
      </>
    </TooltipProvider>
  );
};

export default ProjectMetricsCards;
