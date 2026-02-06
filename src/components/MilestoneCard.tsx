import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';
import { formatDate } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestoneId: string) => void;
  onView?: (milestone: Milestone) => void;
}

const MilestoneCard = ({
  milestone,
  onEdit,
  onDelete,
  onView
}: MilestoneCardProps) => {
  return (
    <div className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50" onClick={() => onView && onView(milestone)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium">{milestone.title}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              milestone.status === 'completed' ? 'ui-pill ui-pill--success' :
              milestone.status === 'in-progress' ? 'ui-pill ui-pill--info' :
              'ui-pill ui-pill--neutral'
            }`}>
              {milestone.status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1 line-clamp-2">{milestone.description}</p>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Due: {formatDate(milestone.targetDate)}</span>
            {milestone.amount && (
              <span>Value: ${milestone.amount.toLocaleString()}</span>
            )}
            <span>{milestone.completionPercentage}% complete</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(milestone)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(milestone.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
