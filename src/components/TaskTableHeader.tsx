
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

const TaskTableHeader = () => {
  const { isAdmin } = useAuth();
  const { demoMode } = useCurrency();

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Task</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Project</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Hours</TableHead>
        {isAdmin && !demoMode && <TableHead>Billing</TableHead>}
        <TableHead>Created</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TaskTableHeader;
