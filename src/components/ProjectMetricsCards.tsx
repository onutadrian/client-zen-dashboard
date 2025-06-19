
import React from 'react';
import { formatCurrency } from '@/lib/currency';

interface ProjectMetricsCardsProps {
  isFixedPrice: boolean;
  totalHours: number;
  billedHours: number;
  unbilledHours: number;
  billedRevenue: number;
  unbilledRevenue: number;
  totalMilestoneValue?: number;
  completedMilestoneValue?: number;
  displayCurrency: string;
}

const ProjectMetricsCards = ({
  isFixedPrice,
  totalHours,
  billedHours,
  unbilledHours,
  billedRevenue,
  unbilledRevenue,
  totalMilestoneValue = 0,
  completedMilestoneValue = 0,
  displayCurrency
}: ProjectMetricsCardsProps) => {
  const showMilestoneTracking = isFixedPrice && totalMilestoneValue > 0;

  if (showMilestoneTracking) {
    return (
      <>
        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            {formatCurrency(unbilledRevenue, displayCurrency)}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Unbilled Revenue</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            {formatCurrency(totalMilestoneValue, displayCurrency)}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Total Value</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            {formatCurrency(completedMilestoneValue, displayCurrency)}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Earned Value</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            {formatCurrency(billedRevenue, displayCurrency)}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Billed Revenue</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center p-4 rounded-lg bg-slate-50">
        <p className="text-zinc-950 text-4xl font-normal">{totalHours.toFixed(2)}</p>
        <p className="text-slate-600 py-[24px] text-base">Total Hours</p>
      </div>

      <div className="text-center p-4 rounded-lg bg-slate-50">
        <p className="text-zinc-950 text-4xl font-normal">{billedHours.toFixed(2)}</p>
        <p className="text-slate-600 py-[24px] text-base">Billed Hours</p>
      </div>

      <div className="text-center p-4 rounded-lg bg-slate-50">
        <p className="text-zinc-950 text-4xl font-normal">{unbilledHours.toFixed(2)}</p>
        <p className="text-slate-600 py-[24px] text-base">Unbilled Hours</p>
      </div>

      <div className="text-center p-4 rounded-lg bg-slate-50">
        <p className="text-zinc-950 font-normal text-4xl">
          {formatCurrency(billedRevenue, displayCurrency)}
        </p>
        <p className="text-slate-600 py-[24px] text-base">Billed Revenue</p>
      </div>
    </>
  );
};

export default ProjectMetricsCards;
