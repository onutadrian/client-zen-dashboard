
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProjectAssignment {
  id: string;
  user_id: string;
  project_id: string;
  assigned_at: string;
  assigned_by: string;
}

export const useUserProjectAssignments = () => {
  const [assignments, setAssignments] = useState<UserProjectAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_project_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load project assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignUserToProject = async (userId: string, projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_project_assignments')
        .insert([{
          user_id: userId,
          project_id: projectId,
          assigned_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User assigned to project successfully",
      });

      await fetchAssignments();
    } catch (error) {
      console.error('Error assigning user to project:', error);
      toast({
        title: "Error",
        description: "Failed to assign user to project",
        variant: "destructive",
      });
    }
  };

  const removeUserFromProject = async (userId: string, projectId: string) => {
    try {
      const { error } = await supabase
        .from('user_project_assignments')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User removed from project successfully",
      });

      await fetchAssignments();
    } catch (error) {
      console.error('Error removing user from project:', error);
      toast({
        title: "Error",
        description: "Failed to remove user from project",
        variant: "destructive",
      });
    }
  };

  const getUserAssignments = (userId: string) => {
    return assignments.filter(assignment => assignment.user_id === userId);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return {
    assignments,
    loading,
    assignUserToProject,
    removeUserFromProject,
    getUserAssignments,
    refreshAssignments: fetchAssignments
  };
};
