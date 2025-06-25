
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState, useRef } from 'react';

export const useAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [needsAdminSetup, setNeedsAdminSetup] = useState(false);
  const hasProcessedUser = useRef<string | null>(null);

  useEffect(() => {
    const checkAndSetupAdmin = async () => {
      console.log('Admin check - authLoading:', authLoading, 'user:', user?.email, 'profile:', profile, 'hasProcessedUser:', hasProcessedUser.current);
      
      if (authLoading || !user) {
        console.log('Admin check - still loading or no user, skipping...');
        return;
      }

      // Check if we've already processed this user to prevent loops
      if (hasProcessedUser.current === user.id) {
        console.log('Admin check - already processed this user, setting isCheckingAdmin to false');
        setIsCheckingAdmin(false);
        // Reset needsAdminSetup if user already has admin role
        if (profile?.role === 'admin') {
          console.log('Admin check - user already has admin role, clearing needsAdminSetup');
          setNeedsAdminSetup(false);
        }
        return;
      }

      console.log('Admin check - performing check for user:', user.email);
      hasProcessedUser.current = user.id;

      // Check if this is the main admin account that needs to be setup
      if (user.email === 'adrian@furtuna.ro' && profile?.role !== 'admin') {
        console.log('Setting up admin role for adrian@furtuna.ro');
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating admin role:', error);
          } else {
            console.log('Successfully set admin role');
            setNeedsAdminSetup(true);
          }
        } catch (error) {
          console.error('Error in admin setup:', error);
        }
      } else if (profile?.role === 'admin') {
        // User already has admin role, no setup needed
        console.log('User already has admin role, no setup needed');
        setNeedsAdminSetup(false);
      }

      console.log('Admin check complete, setting isCheckingAdmin to false');
      setIsCheckingAdmin(false);
    };

    checkAndSetupAdmin();
  }, [user, profile, authLoading]);

  // Reset processed user when user changes
  useEffect(() => {
    if (!user) {
      hasProcessedUser.current = null;
    }
  }, [user?.id]);

  console.log('useAdminCheck render - isCheckingAdmin:', isCheckingAdmin, 'needsAdminSetup:', needsAdminSetup, 'isAdmin:', profile?.role === 'admin');

  return {
    isCheckingAdmin,
    needsAdminSetup,
    isAdmin: profile?.role === 'admin'
  };
};
