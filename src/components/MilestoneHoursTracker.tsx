
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target } from 'lucide-react';
import { HourEntry } from '@/hooks/useHourEntries';
import { Milestone } from '@/hooks/useMilestones';
import { formatDate } from '@/lib/utils';

interface MilestoneHoursTrackerProps {
  milestones: Milestone[];
  hourEntries: HourEntry[];
}

const MilestoneHoursTracker = ({ milestones, hourEntries }: MilestoneHoursTrackerProps) => {
  // Group hours by milestone
  const hoursByMilestone = hourEntries.reduce((acc, entry) => {
    const milestoneId = entry.milestoneId || 'unassigned';
    if (!acc[milestoneId]) {
      acc[milestoneId] = [];
    }
    acc[milestoneId].push(entry);
    return acc;
  }, {} as Record<string, HourEntry[]>);

  const unassignedHours = hoursByMilestone['unassigned'] || [];
  const totalUnassignedHours = unassignedHours.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Hours by Milestone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assigned milestone hours */}
        {milestones.map((milestone) => {
          const milestoneHours = hoursByMilestone[milestone.id] || [];
          const totalHours = milestoneHours.reduce((sum, entry) => sum + entry.hours, 0);
          const billedHours = milestoneHours
            .filter(entry => entry.billed)
            .reduce((sum, entry) => sum + entry.hours, 0);
          
          if (milestoneHours.length === 0) return null;

          return (
            <div key={milestone.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{milestone.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                  milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-slate-900">{totalHours.toFixed(1)}</p>
                  <p className="text-sm text-slate-600">Total Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600">{billedHours.toFixed(1)}</p>
                  <p className="text-sm text-slate-600">Billed Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-600">{(totalHours - billedHours).toFixed(1)}</p>
                  <p className="text-sm text-slate-600">Unbilled Hours</p>
                </div>
              </div>

              {/* Progress bar showing milestone completion vs hours logged */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Milestone Progress</span>
                  <span>{milestone.completionPercentage}%</span>
                </div>
                <Progress value={milestone.completionPercentage} className="h-2" />
              </div>

              {/* Recent entries for this milestone */}
              {milestoneHours.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">Recent Time Entries:</p>
                  {milestoneHours.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                      <div>
                        <p className="font-medium">{entry.description || 'Time entry'}</p>
                        <p className="text-slate-500">{formatDate(entry.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.hours}h</p>
                        <p className={`text-xs ${entry.billed ? 'text-green-600' : 'text-orange-600'}`}>
                          {entry.billed ? 'Billed' : 'Unbilled'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unassigned hours */}
        {totalUnassignedHours > 0 && (
          <div className="border-2 border-dashed border-orange-200 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-orange-800">Unassigned Hours</h4>
              <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                {totalUnassignedHours.toFixed(1)} hours
              </span>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              These hours are not assigned to any milestone. Consider assigning them to track progress accurately.
            </p>
            
            <div className="space-y-1">
              {unassignedHours.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                  <div>
                    <p className="font-medium">{entry.description || 'Time entry'}</p>
                    <p className="text-slate-500">{formatDate(entry.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.hours}h</p>
                    <p className={`text-xs ${entry.billed ? 'text-green-600' : 'text-orange-600'}`}>
                      {entry.billed ? 'Billed' : 'Unbilled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {milestones.length === 0 && totalUnassignedHours === 0 && (
          <div className="text-center py-4 text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No time entries found for this project</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneHoursTracker;
