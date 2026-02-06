
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useClients } from '@/hooks/useClients';

export const useDashboardData = () => {
  const { loading: authLoading, profile, isAdmin, user, session } = useAuth();
  
  const {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    dateRange
  } = usePeriodFilter();
  
  const analytics = useAnalytics({ dateRange });
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask, editTask } = useTasks();
  const { milestones, loading: milestonesLoading } = useMilestones();
  const { clients, loading: clientsLoading } = useClients();

  return {
    authLoading,
    profile,
    isAdmin,
    user,
    session,
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    analytics,
    projects,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    editTask,
    milestones,
    clients,
    // loading flags for skeletons
    projectsLoading,
    tasksLoading,
    milestonesLoading,
    clientsLoading
  };
};
