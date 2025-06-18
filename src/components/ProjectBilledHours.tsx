
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, Target, TrendingUp } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/hooks/useClients';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { Milestone } from '@/hooks/useMilestones';
import { useInvoices } from '@/hooks/useInvoices';

interface ProjectBilledHoursProps {
  project: Project;
  client?: Client;
  milestones?: Milestone[];
}

const ProjectBilledHours = ({ project, client, milestones = [] }: ProjectBilledHoursProps) => {
  const { hourEntries } = useHourEntries();
  const { invoices } = useInvoices();
  
  const isFixedPrice = project.pricingType === 'fixed';
  
  // Filter data for this project
  const projectHours = hourEntries.filter(entry => entry.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);

  // Calculate hour-based metrics
  const totalHours = projectHours.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = projectHours
    .filter(entry => entry.billed)
    .reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = totalHours - billedHours;
  
  // Calculate milestone-based metrics
  const totalMilestoneValue = projectMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const completedMilestoneValue = projectMilestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.amount || 0), 0);
  const paidInvoiceAmount = projectInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  
  // Calculate rates and revenue
  const hourlyRate = client?.price || project.hourlyRate || 0;
  const hourlyRevenue = billedHours * hourlyRate;
  const pendingHourlyRevenue = unbilledHours * hourlyRate;

  // Determine what to show based on project type
  const showMilestoneTracking = isFixedPrice && projectMilestones.length > 0;
  const effectiveRate = totalHours > 0 ? paidInvoiceAmount / totalHours : 0;

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
          {showMilestoneTracking ? (
            <>
              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">{totalHours.toFixed(1)}</p>
                <p className="text-slate-600 py-[24px] text-base">Hours Worked</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">
                  ${totalMilestoneValue.toLocaleString()}
                </p>
                <p className="text-slate-600 py-[24px] text-base">Total Value</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">
                  ${completedMilestoneValue.toLocaleString()}
                </p>
                <p className="text-slate-600 py-[24px] text-base">Earned Value</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">
                  ${paidInvoiceAmount.toLocaleString()}
                </p>
                <p className="text-slate-600 py-[24px] text-base">Paid Revenue</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">{totalHours.toFixed(2)}</p>
                <p className="text-slate-600 py-[24px] text-base">Total Hours</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">{billedHours.toFixed(2)}</p>
                <p className="text-slate-600 py-[24px] text-base">Billed Hours</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 text-4xl font-normal">{unbilledHours.toFixed(2)}</p>
                <p className="text-slate-600 py-[24px] text-base">Unbilled Hours</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-50">
                <p className="text-zinc-950 font-normal text-4xl">
                  ${hourlyRevenue.toLocaleString()}
                </p>
                <p className="text-slate-600 py-[24px] text-base">Total Revenue</p>
              </div>
            </>
          )}
        </div>

        {/* Additional metrics for fixed price projects */}
        {showMilestoneTracking && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-900">Fixed Price Project Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Effective Rate: <span className="font-semibold">${effectiveRate.toFixed(2)}/hr</span></p>
              </div>
              <div>
                <p className="text-blue-700">Target Rate: <span className="font-semibold">${hourlyRate}/hr</span></p>
              </div>
            </div>
          </div>
        )}

        {projectHours.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Recent Time Entries</h4>
            <div className="space-y-2">
              {projectHours.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{entry.description || 'Time entry'}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.hours}h</p>
                    <p className="text-sm text-slate-600">
                      {entry.billed ? 'Billed' : 'Unbilled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projectHours.length === 0 && (
          <div className="mt-6 text-center py-4">
            <p className="text-slate-500">No time entries found for this project</p>
            <p className="text-sm text-slate-400 mt-1">
              Time entries will appear here when hours are logged for this project
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectBilledHours;
