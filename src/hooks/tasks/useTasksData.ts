
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { loadTasksFromDatabase } from '@/services/taskService';

export const useTasksData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  console.log('useTasksData: Current tasks count:', tasks.length);

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
    console.log('useTasksData: Initial load triggered');
    loadTasks();
  }, []);

  // Listen for auth state changes but don't reload if we already have tasks
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useTasksData: Auth state changed:', event, 'Tasks count:', tasks.length);
      
      // Only reload if we don't have tasks and user is authenticated
      if (event === 'SIGNED_IN' && tasks.length === 0) {
        console.log('useTasksData: Reloading tasks after sign in');
        setTimeout(() => loadTasks(), 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [tasks.length]);

  return {
    tasks,
    setTasks: (newTasks: React.SetStateAction<Task[]>) => {
      console.log('useTasksData: setTasks called');
      setTasks(newTasks);
    },
    loadTasks
  };
};
