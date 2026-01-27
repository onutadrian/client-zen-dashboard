import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardListSkeletonProps {
  count?: number;
  lines?: number;
}

const CardListSkeleton = ({ count = 4, lines = 3 }: CardListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="py-4 space-y-3">
            <Skeleton className="h-5 w-48" />
            {Array.from({ length: lines }).map((__, idx) => (
              <Skeleton key={idx} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardListSkeleton;

