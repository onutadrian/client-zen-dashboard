
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BudgetMetrics {
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  budgetProgress: number;
  revenueEarned: number;
  revenueProgress: number;
}

interface ProjectProgressTrackingProps {
  budgetMetrics: BudgetMetrics;
  averageCompletion: number;
}

const ProjectProgressTracking = ({ budgetMetrics, averageCompletion }: ProjectProgressTrackingProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress vs Revenue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Milestone Completion</span>
            <span className="text-sm text-slate-600">{averageCompletion.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(averageCompletion, 100)} className="h-3" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Revenue Progress</span>
            <span className="text-sm text-slate-600">{budgetMetrics.revenueProgress.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(budgetMetrics.revenueProgress, 100)} className="h-3" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Budget Usage</span>
            <span className={`text-sm ${budgetMetrics.budgetProgress > 100 ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
              {budgetMetrics.budgetProgress.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.min(budgetMetrics.budgetProgress, 100)} 
            className={`h-3 ${budgetMetrics.budgetProgress > 100 ? '[&>div]:bg-red-500' : ''}`} 
          />
          {budgetMetrics.budgetProgress > 100 && (
            <div className="mt-1">
              <span className="text-xs text-red-600">
                Over budget by {(budgetMetrics.budgetProgress - 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {budgetMetrics.budgetProgress > averageCompletion + 15 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Budget usage is significantly ahead of milestone completion. Review project scope or budget allocation.
            </p>
          </div>
        )}

        {budgetMetrics.revenueProgress < averageCompletion - 20 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Consider invoicing for completed milestones to improve cash flow.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectProgressTracking;
