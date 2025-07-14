
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Type assertion to ensure role is properly typed
      const typedUsers = (data || []).map(user => ({
        ...user,
        role: user.role as 'admin' | 'standard'
      }));
      
      setUsers(typedUsers);
      
      if (typedUsers.length === 0) {
        toast({
          title: "No Users",
          description: "No users found in the system",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load users: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'standard') => {
    try {
      // Use the secure admin-only function to update roles
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: role
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('Only administrators')) {
          throw new Error('You do not have permission to update user roles');
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      await fetchUsers();
    } catch (error) {
      console.error('Role update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    updateUserRole,
    refreshUsers: fetchUsers
  };
};
