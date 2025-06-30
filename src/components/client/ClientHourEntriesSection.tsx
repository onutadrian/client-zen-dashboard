
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';
import { HourEntry } from '@/types/hourEntry';

interface ClientHourEntriesSectionProps {
  hourEntries: HourEntry[];
  billedHours: number;
  unbilledHours: number;
  onToggleBilledStatus: (entryId: number) => void;
}

const ClientHourEntriesSection = ({
  hourEntries,
  billedHours,
  unbilledHours,
  onToggleBilledStatus
}: ClientHourEntriesSectionProps) => {
  if (hourEntries.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium text-slate-700 mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Logged Hours ({hourEntries.length} entries) - {billedHours}h billed, {unbilledHours}h unbilled
      </h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {hourEntries.map(entry => (
          <div key={entry.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div>
              <div className="font-medium text-slate-800">{entry.hours} hours</div>
              <div className="text-sm text-slate-600">{new Date(entry.date).toLocaleDateString()}</div>
              {entry.description && <div className="text-sm text-slate-500 mt-1">{entry.description}</div>}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">
                  {entry.billed ? 'Billed' : 'Unbilled'}
                </span>
                <Switch 
                  checked={entry.billed || false} 
                  onCheckedChange={() => onToggleBilledStatus(entry.id)} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientHourEntriesSection;
