
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProjectProgressBarsProps {
  completionPercentage: number;
  paymentPercentage: number;
}

const ProjectProgressBars = ({ completionPercentage, paymentPercentage }: ProjectProgressBarsProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Work Completion</span>
          <span>{completionPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={completionPercentage} className="h-3" />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Payment Collection</span>
          <span>{paymentPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={paymentPercentage} className="h-3" />
      </div>
    </div>
  );
};

export default ProjectProgressBars;
