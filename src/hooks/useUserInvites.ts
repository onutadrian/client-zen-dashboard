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

  const sendInviteEmail = async (email: string, role: UserRole, token: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user?.id)
        .single();

      const { data, error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          email,
          role,
          token,
          invitedBy: profile?.email || user?.email || 'Admin'
        }
      });

      if (error) throw error;

      // Update the invite record to mark email as sent
      await supabase
        .from('user_invites')
        .update({ 
          email_sent: true, 
          email_sent_at: new Date().toISOString() 
        })
        .eq('token', token);

      return data;
    } catch (error) {
      console.error('Error sending invite email:', error);
      throw error;
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
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
        .select()
        .single();

      if (error) throw error;

      // Send the invite email
      try {
        await sendInviteEmail(email, role, token);
        toast({
          title: "Success",
          description: `Invite sent to ${email}`,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Invite Created",
          description: `Invite created for ${email}, but email sending failed. Please check your email configuration.`,
          variant: "destructive",
        });
      }

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
      const { data, error } = await supabase.functions.invoke('validate-invite-token', {
        body: { token }
      });

      if (error) {
        console.error('Error validating invite token:', error);
        return null;
      }

      if (data?.valid) {
        return {
          token,
          role: data.role as UserRole,
          expires_at: data.expires_at,
          // Only include necessary fields for validation
          id: '', // Not needed for validation
          email: '', // Not exposed for security
          used: false,
          created_at: '',
          invited_by: '',
          used_at: null,
          used_by: null,
          email_sent: false,
          email_sent_at: null
        };
      }

      return null;
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
