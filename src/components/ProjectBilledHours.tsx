
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  const pendingInvoiceAmount = projectInvoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  
  // Calculate rates and revenue
  const hourlyRate = client?.price || project.hourlyRate || 0;
  const hourlyRevenue = billedHours * hourlyRate;
  const pendingHourlyRevenue = unbilledHours * hourlyRate;
  
  // Calculate progress percentages for fixed price projects
  const completionPercentage = totalMilestoneValue > 0 ? (completedMilestoneValue / totalMilestoneValue) * 100 : 0;
  const paymentPercentage = totalMilestoneValue > 0 ? (paidInvoiceAmount / totalMilestoneValue) * 100 : 0;

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
                <p className="text-zinc-950 text-4xl font-normal">
                  ${pendingInvoiceAmount.toLocaleString()}
                </p>
                <p className="text-slate-600 py-[24px] text-base">Pending Revenue</p>
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

        {/* Progress bars for fixed price projects */}
        {showMilestoneTracking && (
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Work Completion</span>
                <span>{completionPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Payment Collection</span>
                <span>{paymentPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={paymentPercentage} className="h-3" />
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
