
import React from 'react';

interface ProjectMetricsCardsProps {
  isFixedPrice: boolean;
  totalHours: number;
  billedHours: number;
  unbilledHours: number;
  hourlyRevenue: number;
  pendingInvoiceAmount: number;
  totalMilestoneValue: number;
  completedMilestoneValue: number;
  paidInvoiceAmount: number;
}

const ProjectMetricsCards = ({
  isFixedPrice,
  totalHours,
  billedHours,
  unbilledHours,
  hourlyRevenue,
  pendingInvoiceAmount,
  totalMilestoneValue,
  completedMilestoneValue,
  paidInvoiceAmount
}: ProjectMetricsCardsProps) => {
  const showMilestoneTracking = isFixedPrice && totalMilestoneValue > 0;

  if (showMilestoneTracking) {
    return (
      <>
        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            ${pendingInvoiceAmount.toLocaleString()}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Pending Revenue</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            ${totalMilestoneValue.toLocaleString()}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Total Value</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            ${completedMilestoneValue.toLocaleString()}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Earned Value</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50">
          <p className="text-zinc-950 text-4xl font-normal">
            ${paidInvoiceAmount.toLocaleString()}
          </p>
          <p className="text-slate-600 py-[24px] text-base">Paid Revenue</p>
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
          ${hourlyRevenue.toLocaleString()}
        </p>
        <p className="text-slate-600 py-[24px] text-base">Total Revenue</p>
      </div>
    </>
  );
};

export default ProjectMetricsCards;
