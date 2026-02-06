import { useClientIdentity } from './useClientIdentity';
import { useClientProjects } from './useClientProjects';
import { useClientTasks } from './useClientTasks';
import { useClientMilestones } from './useClientMilestones';

export const useClientData = () => {
  const { client, loading: clientLoading } = useClientIdentity();
  const { projects, loading: projectsLoading } = useClientProjects(client);
  const { tasks, loading: tasksLoading } = useClientTasks(projects);
  const { milestones, loading: milestonesLoading } = useClientMilestones(projects);

  return {
    client,
    projects,
    tasks,
    milestones,
    loading: clientLoading || projectsLoading || tasksLoading || milestonesLoading,
    clientLoading,
    projectsLoading,
    tasksLoading,
    milestonesLoading
  };
};

