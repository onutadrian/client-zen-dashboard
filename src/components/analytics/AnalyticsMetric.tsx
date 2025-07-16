
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { formatMetric, formatHours, getTrendData } from './formatters';

interface AnalyticsMetricProps {
  stat: {
    title: string;
    value: any;
    originalValue: string;
    isCurrency: boolean;
    isTime: boolean;
    subtitle: string;
    statusRows: string[];
    details: any[] | null;
    currentValue?: number;
    previousValue?: number;
    comparisonText?: string;
  };
  displayCurrency: string;
}

const AnalyticsMetric = ({ stat, displayCurrency }: AnalyticsMetricProps) => {
  const { demoMode } = useCurrency();
  const trend = getTrendData(stat.title, stat.currentValue, stat.previousValue);
  const TrendIcon = trend.isIncrease ? TrendingUp : TrendingDown;
  
  // Use special formatting for time, regular formatting for others
  const formattedValue = stat.isTime 
    ? formatHours(stat.value)
    : formatMetric(stat.value, stat.isCurrency, displayCurrency, demoMode);
  
  const needsTooltip = !demoMode && !stat.isTime && typeof stat.value === 'number' ? stat.value >= 1000 : 
    (!demoMode && typeof stat.value === 'string' && parseFloat(stat.value.replace(/[^0-9.-]/g, '')) >= 1000);

  return (
    <Card className="hover:shadow-none transition-all duration-200 shadow-none w-full min-w-0">
      <CardContent className="p-4 lg:p-6 flex flex-col justify-between h-full min-h-[200px] lg:min-h-[231px]">
        {/* Section 1: Top content */}
        <div className="space-y-2 lg:space-y-3">
          <div className="space-y-1 lg:space-y-2">
            <h3 
              className="font-satoshi font-normal text-sm lg:text-lg xl:text-xl leading-tight"
              style={{
                color: 'var(--Dark-color, #081735)',
              }}
            >
              {stat.title}
            </h3>
            
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Badge 
                className={`text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 flex items-center space-x-1 ${
                  trend.isIncrease 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                <TrendIcon className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                <span className="text-xs">{trend.change}%</span>
              </Badge>
              <span className="text-xs text-slate-500 hidden sm:inline">{stat.comparisonText || "vs prev 30d"}</span>
            </div>
          </div>

          <div className="space-y-1">
            {stat.statusRows.map((statusRow, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 truncate">{statusRow}</span>
                {stat.details && stat.details.length > 0 && rowIndex === 0 && (
                  <span className="text-xs text-slate-600 truncate max-w-16 lg:max-w-20">
                    {typeof stat.details[0] === 'string' ? stat.details[0] : stat.details[0]?.name}
                  </span>
                )}
              </div>
            ))}
            {stat.statusRows.length === 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 truncate">{stat.subtitle}</span>
                {stat.details && stat.details.length > 0 && (
                  <span className="text-xs text-slate-600 truncate max-w-16 lg:max-w-20">
                    {typeof stat.details[0] === 'string' ? stat.details[0] : stat.details[0]?.name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Bottom metric */}
        <div className="mt-2 lg:mt-4">
          {needsTooltip && !stat.isTime ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p 
                  className="font-satoshi font-normal cursor-help text-xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight"
                  style={{
                    color: 'var(--Dark-color, #081735)',
                  }}
                >
                  {formattedValue}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stat.originalValue}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <p 
              className="font-satoshi font-normal text-xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight"
              style={{
                color: 'var(--Dark-color, #081735)',
              }}
            >
              {formattedValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsMetric;
