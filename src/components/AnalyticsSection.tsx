
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Users, TrendingUp, CreditCard } from 'lucide-react';

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
  // Calculate time breakdown by client and type
  const getTimeBreakdownByClient = () => {
    return clients.map(client => {
      const totalHours = client.hourEntries?.reduce((sum, entry) => sum + entry.hours, 0) || 0;
      
      // Convert hours to appropriate unit based on client's price type
      let displayValue = totalHours;
      let unit = 'hrs';
      
      if (client.priceType === 'day') {
        displayValue = Math.round((totalHours / 8) * 10) / 10; // 8 hours = 1 day
        unit = 'days';
      } else if (client.priceType === 'week') {
        displayValue = Math.round((totalHours / 40) * 10) / 10; // 40 hours = 1 week
        unit = 'weeks';
      } else if (client.priceType === 'month') {
        displayValue = Math.round((totalHours / 160) * 10) / 10; // 160 hours = 1 month
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
  const netProfitAnnual = totalRevenue - (monthlySubscriptionCost * 12);

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      subtitle: `${activeClients} active`,
      details: clients.map(client => client.name)
    },
    {
      title: "Total Time",
      value: totalHours,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      subtitle: "tracked",
      details: timeBreakdown
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue, displayCurrency),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: "earned",
      details: revenueBreakdown
    },
    {
      title: "Monthly Costs",
      value: formatCurrency(monthlySubscriptionCost, displayCurrency),
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-100",
      subtitle: "subscriptions",
      details: null
    },
    {
      title: "Net Profit",
      value: formatCurrency(netProfitAnnual, displayCurrency),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      subtitle: "annual estimate",
      details: revenueBreakdown
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 mb-2">{stat.subtitle}</p>
                  
                  {/* Details section */}
                  {stat.details && stat.details.length > 0 && (
                    <div className="space-y-1">
                      {stat.title === "Total Clients" && (
                        <div className="space-y-1">
                          {stat.details.slice(0, 3).map((clientName, idx) => (
                            <p key={idx} className="text-xs text-slate-600 truncate">
                              {clientName}
                            </p>
                          ))}
                          {stat.details.length > 3 && (
                            <p className="text-xs text-slate-500">
                              +{stat.details.length - 3} more
                            </p>
                          )}
                        </div>
                      )}
                      
                      {(stat.title === "Total Time") && (
                        <div className="space-y-1">
                          {stat.details.slice(0, 2).map((client, idx) => (
                            <p key={idx} className="text-xs text-slate-600 truncate">
                              {client.value} {client.unit} for {client.name}
                            </p>
                          ))}
                          {stat.details.length > 2 && (
                            <p className="text-xs text-slate-500">
                              +{stat.details.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                      
                      {(stat.title === "Total Revenue" || stat.title === "Net Profit") && (
                        <div className="space-y-1">
                          {stat.details.slice(0, 2).map((client, idx) => (
                            <p key={idx} className="text-xs text-slate-600 truncate">
                              {formatCurrency(client.value, displayCurrency)} from {client.name}
                            </p>
                          ))}
                          {stat.details.length > 2 && (
                            <p className="text-xs text-slate-500">
                              +{stat.details.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsSection;
