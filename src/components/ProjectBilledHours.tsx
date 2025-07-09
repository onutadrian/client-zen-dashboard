
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import ProjectMetricsCards from './ProjectMetricsCards';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import { Milestone } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';
import { useInvoices } from '@/hooks/useInvoices';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';

interface ProjectBilledHoursProps {
  project: Project;
  client?: Client;
  milestones: Milestone[];
}

const ProjectBilledHours = ({ project, client, milestones }: ProjectBilledHoursProps) => {
  const { hourEntries } = useHourEntries();
  const { invoices } = useInvoices();
  const { displayCurrency, convert, demoMode } = useCurrency();
  
  const projectHours = hourEntries.filter(entry => {
    // Filter by project ID and exclude entries with malformed milestone data
    if (entry.projectId !== project.id) return false;
    if (entry.milestoneId && typeof entry.milestoneId === 'object') return false;
    return true;
  });
  const projectInvoices = invoices.filter(invoice => invoice.projectId === project.id);
  
  // Calculate time metrics
  const totalHours = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = projectHours.filter(entry => entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = projectHours.filter(entry => !entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate paid invoiced revenue (from paid invoices) with currency conversion
  const paidInvoicedRevenue = demoMode ? 0 : projectInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => {
      const convertedAmount = convert(invoice.amount, invoice.currency, displayCurrency);
      return sum + convertedAmount;
    }, 0);
  
  // Calculate value of billed hours (this is the actual "Billed Revenue" for hourly/daily projects)
  let valueFromBilledHours = 0;
  if (!demoMode) {
    if (project.pricingType === 'hourly' && project.hourlyRate) {
      const convertedRate = convert(project.hourlyRate, project.currency, displayCurrency);
      valueFromBilledHours = billedHours * convertedRate;
    } else if (project.pricingType === 'daily' && project.dailyRate) {
      const convertedRate = convert(project.dailyRate, project.currency, displayCurrency);
      // Convert hours to days (assuming 8-hour workday)
      valueFromBilledHours = (billedHours / 8) * convertedRate;
    }
  }
  
  // Calculate unbilled revenue based on project pricing and unbilled hours with currency conversion
  let unbilledRevenue = 0;
  if (!demoMode) {
    if (project.pricingType === 'hourly' && project.hourlyRate) {
      const convertedRate = convert(project.hourlyRate, project.currency, displayCurrency);
      unbilledRevenue = unbilledHours * convertedRate;
    } else if (project.pricingType === 'daily' && project.dailyRate) {
      const convertedRate = convert(project.dailyRate, project.currency, displayCurrency);
      // Convert hours to days (assuming 8-hour workday)
      unbilledRevenue = (unbilledHours / 8) * convertedRate;
    }
  }
  
  // For fixed price projects, calculate milestone values with currency conversion
  const totalMilestoneValue = demoMode ? 0 : milestones.reduce((sum, m) => {
    const amount = m.amount || 0;
    const convertedAmount = convert(amount, project.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const completedMilestoneValue = demoMode ? 0 : milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => {
      const amount = m.amount || 0;
      const convertedAmount = convert(amount, project.currency, displayCurrency);
      return sum + convertedAmount;
    }, 0);

  const isFixedPrice = project.pricingType === 'fixed';

  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            {isFixedPrice ? 'Progress & Revenue Tracking' : 'Time & Revenue Tracking'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">No client associated with this project</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          {isFixedPrice ? 'Progress & Revenue Tracking' : 'Time & Revenue Tracking'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <ProjectMetricsCards
            isFixedPrice={isFixedPrice}
            totalHours={totalHours}
            billedHours={billedHours}
            unbilledHours={unbilledHours}
            paidInvoicedRevenue={paidInvoicedRevenue}
            valueFromBilledHours={valueFromBilledHours}
            unbilledRevenue={unbilledRevenue}
            totalMilestoneValue={totalMilestoneValue}
            completedMilestoneValue={completedMilestoneValue}
            displayCurrency={displayCurrency}
            demoMode={demoMode}
          />
        </div>
        
        {unbilledHours > 0 && !isFixedPrice && !demoMode && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              You have <strong>{unbilledHours.toFixed(2)} hours</strong> of unbilled work worth{' '}
              <strong>{formatCurrency(unbilledRevenue, displayCurrency)}</strong>. Consider creating an invoice.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
