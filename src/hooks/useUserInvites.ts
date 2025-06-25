
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserInvite, UserRole } from '@/types/auth';

export const useUserInvites = () => {
  const [invites, setInvites] = useState<UserInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type assertion to ensure role is properly typed
      const typedInvites = (data || []).map(invite => ({
        ...invite,
        role: invite.role as UserRole
      }));
      setInvites(typedInvites);
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async (email: string, role: UserRole) => {
    try {
      const token = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('user_invites')
        .insert({
          email,
          role,
          token,
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invite sent to ${email}`,
      });

      await fetchInvites();
      return data;
    } catch (error) {
      console.error('Error creating invite:', error);
      toast({
        title: "Error",
        description: "Failed to create invite",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success", 
        description: "Invite deleted successfully",
      });

      await fetchInvites();
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      });
    }
  };

  const validateInviteToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) return null;
      return data ? { ...data, role: data.role as UserRole } : null;
    } catch (error) {
      console.error('Error validating invite token:', error);
      return null;
    }
  };

  const markInviteAsUsed = async (token: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .update({
          used: true,
          used_at: new Date().toISOString(),
          used_by: userId
        })
        .eq('token', token);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking invite as used:', error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return {
    invites,
    loading,
    createInvite,
    deleteInvite,
    validateInviteToken,
    markInviteAsUsed,
    refreshInvites: fetchInvites
  };
};
