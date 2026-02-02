import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, User, FileText, Link as LinkIcon, Calendar, FolderOpen } from 'lucide-react';
import { Task } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useHourEntries } from '@/hooks/useHourEntries';

interface Project {
  id: string;
  name: string;
  pricingType?: 'fixed' | 'hourly' | 'daily';
}

interface TaskDetailsSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  projects?: Project[];
}

const TaskDetailsSheet = ({ task, isOpen, onClose, projects = [] }: TaskDetailsSheetProps) => {
  if (!task) return null;
  const { isAdmin } = useAuth();
  const { demoMode } = useCurrency();
  const { hourEntries, updateHourEntry } = useHourEntries();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const projectPricingType = React.useMemo(() => {
    if (!task.projectId) return undefined;
    const project = projects.find(p => p.id === task.projectId);
    return project?.pricingType;
  }, [projects, task.projectId]);

  const isFixedPriceProject = projectPricingType === 'fixed';

  const taskHourEntries = React.useMemo(
    () => hourEntries.filter((entry) => entry.taskId === task.id),
    [hourEntries, task.id]
  );

  const isBilled = React.useMemo(
    () => taskHourEntries.some((entry) => entry.billed === true),
    [taskHourEntries]
  );

  const handleToggleBilled = async () => {
    if (demoMode || isFixedPriceProject || taskHourEntries.length === 0) return;
    const nextBilledState = !isBilled;
    await Promise.all(
      taskHourEntries.map((entry) => updateHourEntry(entry.id, { billed: nextBilledState }))
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          {task.urgent && (
            <div className="mb-2">
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
            </div>
          )}
          <SheetTitle>{task.title}</SheetTitle>
          <SheetDescription>Task details and information</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Status and Client Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">Client:</span>
              <span className="text-sm text-slate-600">{task.clientName}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">Project:</span>
              <span className="text-sm text-slate-600">{getProjectName(task.projectId)}</span>
            </div>
          </div>

          {/* Hours Information - Only show worked hours */}
          {task.workedHours && task.workedHours > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time Worked
              </h3>
              <div className="space-y-1 text-sm text-slate-600 ml-6">
                <div className="text-green-600 font-medium">{task.workedHours}h worked</div>
              </div>
            </div>
          )}

          {/* Billing */}
          {isAdmin && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Billing</h3>
              <div className="flex items-center justify-between text-sm text-slate-600">
                {demoMode ? (
                  <Badge variant="secondary">
                    —
                  </Badge>
                ) : isFixedPriceProject ? (
                  <Badge variant="secondary">
                    Fixed price
                  </Badge>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isBilled ? "default" : "secondary"}
                        className={isBilled ? "bg-green-100 text-green-800" : ""}
                      >
                        {isBilled ? "Billed" : "Not Billed"}
                      </Badge>
                      {taskHourEntries.length === 0 && (
                        <span className="text-xs text-slate-500">No linked hours</span>
                      )}
                    </div>
                    <Switch
                      checked={isBilled}
                      onCheckedChange={handleToggleBilled}
                      disabled={taskHourEntries.length === 0}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </h3>
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                {task.notes}
              </div>
            </div>
          )}

          {/* Assets */}
          {task.assets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" />
                Assets ({task.assets.length})
              </h3>
              <div className="space-y-2 ml-6">
                {task.assets.map((asset, index) => (
                  <div key={index} className="text-sm">
                    {asset.startsWith('http') ? (
                      <a 
                        href={asset} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all line-clamp-1"
                      >
                        {asset}
                      </a>
                    ) : (
                      <span className="text-slate-600 line-clamp-1">{asset}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium text-slate-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </h3>
            <div className="space-y-1 text-sm text-slate-600 ml-6">
              <div>Created: {new Date(task.createdDate).toLocaleDateString()}</div>
              {task.completedDate && (
                <div>Completed: {new Date(task.completedDate).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
