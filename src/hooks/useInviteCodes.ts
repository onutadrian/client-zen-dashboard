import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InviteCode, UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

export const useInviteCodes = () => {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchInviteCodes();
    } else {
      setInviteCodes([]);
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchInviteCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInviteCodes(data as InviteCode[]);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
      toast({
        title: "Error",
        description: "Failed to load invite codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createInviteCode = async (role: UserRole, expiresAt?: Date) => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can create invite codes');
      }

      // Generate a random code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data, error } = await supabase
        .from('invite_codes')
        .insert([
          { 
            code, 
            role, 
            expires_at: expiresAt?.toISOString() 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setInviteCodes(prev => [data as InviteCode, ...prev]);
      
      toast({
        title: "Success",
        description: "Invite code created successfully"
      });
      
      return data as InviteCode;
    } catch (error) {
      console.error('Error creating invite code:', error);
      toast({
        title: "Error",
        description: "Failed to create invite code",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteInviteCode = async (id: string) => {
    try {
      if (!isAdmin) {
        throw new Error('Only admins can delete invite codes');
      }

      const { error } = await supabase
        .from('invite_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInviteCodes(prev => prev.filter(code => code.id !== id));
      
      toast({
        title: "Success",
        description: "Invite code deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting invite code:', error);
      toast({
        title: "Error",
        description: "Failed to delete invite code",
        variant: "destructive"
      });
    }
  };

  const validateInviteCode = async (code: string): Promise<{ valid: boolean; role?: UserRole }> => {
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code)
        .eq('is_used', false)
        .single();

      if (error) {
        return { valid: false };
      }

      // Check if code is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false };
      }

      return { valid: true, role: data.role };
    } catch (error) {
      console.error('Error validating invite code:', error);
      return { valid: false };
    }
  };

  return {
    inviteCodes,
    loading,
    createInviteCode,
    deleteInviteCode,
    validateInviteCode,
    refreshInviteCodes: fetchInviteCodes
  };
};