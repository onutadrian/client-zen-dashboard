
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { formatCurrency } from '@/lib/currency';

interface BudgetMetrics {
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  budgetProgress: number;
  revenueEarned: number;
  revenueProgress: number;
}

interface ProjectTimeInvestmentAnalysisProps {
  project: Project;
  tasks: Task[];
  totalActualHours: number;
  totalInvoiceAmount: number;
  budgetMetrics: BudgetMetrics;
  displayCurrency: string;
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number;
  client?: any;
}

const ProjectTimeInvestmentAnalysis = ({ 
  project, 
  tasks, 
  totalActualHours, 
  totalInvoiceAmount, 
  budgetMetrics, 
  displayCurrency, 
  convert,
  client 
}: ProjectTimeInvestmentAnalysisProps) => {
  const isFixedPrice = project.pricingType === 'fixed';
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const hourlyRate = isFixedPrice ? (client?.price || 0) : (project.hourlyRate || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Investment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="font-medium">Total Hours Worked</span>
            <span className="font-bold">{totalActualHours}h</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="font-medium">Effective Hourly Rate</span>
            <span className="font-bold">
              {formatCurrency(totalActualHours > 0 ? (budgetMetrics.revenueEarned / totalActualHours) : 0, displayCurrency)}/hr
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="font-medium">Revenue per Hour</span>
            <span className="font-bold">
              {formatCurrency(totalActualHours > 0 ? (totalInvoiceAmount / totalActualHours) : 0, displayCurrency)}/hr
            </span>
          </div>
          {isFixedPrice && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Target Hourly Rate</span>
              <span className="font-bold">
                {formatCurrency(totalEstimatedHours > 0 ? (budgetMetrics.totalBudget / totalEstimatedHours) : 0, displayCurrency)}/hr
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeInvestmentAnalysis;
