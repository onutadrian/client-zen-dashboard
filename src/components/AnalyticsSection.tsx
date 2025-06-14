
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Users, TrendingUp, CreditCard } from 'lucide-react';

const AnalyticsSection = ({ 
  totalClients, 
  activeClients, 
  totalHours, 
  totalRevenue, 
  monthlySubscriptionCost 
}) => {
  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      subtitle: `${activeClients} active`
    },
    {
      title: "Total Hours",
      value: totalHours,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      subtitle: "tracked"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: "earned"
    },
    {
      title: "Monthly Costs",
      value: `$${monthlySubscriptionCost.toFixed(2)}`,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-100",
      subtitle: "subscriptions"
    },
    {
      title: "Net Profit",
      value: `$${(totalRevenue - (monthlySubscriptionCost * 12)).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      subtitle: "annual estimate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsSection;
