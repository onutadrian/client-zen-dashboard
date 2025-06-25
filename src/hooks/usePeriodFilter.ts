
import { useState, useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';

export type PeriodOption = 'all-time' | 'this-month' | 'last-month' | 'this-year' | 'last-year' | 'custom';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const usePeriodFilter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('all-time');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const dateRange = useMemo(() => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'this-month':
        return {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        };
      case 'this-year':
        return {
          from: startOfYear(now),
          to: endOfYear(now)
        };
      case 'last-year':
        const lastYear = subYears(now, 1);
        return {
          from: startOfYear(lastYear),
          to: endOfYear(lastYear)
        };
      case 'custom':
        return customDateRange;
      default: // 'all-time'
        return { from: undefined, to: undefined };
    }
  }, [selectedPeriod, customDateRange]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    dateRange
  };
};
