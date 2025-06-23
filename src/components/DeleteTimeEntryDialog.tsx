import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { formatDate } from '@/lib/utils';

interface DeleteTimeEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntry: HourEntry;
}

const DeleteTimeEntryDialog = ({ isOpen, onClose, timeEntry }: DeleteTimeEntryDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteHourEntry } = useHourEntries();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteHourEntry(timeEntry.id);
      onClose();
    } catch (error) {
      console.error('Error deleting time entry:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this time entry?
            <div className="mt-2 p-3 bg-slate-50 rounded border">
              <div className="font-medium">{formatDate(timeEntry.date)}</div>
              <div className="text-sm text-slate-600">
                {timeEntry.hours} {timeEntry.hours === 1 ? 'hour' : 'hours'}
                {timeEntry.description && (
                  <div className="line-clamp-2 mt-1">{timeEntry.description}</div>
                )}
              </div>
            </div>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTimeEntryDialog;