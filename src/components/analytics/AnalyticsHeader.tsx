
import React from 'react';
import PeriodFilter, { PeriodOption } from '@/components/PeriodFilter';

interface AnalyticsHeaderProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const AnalyticsHeader = ({
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange
}: AnalyticsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
        customDateRange={customDateRange}
        onCustomDateChange={onCustomDateChange}
      />
    </div>
  );
};

export default AnalyticsHeader;
