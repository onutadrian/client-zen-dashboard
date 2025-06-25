
import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType, UserRole } from '@/types/auth';

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
        // Ignore errors
        console.log('Error during signOut:', err);
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
            setIsAdmin(userProfile?.role === 'admin');
            console.log('User role set:', userProfile?.role);
          } catch (error) {
            console.error('Error fetching profile:', error);
            // Continue with default values
            setProfile(null);
            setIsAdmin(false);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        
        console.log('Setting loading to false');
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Existing session:', session?.user?.email);
        
        if (!session) {
          console.log('No existing session, setting loading to false');
          setLoading(false);
        }
        // If session exists, the onAuthStateChange will handle it
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();
    
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

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
