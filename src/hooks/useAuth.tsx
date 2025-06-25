
import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Error during signOut:', err);
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkProfileExists = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking if profile exists for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking profile existence:', error);
        return false;
      }
      
      const exists = !!data;
      console.log('Profile exists:', exists);
      return exists;
    } catch (error) {
      console.error('Error in checkProfileExists:', error);
      return false;
    }
  };

  const createProfile = async (userId: string, userEmail: string): Promise<UserProfile | null> => {
    try {
      console.log('Creating profile for user:', userId, userEmail);
      const newProfile = {
        id: userId,
        email: userEmail,
        role: 'standard' as const,
        full_name: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return newProfile; // Return the basic profile even if insert fails
      }

      console.log('Profile created successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in createProfile:', error);
      // Return basic profile as fallback
      return {
        id: userId,
        email: userEmail,
        role: 'standard',
        full_name: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // First check if profile exists with a quick query
      const profileExists = await checkProfileExists(userId);
      
      if (!profileExists) {
        console.log('Profile does not exist, creating one...');
        const createdProfile = await createProfile(userId, user?.email || '');
        return createdProfile;
      }

      // Fetch the full profile with a shorter timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 8000); // Reduced to 8 seconds
      });

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        console.error('Error fetching user profile:', error);
        // If fetch fails but profile exists, return a basic profile
        return {
          id: userId,
          email: user?.email || '',
          role: 'standard',
          full_name: user?.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      console.log('User profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Always return a basic profile to prevent auth flow from breaking
      return {
        id: userId,
        email: user?.email || '',
        role: 'standard',
        full_name: user?.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User is signed in, deferring profile fetch...');
          // Defer profile fetch to prevent potential auth callback deadlocks
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(session.user.id);
              console.log('Profile fetch completed, setting profile state');
              setProfile(userProfile);
              setIsAdmin(userProfile?.role === 'admin');
              console.log('User role set:', userProfile?.role);
            } catch (error) {
              console.error('Error fetching profile in deferred call:', error);
              // Set basic profile even if deferred fetch fails
              const basicProfile = {
                id: session.user.id,
                email: session.user.email || '',
                role: 'standard' as const,
                full_name: session.user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setProfile(basicProfile);
              setIsAdmin(false);
            } finally {
              console.log('Setting loading to false after profile fetch attempt');
              setLoading(false);
            }
          }, 100); // Small delay to prevent callback conflicts
        } else {
          console.log('No user session, clearing profile');
          setProfile(null);
          setIsAdmin(false);
          console.log('Setting loading to false (no user)');
          setLoading(false);
        }
      }
    );

    // Check for existing session with shorter timeout
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Existing session:', session?.user?.email);
        
        if (!session) {
          console.log('No existing session, setting loading to false');
          setLoading(false);
        }
        // If there is a session, the onAuthStateChange callback will handle it
      } catch (error) {
        console.error('Error checking session:', error);
        console.log('Session check failed, setting loading to false');
        setLoading(false);
      }
    };

    checkSession();
    
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  console.log('AuthProvider render - loading:', loading, 'user:', user?.email, 'profile:', profile?.role);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
