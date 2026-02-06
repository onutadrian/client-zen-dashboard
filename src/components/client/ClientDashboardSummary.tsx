import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ListTodo, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import type { Task } from '@/types/task';
import { formatCurrency } from '@/lib/currency';

interface ClientDashboardSummaryProps {
  inProgressTasks: Task[];
  nextUpTasks: Task[];
  completedCount: number;
  totalWorkedHours: number;
  urgentWorkedHours: number;
  standardWorkedHours: number;
  dailyDaysTotal: number;
  billableTotal: number;
  urgentBillableTotal: number;
  standardBillableTotal: number;
  unbilledValue: number;
  displayCurrency: string;
  showFinancials: boolean;
}

const ClientDashboardSummary = ({
  inProgressTasks,
  nextUpTasks,
  completedCount,
  totalWorkedHours,
  urgentWorkedHours,
  standardWorkedHours,
  dailyDaysTotal,
  billableTotal,
  urgentBillableTotal,
  standardBillableTotal,
  unbilledValue,
  displayCurrency,
  showFinancials
}: ClientDashboardSummaryProps) => {
  const formattedUnbilledValue = showFinancials
    ? formatCurrency(unbilledValue, displayCurrency)
    : '—';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              In Progress
            </div>
            <div className="ui-analytics-value mt-2">{inProgressTasks.length}</div>
          </div>
          <div className="space-y-1 mt-auto">
            {inProgressTasks.slice(0, 3).map(task => (
              <div key={task.id} className="ui-analytics-meta truncate">
                {task.title}
              </div>
            ))}
            {inProgressTasks.length === 0 && (
              <div className="ui-analytics-meta">No active tasks</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Next Up
            </div>
            <div className="ui-analytics-value mt-2">{nextUpTasks.length}</div>
          </div>
          <div className="space-y-1 mt-auto">
            {nextUpTasks.slice(0, 3).map(task => (
              <div key={task.id} className="ui-analytics-meta truncate">
                {task.title}
              </div>
            ))}
            {nextUpTasks.length === 0 && (
              <div className="ui-analytics-meta">No pending tasks</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </div>
            <div className="ui-analytics-value mt-2">{completedCount}</div>
          </div>
          <div className="space-y-1 mt-auto">
            <div className="ui-analytics-meta">
              Total hours: {totalWorkedHours.toFixed(1)}h
            </div>
            {urgentWorkedHours > 0 && (
              <Badge className="ui-pill ui-pill--neutral">
                Urgent hours: {urgentWorkedHours.toFixed(1)}h
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Work Logged
            </div>
            <div className="ui-analytics-value mt-2">{totalWorkedHours.toFixed(1)}h</div>
          </div>
          <div className="space-y-1 mt-auto">
            <div className="ui-analytics-meta">
              {dailyDaysTotal > 0 ? `${dailyDaysTotal} day${dailyDaysTotal !== 1 ? 's' : ''} (daily projects)` : 'Hours from completed tasks'}
            </div>
            {showFinancials && (
              <div className="flex items-center gap-1 ui-analytics-meta">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(billableTotal, displayCurrency)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Unbilled Value
            </div>
            <div className="ui-analytics-value mt-2">{formattedUnbilledValue}</div>
          </div>
          <div className="space-y-1 mt-auto">
            <div className="ui-analytics-meta">
              {showFinancials ? 'From completed tasks' : 'Fixed price project'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Urgent Hours
            </div>
            <div className="ui-analytics-value mt-2">{urgentWorkedHours.toFixed(1)}h</div>
          </div>
          <div className="space-y-1 mt-auto">
            <div className="ui-analytics-meta">Completed urgent tasks</div>
            {showFinancials && (
              <div className="flex items-center gap-1 ui-analytics-meta">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(urgentBillableTotal, displayCurrency)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="ui-analytics-card">
        <CardContent className="ui-analytics-content">
          <div>
            <div className="ui-analytics-title flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Standard Hours
            </div>
            <div className="ui-analytics-value mt-2">{standardWorkedHours.toFixed(1)}h</div>
          </div>
          <div className="space-y-1 mt-auto">
            <div className="ui-analytics-meta">Completed non-urgent tasks</div>
            {showFinancials && (
              <div className="flex items-center gap-1 ui-analytics-meta">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(standardBillableTotal, displayCurrency)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboardSummary;
