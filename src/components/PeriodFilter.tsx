import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export type PeriodOption = 'all-time' | 'this-month' | 'last-month' | 'this-year' | 'last-year' | 'custom';

interface PeriodFilterProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handlePeriodChange = (value: string) => {
    onPeriodChange(value as PeriodOption);
    if (value !== 'custom') {
      setIsCalendarOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!customDateRange.from) return 'Select date range';
    
    const fromDate = format(customDateRange.from, 'MMM d, yyyy');
    
    if (!customDateRange.to) return `From ${fromDate}`;
    
    const toDate = format(customDateRange.to, 'MMM d, yyyy');
    return `${fromDate} - ${toDate}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Period</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedPeriod === 'custom' && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="min-w-[240px] justify-start text-left font-normal"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: customDateRange.from,
                to: customDateRange.to
              }}
              onSelect={(range) => {
                onCustomDateChange({
                  from: range?.from,
                  to: range?.to
                });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PeriodFilter;