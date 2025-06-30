
import React from 'react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';
import { useCurrency } from '@/hooks/useCurrency';
import { useHourEntries } from '@/hooks/useHourEntries';
import ProjectBudgetOverview from './project-budget/ProjectBudgetOverview';
import ProjectProgressTracking from './project-budget/ProjectProgressTracking';
import ProjectMilestoneFinancials from './project-budget/ProjectMilestoneFinancials';
import ProjectTimeInvestmentAnalysis from './project-budget/ProjectTimeInvestmentAnalysis';

interface ProjectBudgetTrackingProps {
  project: Project;
  client?: any;
  tasks: Task[];
  milestones: Milestone[];
}

const ProjectBudgetTracking = ({ project, client, tasks, milestones }: ProjectBudgetTrackingProps) => {
  const { invoices } = useInvoices();
  const { hourEntries } = useHourEntries();
  const { displayCurrency, convert, demoMode } = useCurrency();
  
  // Don't render the component at all in demo mode
  if (demoMode) {
    return null;
  }
  
  const isFixedPrice = project.pricingType === 'fixed';
  
  // Filter project-specific data
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);
  
  // Calculate total hours worked on this project
  const totalHoursWorked = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate milestone-based financials with currency conversion
  const totalMilestoneAmount = projectMilestones.reduce((sum, milestone) => {
    const amount = milestone.amount || 0;
    const convertedAmount = convert(amount, project.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const totalInvoiceAmount = projectInvoices.reduce((sum, invoice) => {
    const convertedAmount = convert(invoice.amount, invoice.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const paidInvoices = projectInvoices.filter(i => i.status === 'paid');
  const totalPaidAmount = paidInvoices.reduce((sum, invoice) => {
    const convertedAmount = convert(invoice.amount, invoice.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  // Calculate progress metrics
  const completedMilestones = projectMilestones.filter(m => m.status === 'completed').length;
  const milestoneProgress = projectMilestones.length > 0 ? (completedMilestones / projectMilestones.length) * 100 : 0;
  const averageCompletion = projectMilestones.length > 0 
    ? projectMilestones.reduce((sum, m) => sum + m.completionPercentage, 0) / projectMilestones.length 
    : 0;
  
  // Task-based metrics for context
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const totalActualHours = totalHoursWorked || tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  const hourlyRate = isFixedPrice ? (client?.price || 0) : (project.hourlyRate || 0);

  // Budget calculations based on project type with currency conversion
  let budgetMetrics;
  if (isFixedPrice) {
    const fixedBudget = convert(project.fixedPrice || totalMilestoneAmount, project.currency, displayCurrency);
    const costSoFar = totalActualHours * convert(hourlyRate, project.currency, displayCurrency);
    
    // Calculate budget progress - ensure we have a valid percentage
    let budgetProgress = 0;
    if (fixedBudget > 0) {
      budgetProgress = (costSoFar / fixedBudget) * 100;
    }
    
    budgetMetrics = {
      totalBudget: fixedBudget,
      spentAmount: costSoFar,
      remainingBudget: fixedBudget - costSoFar,
      budgetProgress: budgetProgress,
      revenueEarned: totalPaidAmount,
      revenueProgress: fixedBudget > 0 ? (totalPaidAmount / fixedBudget) * 100 : 0
    };
  } else {
    const estimatedBudget = (project.estimatedHours || totalEstimatedHours) * convert(hourlyRate, project.currency, displayCurrency);
    const actualCost = totalActualHours * convert(hourlyRate, project.currency, displayCurrency);
    
    // Calculate budget progress - ensure we have a valid percentage
    let budgetProgress = 0;
    if (estimatedBudget > 0) {
      budgetProgress = (actualCost / estimatedBudget) * 100;
    }
    
    budgetMetrics = {
      totalBudget: estimatedBudget,
      spentAmount: actualCost,
      remainingBudget: estimatedBudget - actualCost,
      budgetProgress: budgetProgress,
      revenueEarned: totalPaidAmount,
      revenueProgress: estimatedBudget > 0 ? (totalPaidAmount / estimatedBudget) * 100 : 0
    };
  }

  return (
    <div className="space-y-6">
      <ProjectBudgetOverview 
        project={project}
        budgetMetrics={budgetMetrics}
        displayCurrency={displayCurrency}
      />

      <ProjectProgressTracking 
        budgetMetrics={budgetMetrics}
        averageCompletion={averageCompletion}
      />

      <ProjectMilestoneFinancials 
        project={project}
        projectMilestones={projectMilestones}
        projectInvoices={projectInvoices}
        displayCurrency={displayCurrency}
        convert={convert}
      />

      <ProjectTimeInvestmentAnalysis 
        project={project}
        tasks={tasks}
        totalActualHours={totalActualHours}
        totalInvoiceAmount={totalInvoiceAmount}
        budgetMetrics={budgetMetrics}
        displayCurrency={displayCurrency}
        convert={convert}
        client={client}
      />
    </div>
  );
};

export default ProjectBudgetTracking;
