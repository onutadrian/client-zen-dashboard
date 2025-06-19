
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';
import { formatDate } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestoneId: string) => void;
}

const MilestoneCard = ({
  milestone,
  onEdit,
  onDelete
}: MilestoneCardProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium">{milestone.title}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
              milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {milestone.status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">{milestone.description}</p>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Due: {formatDate(milestone.targetDate)}</span>
            {milestone.amount && (
              <span>Value: ${milestone.amount.toLocaleString()}</span>
            )}
            <span>{milestone.completionPercentage}% complete</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
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
