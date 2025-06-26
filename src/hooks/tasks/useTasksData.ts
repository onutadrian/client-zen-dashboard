
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { loadTasksFromDatabase } from '@/services/taskService';

export const useTasksData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const loadTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      let allTasks = await loadTasksFromDatabase();

      if (profile.role !== 'admin') {
        const { data: assignments, error: assignmentError } = await supabase
          .from('user_project_assignments')
          .select('project_id')
          .eq('user_id', user.id);

        if (assignmentError) throw assignmentError;

        const assignedProjectIds = assignments.map(a => a.project_id);
        
        allTasks = allTasks.filter(task => 
          task.projectId && assignedProjectIds.includes(task.projectId)
        );
      }

      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Connection Error",
        description: "Failed to load tasks. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    setTasks,
    loadTasks
  };
};
