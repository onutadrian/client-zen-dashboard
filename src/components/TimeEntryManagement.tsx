import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Clock } from 'lucide-react';
import EditTimeEntryModal from './EditTimeEntryModal';
import DeleteTimeEntryDialog from './DeleteTimeEntryDialog';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { formatDate } from '@/lib/utils';

interface TimeEntryManagementProps {
  projectId: string;
  onAddTimeEntry?: () => void;
}

const TimeEntryManagement = ({ projectId, onAddTimeEntry }: TimeEntryManagementProps) => {
  const { hourEntries, refreshHourEntries } = useHourEntries();
  const [editingEntry, setEditingEntry] = useState<HourEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<HourEntry | null>(null);

  // Filter entries for this project
  const projectEntries = hourEntries.filter(entry => entry.projectId === projectId);

  const handleEditComplete = () => {
    setEditingEntry(null);
    refreshHourEntries();
  };

  const handleDeleteComplete = () => {
    setDeletingEntry(null);
    refreshHourEntries();
  };

  if (projectEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Time Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No time entries logged yet</p>
            {onAddTimeEntry && (
              <Button onClick={onAddTimeEntry} variant="outline">
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Time Entries ({projectEntries.length})
            </CardTitle>
            {onAddTimeEntry && (
              <Button onClick={onAddTimeEntry} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{formatDate(entry.date)}</span>
                      <span className="text-sm text-slate-500">
                        {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                      </span>
                      {entry.billed && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Billed
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{entry.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingEntry(entry)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingEntry(entry)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            {projectEntries.length > 10 && (
              <p className="text-sm text-slate-500 text-center mt-2">
                +{projectEntries.length - 10} more entries
              </p>
            )}
          </div>
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

export default TimeEntryManagement;