import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/types/task';
import type { Project } from '@/hooks/useProjects';
import { loadTasksFromDatabase } from '@/services/taskService';

export const useClientTasks = (projects: Project[]) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);

  useEffect(() => {
    const loadTasks = async () => {
      if (projectIds.length === 0) {
        setTasks([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const allTasks = await loadTasksFromDatabase();
        const filtered = allTasks.filter(t => t.projectId && projectIds.includes(t.projectId));
        setTasks(filtered);
      } catch (error) {
        console.error('Error loading client tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client tasks',
          variant: 'destructive'
        });
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projectIds.join('|')]);

  return { tasks, loading };
};

