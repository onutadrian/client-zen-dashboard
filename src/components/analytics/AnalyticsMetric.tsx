
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
    <Card className="ui-analytics-card w-full min-w-0">
      <CardContent className="ui-analytics-content p-6">
        {/* Section 1: Top content */}
        <div className="space-y-2 lg:space-y-3">
          <div className="space-y-1 lg:space-y-2">
            <h3 className="ui-analytics-title">
              {stat.title}
            </h3>
            
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Badge
                className={`ui-pill ${trend.isIncrease ? 'ui-pill--success' : 'ui-pill--danger'} flex items-center gap-1`}
              >
                <TrendIcon className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                <span>{trend.change}%</span>
              </Badge>
              <span className="ui-analytics-meta hidden sm:inline">{stat.comparisonText || "vs prev 30d"}</span>
            </div>
          </div>

          <div className="space-y-1">
            {stat.statusRows.map((statusRow, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-between">
                <span className="ui-analytics-meta truncate">{statusRow}</span>
                {stat.details && stat.details.length > 0 && rowIndex === 0 && (
                  <span className="text-xs text-slate-600 truncate max-w-16 lg:max-w-20">
                    {typeof stat.details[0] === 'string' ? stat.details[0] : stat.details[0]?.name}
                  </span>
                )}
              </div>
            ))}
            {stat.statusRows.length === 0 && (
              <div className="flex items-center justify-between">
                <span className="ui-analytics-meta truncate">{stat.subtitle}</span>
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
                <p className="ui-analytics-value cursor-help">
                  {formattedValue}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stat.originalValue}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="ui-analytics-value">
              {formattedValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsMetric;
