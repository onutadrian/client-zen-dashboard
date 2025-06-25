
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const useAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [needsAdminSetup, setNeedsAdminSetup] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkAndSetupAdmin = async () => {
      console.log('Admin check - authLoading:', authLoading, 'user:', user?.email, 'profile:', profile, 'hasChecked:', hasChecked);
      
      if (authLoading || !user) {
        console.log('Admin check - still loading or no user, skipping...');
        return;
      }

      if (hasChecked) {
        console.log('Admin check - already checked, setting isCheckingAdmin to false');
        setIsCheckingAdmin(false);
        return;
      }

      console.log('Admin check - performing check for user:', user.email);
      setHasChecked(true);

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
      }

      console.log('Admin check complete, setting isCheckingAdmin to false');
      setIsCheckingAdmin(false);
    };

    checkAndSetupAdmin();
  }, [user, profile, authLoading, hasChecked]);

  console.log('useAdminCheck render - isCheckingAdmin:', isCheckingAdmin, 'needsAdminSetup:', needsAdminSetup, 'isAdmin:', profile?.role === 'admin');

  return {
    isCheckingAdmin,
    needsAdminSetup,
    isAdmin: profile?.role === 'admin'
  };
};
