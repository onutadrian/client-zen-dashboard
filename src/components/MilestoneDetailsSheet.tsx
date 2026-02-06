import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';

interface MilestoneDetailsSheetProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
}

const MilestoneDetailsSheet = ({ milestone, isOpen, onClose }: MilestoneDetailsSheetProps) => {
  if (!milestone) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'ui-pill ui-pill--success ';
      case 'in-progress':
        return 'ui-pill ui-pill--info ';
      case 'pending':
        return 'ui-pill ui-pill--neutral ';
      default:
        return 'ui-pill ui-pill--neutral ';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="mb-2">
            <Badge className={getStatusColor(milestone.status)}>
              {milestone.status.replace('-', ' ')}
            </Badge>
          </div>
          <SheetTitle>{milestone.title}</SheetTitle>
          <SheetDescription>Milestone details and information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {milestone.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{milestone.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Dates
            </h3>
            <div className="text-sm text-slate-600 ml-6">
              <div>Target date: {new Date(milestone.targetDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Progress
            </h3>
            <div className="text-sm text-slate-600 ml-6">
              <div>Completion: {milestone.completionPercentage}%</div>
              {typeof milestone.estimatedHours === 'number' && (
                <div>Estimated hours: {milestone.estimatedHours}</div>
              )}
              {typeof milestone.amount === 'number' && (
                <div>Amount: {milestone.amount.toLocaleString()} {milestone.currency || 'USD'}</div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MilestoneDetailsSheet;

