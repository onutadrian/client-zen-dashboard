
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Trash2, Plus } from 'lucide-react';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { formatDate } from '@/lib/utils';
import EditTimeEntryModal from './EditTimeEntryModal';
import DeleteTimeEntryDialog from './DeleteTimeEntryDialog';

interface TimeEntryManagementProps {
  hourEntries: HourEntry[];
  onAddTimeEntry?: () => void;
}

const TimeEntryManagement = ({ hourEntries, onAddTimeEntry }: TimeEntryManagementProps) => {
  const [editingEntry, setEditingEntry] = useState<HourEntry | null>(null);
  const [deletingEntry, setDeleteingEntry] = useState<HourEntry | null>(null);

  const sortedEntries = [...hourEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (hourEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Time Entries
            </div>
            {onAddTimeEntry && (
              <Button
                onClick={onAddTimeEntry}
                size="sm"
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-500 mb-4">No time entries logged yet</p>
            {onAddTimeEntry && (
              <Button
                onClick={onAddTimeEntry}
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log First Entry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Time Entries ({hourEntries.length})
            </div>
            {onAddTimeEntry && (
              <Button
                onClick={onAddTimeEntry}
                size="sm"
                className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">
                        {formatDate(entry.date)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        entry.billed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {entry.billed ? 'Billed' : 'Unbilled'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEntry(entry)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteingEntry(entry)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {entry.description && (
                    <div className="text-sm text-slate-500 mt-1">
                      {entry.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingEntry && (
        <EditTimeEntryModal
          isOpen={true}
          onClose={() => setEditingEntry(null)}
          timeEntry={editingEntry}
        />
      )}

      {deletingEntry && (
        <DeleteTimeEntryDialog
          isOpen={true}
          onClose={() => setDeleteingEntry(null)}
          timeEntry={deletingEntry}
        />
      )}
    </>
  );
};

export default TimeEntryManagement;
