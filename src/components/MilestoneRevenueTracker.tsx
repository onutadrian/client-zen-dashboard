
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, DollarSign, Clock } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';

interface MilestoneRevenueTrackerProps {
  milestones: Milestone[];
  projectId: string;
}

const MilestoneRevenueTracker = ({ milestones, projectId }: MilestoneRevenueTrackerProps) => {
  const { invoices } = useInvoices();
  
  const projectInvoices = invoices.filter(i => i.projectId === projectId);
  
  // Calculate revenue metrics
  const totalProjectValue = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const completedValue = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.amount || 0), 0);
  
  const paidAmount = projectInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const pendingAmount = projectInvoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const completionPercentage = totalProjectValue > 0 ? (completedValue / totalProjectValue) * 100 : 0;
  const paymentPercentage = totalProjectValue > 0 ? (paidAmount / totalProjectValue) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Milestone Revenue Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-800">Project Value</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">${totalProjectValue.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-800">Paid Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-900">${paidAmount.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-yellow-50">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-yellow-600 mr-1" />
              <span className="text-sm font-medium text-yellow-800">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">${pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Work Completion</span>
              <span>{completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Payment Collection</span>
              <span>{paymentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
          </div>
        </div>

        {pendingAmount > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>${pendingAmount.toLocaleString()}</strong> in pending invoices ready for collection
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneRevenueTracker;
