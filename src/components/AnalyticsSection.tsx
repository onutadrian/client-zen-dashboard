
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AnalyticsSection = ({
  totalClients,
  activeClients,
  totalHours,
  totalRevenue,
  monthlySubscriptionCost,
  clients,
  displayCurrency,
  convertCurrency,
  formatCurrency
}) => {
  // Mock trend data for 30-day comparison (in a real app, this would come from historical data)
  const getTrendData = (metric: string) => {
    const trends = {
      'Total Clients': { change: 15, isIncrease: true },
      'Total Time': { change: 23, isIncrease: true },
      'Total Revenue': { change: 8, isIncrease: true },
      'Monthly Costs': { change: 12, isIncrease: false }, // decrease is good for costs
      'Net Profit': { change: 18, isIncrease: true }
    };
    return trends[metric] || { change: 0, isIncrease: true };
  };

  // Calculate time breakdown by client and type
  const getTimeBreakdownByClient = () => {
    return clients.map(client => {
      const totalHours = client.hourEntries?.reduce((sum, entry) => sum + entry.hours, 0) || 0;

      // Convert hours to appropriate unit based on client's price type
      let displayValue = totalHours;
      let unit = 'hrs';
      if (client.priceType === 'day') {
        displayValue = Math.round(totalHours / 8 * 10) / 10; // 8 hours = 1 day
        unit = 'days';
      } else if (client.priceType === 'week') {
        displayValue = Math.round(totalHours / 40 * 10) / 10; // 40 hours = 1 week
        unit = 'weeks';
      } else if (client.priceType === 'month') {
        displayValue = Math.round(totalHours / 160 * 10) / 10; // 160 hours = 1 month
        unit = 'months';
      }
      return {
        name: client.name,
        value: displayValue,
        unit: unit,
        hasTime: totalHours > 0
      };
    }).filter(client => client.hasTime);
  };

  // Calculate revenue breakdown by client with currency conversion
  const getRevenueBreakdownByClient = () => {
    return clients.map(client => {
      const paidAmount = client.invoices?.reduce((sum, invoice) => {
        if (invoice.status === 'paid') {
          const convertedAmount = convertCurrency(invoice.amount, client.currency || 'USD', displayCurrency);
          return sum + convertedAmount;
        }
        return sum;
      }, 0) || 0;
      return {
        name: client.name,
        value: paidAmount,
        hasRevenue: paidAmount > 0
      };
    }).filter(client => client.hasRevenue);
  };

  const timeBreakdown = getTimeBreakdownByClient();
  const revenueBreakdown = getRevenueBreakdownByClient();
  const netProfitAnnual = totalRevenue - monthlySubscriptionCost * 12;
  const inactiveClients = totalClients - activeClients;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

  // Get client status rows with proper formatting
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
      subtitle: "tracked hours",
      statusRows: getClientStatusRows(),
      details: clients.map(client => client.name)
    },
    {
      title: "Total Time",
      value: totalHours,
      subtitle: "tracked hours",
      statusRows: [],
      details: timeBreakdown
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue, displayCurrency),
      subtitle: "earned this period",
      statusRows: [],
      details: revenueBreakdown
    },
    {
      title: "Monthly Costs",
      value: formatCurrency(monthlySubscriptionCost, displayCurrency),
      subtitle: "subscription expenses",
      statusRows: [],
      details: null
    },
    {
      title: "Net Profit",
      value: formatCurrency(netProfitAnnual, displayCurrency),
      subtitle: "annual estimate",
      statusRows: [],
      details: revenueBreakdown
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const trend = getTrendData(stat.title);
        const TrendIcon = trend.isIncrease ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200" style={{ width: '14.4375rem' }}>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              {/* Section 1: Top content */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 
                    className="font-satoshi font-normal"
                    style={{
                      color: 'var(--Dark-color, #081735)',
                      fontSize: '1.375rem',
                      lineHeight: '1.5rem'
                    }}
                  >
                    {stat.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`text-xs px-2 py-1 flex items-center space-x-1 ${
                        trend.isIncrease 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }`}
                    >
                      <TrendIcon className="w-3 h-3" />
                      <span>{trend.change}%</span>
                    </Badge>
                    <span className="text-xs text-slate-500">vs prev 30d</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {stat.statusRows.map((statusRow, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{statusRow}</span>
                      {stat.details && stat.details.length > 0 && rowIndex === 0 && (
                        <span className="text-xs text-slate-600 truncate max-w-20">
                          {stat.title === "Total Clients" && stat.details[0]}
                          {stat.title === "Total Time" && stat.details[0]?.name}
                          {(stat.title === "Total Revenue" || stat.title === "Net Profit") && stat.details[0]?.name}
                        </span>
                      )}
                    </div>
                  ))}
                  {stat.statusRows.length === 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{stat.subtitle}</span>
                      {stat.details && stat.details.length > 0 && (
                        <span className="text-xs text-slate-600 truncate max-w-20">
                          {stat.title === "Total Clients" && stat.details[0]}
                          {stat.title === "Total Time" && stat.details[0]?.name}
                          {(stat.title === "Total Revenue" || stat.title === "Net Profit") && stat.details[0]?.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Bottom metric */}
              <div className="mt-4">
                <p 
                  className="font-satoshi font-normal"
                  style={{
                    color: 'var(--Dark-color, #081735)',
                    fontSize: '3rem',
                    lineHeight: '2.5rem'
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsSection;
