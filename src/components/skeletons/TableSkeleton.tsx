import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  headers?: string[];
}

const TableSkeleton = ({ rows = 5, cols = 4, headers }: TableSkeletonProps) => {
  const headerCells = headers && headers.length > 0 ? headers : Array.from({ length: cols }, () => '');
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headerCells.map((h, idx) => (
              <TableHead key={idx}>
                {h || <Skeleton className="h-4 w-24" />}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: headerCells.length }).map((__, c) => (
                <TableCell key={c}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;

