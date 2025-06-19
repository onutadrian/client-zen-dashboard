
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import ProjectMetricsCards from './ProjectMetricsCards';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { Milestone } from '@/hooks/useMilestones';
import { useHourEntries } from '@/hooks/useHourEntries';
import { useInvoices } from '@/hooks/useInvoices';
import { useCurrency } from '@/hooks/useCurrency';
import { convertCurrency, formatCurrency } from '@/lib/currency';

interface ProjectBilledHoursProps {
  project: Project;
  client?: Client;
  milestones: Milestone[];
}

const ProjectBilledHours = ({ project, client, milestones }: ProjectBilledHoursProps) => {
  const { hourEntries } = useHourEntries();
  const { invoices } = useInvoices();
  const { displayCurrency } = useCurrency();
  
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);
  const projectInvoices = invoices.filter(invoice => invoice.projectId === project.id);
  
  // Calculate time metrics
  const totalHours = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = projectHours.filter(entry => entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = projectHours.filter(entry => !entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate revenue from invoices with currency conversion
  const billedRevenue = projectInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => {
      const convertedAmount = convertCurrency(invoice.amount, invoice.currency, displayCurrency);
      return sum + convertedAmount;
    }, 0);
  
  // Calculate unbilled revenue based on project pricing and unbilled hours with currency conversion
  let unbilledRevenue = 0;
  if (project.pricingType === 'hourly' && project.hourlyRate) {
    const convertedRate = convertCurrency(project.hourlyRate, project.currency, displayCurrency);
    unbilledRevenue = unbilledHours * convertedRate;
  } else if (project.pricingType === 'daily' && project.dailyRate) {
    const convertedRate = convertCurrency(project.dailyRate, project.currency, displayCurrency);
    unbilledRevenue = unbilledHours * convertedRate;
  }
  
  // For fixed price projects, calculate milestone values with currency conversion
  const totalMilestoneValue = milestones.reduce((sum, m) => {
    const amount = m.amount || 0;
    const convertedAmount = convertCurrency(amount, project.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  
  const completedMilestoneValue = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => {
      const amount = m.amount || 0;
      const convertedAmount = convertCurrency(amount, project.currency, displayCurrency);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProjectMetricsCards
            isFixedPrice={isFixedPrice}
            totalHours={totalHours}
            billedHours={billedHours}
            unbilledHours={unbilledHours}
            billedRevenue={billedRevenue}
            unbilledRevenue={unbilledRevenue}
            totalMilestoneValue={totalMilestoneValue}
            completedMilestoneValue={completedMilestoneValue}
            displayCurrency={displayCurrency}
          />
        </div>
        
        {unbilledHours > 0 && !isFixedPrice && (
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
