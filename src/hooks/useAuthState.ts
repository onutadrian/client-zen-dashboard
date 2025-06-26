
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuthState: Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth state changed:', event, 'User ID:', session?.user?.id);
        setIsAuthenticated(!!session?.user);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authenticated = !!session?.user;
      console.log('useAuthState: Initial session check, authenticated:', authenticated);
      setIsAuthenticated(authenticated);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthenticated, loading };
};
