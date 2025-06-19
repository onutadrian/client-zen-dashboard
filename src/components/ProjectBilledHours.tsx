
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';
import ProjectMetricsCards from './ProjectMetricsCards';
import ProjectProgressBars from './ProjectProgressBars';
import RecentTimeEntries from './RecentTimeEntries';

interface ProjectBilledHoursProps {
  project: Project;
  client?: Client;
  milestones?: Milestone[];
}

const ProjectBilledHours = ({ project, client, milestones = [] }: ProjectBilledHoursProps) => {
  const { hourEntries } = useHourEntries();
  const { invoices } = useInvoices();
  
  console.log('ProjectBilledHours - Project ID:', project.id);
  console.log('ProjectBilledHours - All hour entries:', hourEntries);
  console.log('ProjectBilledHours - Project:', project);
  
  const isFixedPrice = project.pricingType === 'fixed';
  
  // Filter data for this project
  const projectHours = hourEntries.filter(entry => {
    console.log('Comparing entry.projectId:', entry.projectId, 'with project.id:', project.id);
    return entry.projectId === project.id;
  });
  
  console.log('ProjectBilledHours - Filtered project hours:', projectHours);
  
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);

  // Calculate hour-based metrics
  const totalHours = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = projectHours
    .filter(entry => entry.billed)
    .reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = totalHours - billedHours;
  
  console.log('ProjectBilledHours - Calculated hours:', { totalHours, billedHours, unbilledHours });
  
  // Calculate milestone-based metrics
  const totalMilestoneValue = projectMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const completedMilestoneValue = projectMilestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.amount || 0), 0);
  const paidInvoiceAmount = projectInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingInvoiceAmount = projectInvoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  
  // Calculate rates and revenue - fix the rate calculation logic
  const getProjectRate = () => {
    // Use project's hourlyRate if available, otherwise fallback to 0
    return project.hourlyRate || 0;
  };
  
  const projectRate = getProjectRate();
  const hourlyRevenue = billedHours * projectRate;
  
  // Calculate progress percentages for fixed price projects
  const completionPercentage = totalMilestoneValue > 0 ? (completedMilestoneValue / totalMilestoneValue) * 100 : 0;
  const paymentPercentage = totalMilestoneValue > 0 ? (paidInvoiceAmount / totalMilestoneValue) * 100 : 0;

  // Determine what to show based on project type
  const showMilestoneTracking = isFixedPrice && projectMilestones.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {showMilestoneTracking ? 'Project Progress & Revenue' : 'Project Hours'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ProjectMetricsCards
            isFixedPrice={isFixedPrice}
            totalHours={totalHours}
            billedHours={billedHours}
            unbilledHours={unbilledHours}
            hourlyRevenue={hourlyRevenue}
            pendingInvoiceAmount={pendingInvoiceAmount}
            totalMilestoneValue={totalMilestoneValue}
            completedMilestoneValue={completedMilestoneValue}
            paidInvoiceAmount={paidInvoiceAmount}
          />
        </div>

        {/* Progress bars for fixed price projects */}
        {showMilestoneTracking && (
          <ProjectProgressBars
            completionPercentage={completionPercentage}
            paymentPercentage={paymentPercentage}
          />
        )}

        <RecentTimeEntries hourEntries={projectHours} />
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
