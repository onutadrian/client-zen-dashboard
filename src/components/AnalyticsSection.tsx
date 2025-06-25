
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import PeriodFilter, { PeriodOption } from '@/components/PeriodFilter';

interface AnalyticsSectionProps {
  totalClients: number;
  activeClients: number;
  totalHours: number;
  totalRevenue: number;
  monthlySubscriptionCost: number;
  totalPaidToDate: number;
  clients: any[];
  displayCurrency: string;
  formatCurrency: (amount: number, currency: string) => string;
  timeBreakdown?: any[];
  revenueBreakdown?: any[];
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const AnalyticsSection = ({
  totalClients,
  activeClients,
  totalHours,
  totalRevenue,
  monthlySubscriptionCost,
  totalPaidToDate,
  clients,
  displayCurrency,
  formatCurrency,
  timeBreakdown = [],
  revenueBreakdown = [],
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange
}: AnalyticsSectionProps) => {
  const { convert } = useCurrency();
  
  // Format numbers: remove decimals and convert 1000+ to K format
  const formatMetric = (value, isCurrency = false, currency = '') => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    
    if (isNaN(numValue)) return value;
    
    const rounded = Math.round(numValue);
    
    if (rounded >= 1000) {
      const kValue = (rounded / 1000).toFixed(2).replace(/\.?0+$/, '');
      if (isCurrency) {
        return `${currency === 'RON' ? 'RON ' : (currency === 'EUR' ? '€' : '$')}${kValue}K`;
      }
      return `${kValue}K`;
    }
    
    if (isCurrency) {
      return `${currency === 'RON' ? 'RON ' : (currency === 'EUR' ? '€' : '$')}${rounded}`;
    }
    
    return rounded.toString();
  };

  const getOriginalValue = (value, isCurrency = false) => {
    if (isCurrency) {
      return value;
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    return Math.round(numValue).toString();
  };

  const getTrendData = (metric: string) => {
    const trends = {
      'Total Clients': { change: 15, isIncrease: true },
      'Total Time': { change: 23, isIncrease: true },
      'Total Revenue': { change: 8, isIncrease: true },
      'Monthly Costs': { change: 12, isIncrease: false },
      'Total Paid to Date': { change: 18, isIncrease: true },
      'Net Profit': { change: 18, isIncrease: true }
    };
    return trends[metric] || { change: 0, isIncrease: true };
  };

  const netProfitAnnual = totalRevenue - monthlySubscriptionCost * 12;
  const inactiveClients = totalClients - activeClients;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

  const getClientStatusRows = () => {
    const rows = [];
    if (activeClients > 0) {
      rows.push(`${activeClients} active`);
    }
    if (inactiveClients > 0) {
      rows.push(`${inactiveClients} inactive`);
    }
    if (pendingClients > 0) {
      rows.push(`${pendingClients} pending`);
    }
    return rows;
  };

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      originalValue: totalClients.toString(),
      isCurrency: false,
      subtitle: "client accounts",
      statusRows: getClientStatusRows(),
      details: clients.slice(0, 3).map(client => client.name)
    },
    {
      title: "Total Time",
      value: totalHours,
      originalValue: `${totalHours.toFixed(1)} hours`,
      isCurrency: false,
      subtitle: "tracked hours",
      statusRows: [],
      details: timeBreakdown.slice(0, 3)
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue, displayCurrency),
      originalValue: formatCurrency(totalRevenue, displayCurrency),
      isCurrency: true,
      subtitle: "from paid invoices",
      statusRows: [],
      details: revenueBreakdown.slice(0, 3)
    },
    {
      title: "Monthly Costs",
      value: formatCurrency(monthlySubscriptionCost, displayCurrency),
      originalValue: formatCurrency(monthlySubscriptionCost, displayCurrency),
      isCurrency: true,
      subtitle: "subscription expenses",
      statusRows: [],
      details: null
    },
    {
      title: "Total Paid to Date",
      value: formatCurrency(totalPaidToDate, displayCurrency),
      originalValue: formatCurrency(totalPaidToDate, displayCurrency),
      isCurrency: true,
      subtitle: "all subscriptions",
      statusRows: [],
      details: null
    },
    {
      title: "Net Profit",
      value: formatCurrency(netProfitAnnual, displayCurrency),
      originalValue: formatCurrency(netProfitAnnual, displayCurrency),
      isCurrency: true,
      subtitle: "annual estimate",
      statusRows: [],
      details: revenueBreakdown.slice(0, 3)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          customDateRange={customDateRange}
          onCustomDateChange={onCustomDateChange}
        />
      </div>

      {/* Metrics Grid */}
      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const trend = getTrendData(stat.title);
            const TrendIcon = trend.isIncrease ? TrendingUp : TrendingDown;
            const formattedValue = formatMetric(stat.value, stat.isCurrency, displayCurrency);
            const needsTooltip = typeof stat.value === 'number' ? stat.value >= 1000 : 
              (typeof stat.value === 'string' && parseFloat(stat.value.replace(/[^0-9.-]/g, '')) >= 1000);
            
            return (
              <Card key={index} className="hover:shadow-none transition-all duration-200 shadow-none w-full min-w-0">
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
                        <span className="text-xs text-slate-500 hidden sm:inline">vs prev 30d</span>
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
                    {needsTooltip ? (
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
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AnalyticsSection;
