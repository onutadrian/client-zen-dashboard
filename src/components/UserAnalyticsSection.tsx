
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PeriodFilter from '@/components/PeriodFilter';
import { CheckCircle, Clock, AlertCircle, BarChart3, Calendar, Target } from 'lucide-react';
import { Task } from '@/types/task';
import { Project } from '@/hooks/useProjects';
import { PeriodOption } from '@/hooks/usePeriodFilter';

interface UserAnalyticsSectionProps {
  tasks: Task[];
  projects: Project[];
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const UserAnalyticsSection = ({
  tasks,
  projects,
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange
}: UserAnalyticsSectionProps) => {
  // Calculate user-specific metrics
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;
  
  const totalHoursWorked = tasks.reduce((sum, task) => sum + (task.workedHours || 0), 0);
  const activeProjects = projects.filter(project => project.status === 'active').length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recent activity - last 7 days
  const recentTasks = tasks.filter(task => {
    if (!task.completedDate) return false;
    const completedDate = new Date(task.completedDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return completedDate >= sevenDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Your Productivity Overview</h2>
          <p className="text-sm text-slate-600">Track your personal progress and achievements</p>
        </div>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          customDateRange={customDateRange}
          onCustomDateChange={onCustomDateChange}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All your tasks
            </p>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        {/* Hours Worked */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalHoursWorked.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Total time tracked
            </p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Task Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Pending</span>
              </div>
              <Badge variant="outline">{pendingTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">  
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">In Progress</span>
              </div>
              <Badge variant="outline">{inProgressTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Completed</span>
              </div>
              <Badge variant="outline">{completedTasks}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600 mb-2">{recentTasks}</div>
              <p className="text-sm text-slate-600">Tasks completed in the last 7 days</p>
              {recentTasks > 0 && (
                <p className="text-xs text-green-600 mt-2">Great job staying productive! 🎉</p>
              )}
              {recentTasks === 0 && totalTasks > 0 && (
                <p className="text-xs text-slate-500 mt-2">Complete some tasks to see your progress here</p>
              )}
              {totalTasks === 0 && (
                <p className="text-xs text-slate-500 mt-2">Add your first task to get started!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalyticsSection;
