
import React from 'react';
import { HourEntry } from '@/hooks/useHourEntries';
import { formatDate } from '@/lib/utils';

interface RecentTimeEntriesProps {
  hourEntries: HourEntry[];
}

const RecentTimeEntries = ({ hourEntries }: RecentTimeEntriesProps) => {
  if (hourEntries.length === 0) {
    return (
      <div className="mt-6 text-center py-4">
        <p className="text-slate-500">No time entries found for this project</p>
        <p className="text-sm text-slate-400 mt-1">
          Time entries will appear here when hours are logged for this project
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-3">Recent Time Entries</h4>
      <div className="space-y-2">
        {hourEntries.slice(0, 5).map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-medium">{entry.description || 'Time entry'}</p>
              <p className="text-sm text-slate-600">
                {formatDate(entry.date)}
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
  );
};

export default RecentTimeEntries;
