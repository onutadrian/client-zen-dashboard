
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HourEntry, useHourEntries } from '@/hooks/useHourEntries';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

interface TimeEntryDebugTableProps {
  projectId: string;
}

const TimeEntryDebugTable = ({ projectId }: TimeEntryDebugTableProps) => {
  const { hourEntries, deleteHourEntry } = useHourEntries();
  const { user } = useAuth();
  
  const projectEntries = hourEntries.filter(entry => entry.projectId === projectId);

  const handleDebugDelete = async (entryId: number) => {
    console.log('Debug Delete - Current user ID:', user?.id);
    console.log('Debug Delete - Attempting to delete entry ID:', entryId);
    
    const entry = projectEntries.find(e => e.id === entryId);
    console.log('Debug Delete - Entry details:', entry);
    console.log('Debug Delete - Entry user ID:', entry?.userId);
    console.log('Debug Delete - User IDs match:', user?.id === entry?.userId);
    
    try {
      await deleteHourEntry(entryId);
      console.log('Debug Delete - Delete operation completed');
    } catch (error) {
      console.error('Debug Delete - Error:', error);
    }
  };

  if (projectEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug: No Time Entries Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current user ID: {user?.id}</p>
          <p>Total entries in hook: {hourEntries.length}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug: Time Entries Table</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current user: {user?.id}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Matches Current User</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell className={entry.hours > 100 ? 'font-bold text-red-600' : ''}>
                  {entry.hours}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {entry.userId || 'No User ID'}
                </TableCell>
                <TableCell>
                  <span className={user?.id === entry.userId ? 'text-green-600' : 'text-red-600'}>
                    {user?.id === entry.userId ? 'YES' : 'NO'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDebugDelete(entry.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TimeEntryDebugTable;
