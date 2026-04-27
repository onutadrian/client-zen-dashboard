import React, { useMemo, useState } from 'react';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CaptureWorkedHoursModal from '@/components/CaptureWorkedHoursModal';
import AddTaskModal from '@/components/AddTaskModal';
import TaskTableRow from '@/components/TaskTableRow';
import TaskMobileCards from '@/components/task/TaskMobileCards';
import { Task } from '@/types/task';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';
import type { ProjectStatus } from './ProjectStatusFilter';
import { useHourEntries } from '@/hooks/useHourEntries';
import {
  filterEnrichedTasks,
  groupTasksByMonth,
  useTaskListViewModel,
  type TaskBillingState,
  type TaskListMode,
} from '@/components/task/useTaskListViewModel';

interface TaskManagementSectionV2Props {
  mode: TaskListMode;
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onUpdateTask?: (taskId: number, status: Task['status'], actualHours?: number) => void;
  onDeleteTask?: (taskId: number) => void;
  onEditTask?: (task: Task) => void;
  onAddTask?: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  selectedStatuses?: ProjectStatus[];
  onStatusChange?: (statuses: ProjectStatus[]) => void;
  readOnly?: boolean;
}

const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; activeClass: string; inactiveClass: string }> = {
  active: {
    label: 'Active',
    activeClass: 'ui-pill ui-pill--success',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  paused: {
    label: 'Paused',
    activeClass: 'ui-pill ui-pill--warning',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  completed: {
    label: 'Completed',
    activeClass: 'ui-pill ui-pill--info',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  canceled: {
    label: 'Canceled',
    activeClass: 'ui-pill ui-pill--danger',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
};

const TASK_STATUS_CONFIG: Record<'all' | Task['status'], { label: string; activeClass: string; inactiveClass: string }> = {
  all: {
    label: 'All',
    activeClass: 'ui-pill ui-pill--neutral',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  pending: {
    label: 'Pending',
    activeClass: 'ui-pill ui-pill--neutral',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  'in-progress': {
    label: 'In Progress',
    activeClass: 'ui-pill ui-pill--info',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  completed: {
    label: 'Completed',
    activeClass: 'ui-pill ui-pill--success',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
};

const BILLING_FILTER_CONFIG: Record<'all' | Exclude<TaskBillingState, 'unknown'>, { label: string; activeClass: string; inactiveClass: string }> = {
  all: {
    label: 'All',
    activeClass: 'ui-pill ui-pill--neutral',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  billed: {
    label: 'Billed',
    activeClass: 'ui-pill ui-pill--success',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
  unbilled: {
    label: 'Unbilled',
    activeClass: 'ui-pill ui-pill--warning',
    inactiveClass: 'bg-muted text-muted-foreground border-border',
  },
};

interface FilterPanelProps {
  mode: TaskListMode;
  selectedStatuses: ProjectStatus[];
  onToggleProjectStatus: (status: ProjectStatus) => void;
  selectedTaskStatus: 'all' | Task['status'];
  onSelectTaskStatus: (status: 'all' | Task['status']) => void;
  selectedBilling: 'all' | 'billed' | 'unbilled';
  onSelectBilling: (status: 'all' | 'billed' | 'unbilled') => void;
  onClearFilters: () => void;
}

const getActiveFilterCount = (
  mode: TaskListMode,
  selectedStatuses: ProjectStatus[],
  selectedTaskStatus: 'all' | Task['status'],
  selectedBilling: 'all' | 'billed' | 'unbilled'
) => {
  let count = 0;

  if (mode === 'dashboard') {
    const isDefaultDashboardState =
      selectedStatuses.length === 1 && selectedStatuses[0] === 'active';
    if (!isDefaultDashboardState) {
      count += 1;
    }
  } else if (selectedTaskStatus !== 'all') {
    count += 1;
  }

  if (selectedBilling !== 'all') {
    count += 1;
  }

  return count;
};

const FilterPanel = ({
  mode,
  selectedStatuses,
  onToggleProjectStatus,
  selectedTaskStatus,
  onSelectTaskStatus,
  selectedBilling,
  onSelectBilling,
  onClearFilters,
}: FilterPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/70 bg-white p-4 shadow-sm">
        <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-foreground">
            {mode === 'dashboard' ? 'Project status' : 'Task status'}
              </span>
              <p className="text-xs text-muted-foreground">
                {mode === 'dashboard'
                  ? 'Choose which project states should contribute tasks to the list.'
                  : 'Focus the list on one task state or view everything.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === 'dashboard'
            ? (Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).map(status => {
                const config = PROJECT_STATUS_CONFIG[status];
                const isSelected = selectedStatuses.includes(status);
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className={`cursor-pointer transition-colors border ${isSelected ? config.activeClass : config.inactiveClass}`}
                    onClick={() => onToggleProjectStatus(status)}
                  >
                    {config.label}
                  </Badge>
                );
              })
            : (Object.keys(TASK_STATUS_CONFIG) as Array<'all' | Task['status']>).map(status => {
                const config = TASK_STATUS_CONFIG[status];
                const isSelected = selectedTaskStatus === status;
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className={`cursor-pointer transition-colors border ${isSelected ? config.activeClass : config.inactiveClass}`}
                    onClick={() => onSelectTaskStatus(status)}
                  >
                    {config.label}
                  </Badge>
                );
              })}
        </div>
      </div>
      </div>

      <div className="rounded-lg border border-border/70 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-sm font-medium text-foreground">Billing</span>
            <p className="text-xs text-muted-foreground">
              Show all tasks or limit the list to billed or unbilled work only.
            </p>
          </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BILLING_FILTER_CONFIG) as Array<'all' | 'billed' | 'unbilled'>).map(status => {
            const config = BILLING_FILTER_CONFIG[status];
            const isSelected = selectedBilling === status;
            return (
              <Badge
                key={status}
                variant="outline"
                className={`cursor-pointer transition-colors border ${isSelected ? config.activeClass : config.inactiveClass}`}
                onClick={() => onSelectBilling(status)}
              >
                {config.label}
              </Badge>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

const TaskManagementSectionV2 = ({
  mode,
  tasks,
  clients,
  projects,
  onTaskClick,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
  selectedStatuses = ['active'],
  onStatusChange,
  readOnly = false,
}: TaskManagementSectionV2Props) => {
  const { hourEntries } = useHourEntries();
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<'all' | Task['status']>('all');
  const [selectedBilling, setSelectedBilling] = useState<'all' | 'billed' | 'unbilled'>('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [selectedTaskForHours, setSelectedTaskForHours] = useState<Task | null>(null);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const hasActiveProjects = useMemo(() => projects.some(project => project.status === 'active'), [projects]);

  const enrichedTasks = useTaskListViewModel(tasks, projects, hourEntries);

  const filteredTasks = useMemo(() => {
    return filterEnrichedTasks({
      tasks: enrichedTasks,
      mode,
      selectedProjectStatuses: selectedStatuses,
      selectedTaskStatus,
      selectedBilling,
    });
  }, [enrichedTasks, mode, selectedStatuses, selectedTaskStatus, selectedBilling]);

  const groupedTasks = useMemo(() => groupTasksByMonth(filteredTasks), [filteredTasks]);

  const taskMetaById = useMemo(() => {
    return Object.fromEntries(
      filteredTasks.map(task => [
        task.id,
        {
          taskHoursTotal: task.taskHoursTotal,
          billingState: task.billingState,
        },
      ])
    ) as Record<number, { taskHoursTotal: number; billingState: TaskBillingState }>;
  }, [filteredTasks]);

  const transformedClients = useMemo(() => {
    return clients.map(client => ({
      id: client.id,
      name: client.name,
      priceType: client.priceType || 'hour',
      hourEntries: [],
    }));
  }, [clients]);

  const transformedProjects = useMemo(() => {
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      useMilestones: project.useMilestones,
      pricingType: project.pricingType,
    }));
  }, [projects]);

  const handleEditTask = (task: Task) => {
    if (readOnly || !onEditTask) return;
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleModalClose = () => {
    setShowAddTaskModal(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    if (!onAddTask || !onEditTask) {
      handleModalClose();
      return;
    }
    if (editingTask) {
      onEditTask({ ...taskData, id: editingTask.id });
    } else {
      onAddTask(taskData);
    }
    handleModalClose();
  };

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    if (readOnly || !onUpdateTask) {
      return;
    }

    if (newStatus === 'completed' && task.status !== 'completed') {
      setSelectedTaskForHours(task);
      setShowHoursModal(true);
      return;
    }

    onUpdateTask(task.id, newStatus);
  };

  const handleWorkedHoursSubmit = (workedHours: number) => {
    if (selectedTaskForHours && onUpdateTask) {
      onUpdateTask(selectedTaskForHours.id, 'completed', workedHours);
    }
    setSelectedTaskForHours(null);
  };

  const toggleProjectStatus = (status: ProjectStatus) => {
    if (!onStatusChange) return;
    if (selectedStatuses.includes(status)) {
      if (selectedStatuses.length > 1) {
        onStatusChange(selectedStatuses.filter(item => item !== status));
      }
      return;
    }

    onStatusChange([...selectedStatuses, status]);
  };

  const handleClearFilters = () => {
    if (mode === 'dashboard' && onStatusChange) {
      onStatusChange(['active']);
    }
    if (mode === 'project') {
      setSelectedTaskStatus('all');
    }
    setSelectedBilling('all');
  };

  const activeFilterCount = useMemo(
    () => getActiveFilterCount(mode, selectedStatuses, selectedTaskStatus, selectedBilling),
    [mode, selectedStatuses, selectedTaskStatus, selectedBilling]
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="inline-flex overflow-hidden rounded-md border border-input bg-background shadow-sm">
                <Popover open={showDesktopFilters} onOpenChange={setShowDesktopFilters}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[380px] rounded-xl border border-border/80 bg-slate-50 p-3 shadow-xl">
                    <FilterPanel
                      mode={mode}
                      selectedStatuses={selectedStatuses}
                      onToggleProjectStatus={toggleProjectStatus}
                      selectedTaskStatus={selectedTaskStatus}
                      onSelectTaskStatus={setSelectedTaskStatus}
                      selectedBilling={selectedBilling}
                      onSelectBilling={setSelectedBilling}
                      onClearFilters={handleClearFilters}
                    />
                  </PopoverContent>
                </Popover>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleClearFilters();
                    }}
                    className="group inline-flex h-9 min-w-9 items-center justify-center border-l border-input px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
                    aria-label="Clear active filters"
                    title="Clear filters"
                  >
                    <span className="group-hover:hidden">{activeFilterCount}</span>
                    <X className="hidden h-3.5 w-3.5 group-hover:block" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <div className="inline-flex overflow-hidden rounded-md border border-input bg-background shadow-sm">
                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl bg-slate-50">
                    <SheetHeader className="mb-4">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine tasks by status and billing.
                      </SheetDescription>
                    </SheetHeader>
                    <FilterPanel
                      mode={mode}
                      selectedStatuses={selectedStatuses}
                      onToggleProjectStatus={toggleProjectStatus}
                      selectedTaskStatus={selectedTaskStatus}
                      onSelectTaskStatus={setSelectedTaskStatus}
                      selectedBilling={selectedBilling}
                      onSelectBilling={setSelectedBilling}
                      onClearFilters={handleClearFilters}
                    />
                  </SheetContent>
                </Sheet>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleClearFilters();
                    }}
                    className="group inline-flex h-9 min-w-9 items-center justify-center border-l border-input px-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
                    aria-label="Clear active filters"
                    title="Clear filters"
                  >
                    <span className="group-hover:hidden">{activeFilterCount}</span>
                    <X className="hidden h-3.5 w-3.5 group-hover:block" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {mode === 'project' && !readOnly && !hasActiveProjects && (
              <span className="text-sm text-slate-500">Project is inactive</span>
            )}
            {!readOnly && onAddTask && (
              <Button
                variant="primary"
                onClick={() => setShowAddTaskModal(true)}
                className="shrink-0"
                disabled={!hasActiveProjects}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Task</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="whitespace-nowrap">Project</TableHead>
                  <TableHead className="whitespace-nowrap">Assigned To</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Hours</TableHead>
                  <TableHead className="whitespace-nowrap">Created</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                      No tasks found
                    </TableCell>
                  </TableRow>
                ) : (
                  groupedTasks.map(group => (
                    <React.Fragment key={group.monthKey}>
                      <TableRow className="hover:bg-inherit bg-slate-50/80">
                        <TableCell colSpan={8} className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {group.monthLabel}
                        </TableCell>
                      </TableRow>
                      {group.tasks.map(task => (
                        <TaskTableRow
                          key={`task-v2-${task.id}`}
                          task={task}
                          clients={transformedClients}
                          projects={transformedProjects}
                          onTaskClick={onTaskClick}
                          onUpdateTask={onUpdateTask}
                          onDeleteTask={onDeleteTask}
                          onEditTask={handleEditTask}
                          onStatusChange={handleStatusChange}
                          readOnly={readOnly}
                          taskHoursTotalOverride={task.taskHoursTotal}
                          billingStateOverride={task.billingState}
                          showBillingBadge
                        />
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="sm:hidden space-y-4">
          {groupedTasks.length === 0 ? (
            <div className="rounded-md border bg-white px-4 py-6 text-center text-muted-foreground">
              No tasks found
            </div>
          ) : (
            groupedTasks.map(group => (
              <div key={`mobile-${group.monthKey}`} className="space-y-3">
                <div className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.monthLabel}
                </div>
                <TaskMobileCards
                  tasks={group.tasks}
                  projects={transformedProjects}
                  onTaskClick={onTaskClick}
                  onStatusChange={handleStatusChange}
                  onEditTask={handleEditTask}
                  onDeleteTask={onDeleteTask}
                  readOnly={readOnly}
                  taskMetaById={taskMetaById}
                  showBillingBadges
                />
              </div>
            ))
          )}
        </div>
      </div>

      {!readOnly && (
        <>
          <AddTaskModal
            isOpen={showAddTaskModal}
            onClose={handleModalClose}
            onAdd={handleTaskSubmit}
            clients={clients.map(client => ({
              id: client.id,
              name: client.name,
              priceType: client.priceType || 'hour',
            }))}
            projects={projects
              .filter(project => project.status === 'active')
              .map(project => ({
                id: project.id,
                name: project.name,
                clientId: project.clientId,
                useMilestones: project.useMilestones,
                status: project.status,
              }))}
            task={editingTask}
          />

          <CaptureWorkedHoursModal
            isOpen={showHoursModal}
            onClose={() => {
              setShowHoursModal(false);
              setSelectedTaskForHours(null);
            }}
            task={selectedTaskForHours}
            onComplete={handleWorkedHoursSubmit}
          />
        </>
      )}
    </>
  );
};

export default TaskManagementSectionV2;
