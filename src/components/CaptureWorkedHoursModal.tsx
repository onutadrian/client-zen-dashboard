
import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskTimeLog } from '@/types/task';

interface Task {
  id: number;
  title: string;
  clientName: string;
  timeLogs?: TaskTimeLog[];
}

interface CaptureWorkedHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onComplete: (workedHours: number) => void;
}

const CaptureWorkedHoursModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onComplete 
}: CaptureWorkedHoursModalProps) => {
  const [workedHours, setWorkedHours] = useState<number>(1);
  const sortedTimeLogs = useMemo(
    () =>
      (task?.timeLogs || [])
        .slice()
        .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()),
    [task?.timeLogs]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workedHours > 0) {
      onComplete(workedHours);
      setWorkedHours(1);
      onClose();
    }
  };

  const handleClose = () => {
    setWorkedHours(1);
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Task: {task.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Client: <span className="font-medium">{task.clientName}</span>
            </p>
            <p className="text-sm text-slate-600">
              How many hours did you work on this task?
            </p>
          </div>

          <div>
            <Label htmlFor="workedHours">Hours Worked</Label>
            <Input
              id="workedHours"
              type="number"
              step="0.25"
              min="0.25"
              value={workedHours}
              onChange={(e) => setWorkedHours(parseFloat(e.target.value) || 0)}
              placeholder="Enter hours worked"
              required
            />
          </div>

          {sortedTimeLogs.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border/70 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700">Previously logged time</p>
              <div className="space-y-2">
                {sortedTimeLogs.map((entry, index) => (
                  <div
                    key={`${entry.loggedAt}-${index}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium text-slate-700">Logged time: {entry.hoursText}h</span>
                    <span className="text-xs text-slate-500 text-right">
                      {new Date(entry.loggedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Complete Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaptureWorkedHoursModal;
