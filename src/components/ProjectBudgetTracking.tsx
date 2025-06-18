
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Task } from '@/hooks/useTasks';

interface ProjectBudgetTrackingProps {
  project: Project;
  client?: any;
  tasks: Task[];
}

const ProjectBudgetTracking = ({ project, client, tasks }: ProjectBudgetTrackingProps) => {
  const hourlyRate = client?.price || 0;
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  
  const estimatedBudget = totalEstimatedHours * hourlyRate;
  const actualCost = totalActualHours * hourlyRate;
  const remainingBudget = estimatedBudget - actualCost;
  const budgetProgress = estimatedBudget > 0 ? (actualCost / estimatedBudget) * 100 : 0;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const projectProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              ${estimatedBudget.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Estimated Budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              ${actualCost.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Actual Cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              ${remainingBudget.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Remaining Budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${budgetProgress > 90 ? 'text-red-600' : 'text-yellow-600'}`} />
            <p className={`text-2xl font-bold ${budgetProgress > 90 ? 'text-red-600' : 'text-yellow-600'}`}>
              {budgetProgress.toFixed(1)}%
            </p>
            <p className="text-sm text-slate-600">Budget Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Budget Usage</span>
              <span className="text-sm text-slate-600">{budgetProgress.toFixed(1)}%</span>
            </div>
            <Progress value={budgetProgress} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm text-slate-600">{projectProgress.toFixed(1)}%</span>
            </div>
            <Progress value={projectProgress} className="h-3" />
          </div>

          {budgetProgress > projectProgress + 10 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Budget usage is ahead of project progress. Consider reviewing scope or budget allocation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hours Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Hours Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Estimated Hours</span>
              <span className="font-bold">{totalEstimatedHours}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Actual Hours</span>
              <span className="font-bold">{totalActualHours}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Hourly Rate</span>
              <span className="font-bold">${hourlyRate}/hr</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Task Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-slate-600">
                      {task.actualHours || 0}h / {task.estimatedHours || 0}h estimated
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${((task.actualHours || 0) * hourlyRate).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">
                      Est: ${((task.estimatedHours || 0) * hourlyRate).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No tasks to analyze</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBudgetTracking;
