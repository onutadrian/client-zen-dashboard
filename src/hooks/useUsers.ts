
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
      // First check if current user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Only admins can view all users
      if (currentProfile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view all users",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched users:', data);
      
      // Type assertion to ensure role is properly typed
      const typedUsers = (data || []).map(user => ({
        ...user,
        role: user.role as 'admin' | 'standard'
      }));
      
      setUsers(typedUsers);
      
      if (typedUsers.length === 0) {
        console.log('No users found in database');
        toast({
          title: "No Users",
          description: "No users found in the system",
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
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
