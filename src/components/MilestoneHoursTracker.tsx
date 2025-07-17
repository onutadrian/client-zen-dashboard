import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target } from 'lucide-react';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { Milestone } from '@/hooks/useMilestones';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import EditTimeEntryModal from './EditTimeEntryModal';
import DeleteTimeEntryDialog from './DeleteTimeEntryDialog';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MilestoneHoursTrackerProps {
  milestones: Milestone[];
  hourEntries: HourEntry[];
  onAddTimeEntry?: () => void;
}

const MilestoneHoursTracker = ({ milestones, hourEntries, onAddTimeEntry }: MilestoneHoursTrackerProps) => {
  const { isAdmin } = useAuth();
  const { refreshHourEntries } = useHourEntries();
  const [editingEntry, setEditingEntry] = useState<HourEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<HourEntry | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [showAllUnassigned, setShowAllUnassigned] = useState(false);

  const handleEditComplete = () => {
    setEditingEntry(null);
    refreshHourEntries();
  };

  const handleDeleteComplete = () => {
    setDeletingEntry(null);
    refreshHourEntries();
  };
  // Group hours by milestone - filter out entries with malformed milestone data
  const validHourEntries = hourEntries.filter(entry => {
    // Filter out entries with malformed milestone IDs (objects instead of strings/null)
    if (entry.milestoneId && typeof entry.milestoneId === 'object') {
      return false;
    }
    return true;
  });

  const hoursByMilestone = validHourEntries.reduce((acc, entry) => {
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Hours by Milestone ({validHourEntries.length} entries)
            </CardTitle>
            {onAddTimeEntry && (
              <Button onClick={onAddTimeEntry} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            )}
          </div>
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
                    <p className="text-sm font-medium text-slate-700">Time Entries:</p>
                    {(expandedMilestones.has(milestone.id) ? milestoneHours : milestoneHours.slice(0, 5)).map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{entry.description || 'Time entry'}</p>
                          <p className="text-slate-500">{formatDate(entry.date)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-medium">{entry.hours}h</p>
                            <p className={`text-xs ${entry.billed ? 'text-green-600' : 'text-orange-600'}`}>
                              {entry.billed ? 'Billed' : 'Unbilled'}
                            </p>
                          </div>
                          {isAdmin && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingEntry(entry)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingEntry(entry)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {milestoneHours.length > 5 && !expandedMilestones.has(milestone.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedMilestones(prev => new Set([...prev, milestone.id]))}
                        className="w-full text-xs text-slate-500 hover:text-slate-700"
                      >
                        Load {milestoneHours.length - 5} more entries
                      </Button>
                    )}
                    {expandedMilestones.has(milestone.id) && milestoneHours.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedMilestones(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(milestone.id);
                          return newSet;
                        })}
                        className="w-full text-xs text-slate-500 hover:text-slate-700"
                      >
                        Show less
                      </Button>
                    )}
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
                {(showAllUnassigned ? unassignedHours : unassignedHours.slice(0, 5)).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{entry.description || 'Time entry'}</p>
                      <p className="text-slate-500">{formatDate(entry.date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-medium">{entry.hours}h</p>
                        <p className={`text-xs ${entry.billed ? 'text-green-600' : 'text-orange-600'}`}>
                          {entry.billed ? 'Billed' : 'Unbilled'}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingEntry(entry)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingEntry(entry)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {unassignedHours.length > 5 && !showAllUnassigned && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllUnassigned(true)}
                    className="w-full text-xs text-orange-600 hover:text-orange-700 mt-1"
                  >
                    Load {unassignedHours.length - 5} more entries
                  </Button>
                )}
                {showAllUnassigned && unassignedHours.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllUnassigned(false)}
                    className="w-full text-xs text-orange-600 hover:text-orange-700 mt-1"
                  >
                    Show less
                  </Button>
                )}
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
      
      {editingEntry && (
        <EditTimeEntryModal
          isOpen={true}
          onClose={handleEditComplete}
          timeEntry={editingEntry}
        />
      )}

      {deletingEntry && (
        <DeleteTimeEntryDialog
          isOpen={true}
          onClose={handleDeleteComplete}
          timeEntry={deletingEntry}
        />
      )}
    </>
  );
};

export default MilestoneHoursTracker;