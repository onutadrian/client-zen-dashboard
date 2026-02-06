import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Calendar } from 'lucide-react';
import type { Project } from '@/hooks/useProjects';
import type { Task } from '@/types/task';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/currency';

interface ClientProjectSummaryProps {
  project: Project;
  tasks: Task[];
}

const ClientProjectSummary = ({ project, tasks }: ClientProjectSummaryProps) => {
  const { displayCurrency, convert } = useCurrency();
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const totalWorkedHours = completedTasks.reduce((sum, t) => sum + (t.workedHours || 0), 0);
  const urgentWorkedHours = completedTasks.reduce((sum, t) => sum + (t.urgent ? (t.workedHours || 0) : 0), 0);

  let billableTotal = 0;
  let dailyDays = 0;

  if (project.pricingType === 'hourly') {
    completedTasks.forEach(t => {
      const rate = t.urgent && project.urgentHourlyRate
        ? project.urgentHourlyRate
        : (project.hourlyRate || 0);
      const convertedRate = convert(rate, project.currency, displayCurrency);
      billableTotal += (t.workedHours || 0) * convertedRate;
    });
  }

  if (project.pricingType === 'daily' && project.dailyRate) {
    const dayKeys = new Set<string>();
    completedTasks.forEach(t => {
      const dateStr = t.completedDate || t.endDate || t.startDate || t.createdDate;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return;
      dayKeys.add(d.toISOString().slice(0, 10));
    });
    dailyDays = dayKeys.size;
    const convertedRate = convert(project.dailyRate, project.currency, displayCurrency);
    billableTotal = dailyDays * convertedRate;
  }

  const showFinancials = project.pricingType !== 'fixed';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hours Worked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkedHours.toFixed(1)}h</div>
          {urgentWorkedHours > 0 && (
            <div className="text-xs text-slate-600 mt-1">
              Urgent: {urgentWorkedHours.toFixed(1)}h
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Days Worked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{project.pricingType === 'daily' ? dailyDays : '—'}</div>
          <div className="text-xs text-slate-600 mt-1">
            {project.pricingType === 'daily' ? 'Daily billing based on completed tasks' : 'Not applicable'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Billable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showFinancials ? formatCurrency(billableTotal, displayCurrency) : '—'}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            {showFinancials ? 'Based on completed tasks' : 'Fixed-price project'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProjectSummary;

