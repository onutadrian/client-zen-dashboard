
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/currency';

interface ProjectMetricsCardsProps {
  isFixedPrice: boolean;
  totalHours: number;
  billedHours: number;
  unbilledHours: number;
  paidInvoicedRevenue: number;
  valueFromBilledHours: number;
  unbilledRevenue: number;
  totalMilestoneValue?: number;
  completedMilestoneValue?: number;
  displayCurrency: string;
  demoMode?: boolean;
}

const ProjectMetricsCards = ({
  isFixedPrice,
  totalHours,
  billedHours,
  unbilledHours,
  paidInvoicedRevenue,
  valueFromBilledHours,
  unbilledRevenue,
  totalMilestoneValue = 0,
  completedMilestoneValue = 0,
  displayCurrency,
  demoMode = false
}: ProjectMetricsCardsProps) => {
  const showMilestoneTracking = isFixedPrice && totalMilestoneValue > 0;

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

  if (showMilestoneTracking) {
    return (
      <TooltipProvider>
        <>
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-zinc-950 text-4xl font-normal cursor-help">
                  {formatMetric(unbilledRevenue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(unbilledRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Unbilled Revenue</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-zinc-950 text-4xl font-normal cursor-help">
                  {formatMetric(totalMilestoneValue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(totalMilestoneValue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Total Value</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-zinc-950 text-4xl font-normal cursor-help">
                  {formatMetric(completedMilestoneValue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(completedMilestoneValue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Earned Value</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-zinc-950 text-4xl font-normal cursor-help">
                  {formatMetric(paidInvoicedRevenue, true)}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{demoMode ? '—' : formatCurrency(paidInvoicedRevenue, displayCurrency)}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-slate-600 py-[24px] text-base">Paid Invoices</p>
          </div>
        </>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <>
        <div className="text-center p-4 rounded-lg bg-slate-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-zinc-950 text-4xl font-normal cursor-help">
                {totalHours >= 1000 ? `${(totalHours / 1000).toFixed(1)}K` : totalHours.toFixed(2)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{totalHours.toFixed(2)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-slate-600 py-[24px] text-base">Total Hours</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-zinc-950 text-4xl font-normal cursor-help">
                {billedHours >= 1000 ? `${(billedHours / 1000).toFixed(1)}K` : billedHours.toFixed(2)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{billedHours.toFixed(2)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-slate-600 py-[24px] text-base">Billed Hours</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-zinc-950 text-4xl font-normal cursor-help">
                {unbilledHours >= 1000 ? `${(unbilledHours / 1000).toFixed(1)}K` : unbilledHours.toFixed(2)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{unbilledHours.toFixed(2)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-slate-600 py-[24px] text-base">Unbilled Hours</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-zinc-950 font-normal text-4xl cursor-help">
                {formatMetric(valueFromBilledHours, true)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{demoMode ? '—' : formatCurrency(valueFromBilledHours, displayCurrency)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-slate-600 py-[24px] text-base">Billed Revenue</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-zinc-950 font-normal text-4xl cursor-help">
                {formatMetric(unbilledRevenue, true)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{demoMode ? '—' : formatCurrency(unbilledRevenue, displayCurrency)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-slate-600 py-[24px] text-base">Unbilled Revenue</p>
        </div>
      </>
    </TooltipProvider>
  );
};

export default ProjectMetricsCards;
