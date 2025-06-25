
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

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
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
          console.log('User is signed in, fetching profile...');
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            console.log('Profile fetch completed, setting profile state');
            setProfile(userProfile);
            setIsAdmin(userProfile?.role === 'admin');
            console.log('User role set:', userProfile?.role);
          } catch (error) {
            console.error('Error fetching profile in auth state change:', error);
            setProfile(null);
            setIsAdmin(false);
          } finally {
            console.log('Setting loading to false after profile fetch attempt');
            setLoading(false);
          }
        } else {
          console.log('No user session, clearing profile');
          setProfile(null);
          setIsAdmin(false);
          console.log('Setting loading to false (no user)');
          setLoading(false);
        }
      }
    );

    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Existing session:', session?.user?.email);
        
        if (!session) {
          console.log('No existing session, setting loading to false');
          setLoading(false);
        }
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
