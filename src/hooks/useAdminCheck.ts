
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
      
      if (authLoading || !user || hasChecked) {
        if (!authLoading && hasChecked) {
          setIsCheckingAdmin(false);
        }
        return;
      }

      setHasChecked(true);

      // Check if this is the main admin account that needs to be setup
      if (user.email === 'adrian@furtuna.ro' && profile?.role !== 'admin') {
        console.log('Setting up admin role for adrian@furtuna.ro');
        
        try {
          // Update the profile role to admin
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating admin role:', error);
          } else {
            console.log('Successfully set admin role');
            setNeedsAdminSetup(true); // This will trigger a refresh
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

  return {
    isCheckingAdmin,
    needsAdminSetup,
    isAdmin: profile?.role === 'admin'
  };
};
