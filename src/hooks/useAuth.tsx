
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching to avoid recursion
        if (session?.user) {
          setTimeout(async () => {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }

        // Handle authentication events with proper error handling
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password Recovery",
            description: "Please check your email for password recovery instructions.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Clear state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced authentication functions with proper error handling
export const signUp = async (email: string, password: string, fullName?: string) => {
  try {
    // CRITICAL: Always set emailRedirectTo for proper authentication flow
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || email
        }
      }
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        return { 
          error: { 
            message: 'An account with this email already exists. Please sign in instead.' 
          } 
        };
      }
      if (error.message.includes('Password should be')) {
        return { 
          error: { 
            message: 'Password must be at least 6 characters long.' 
          } 
        };
      }
      if (error.message.includes('Invalid email')) {
        return { 
          error: { 
            message: 'Please enter a valid email address.' 
          } 
        };
      }
      return { error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred during sign up. Please try again.' 
      } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: { 
            message: 'Invalid email or password. Please check your credentials and try again.' 
          } 
        };
      }
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: { 
            message: 'Please check your email and click the confirmation link before signing in.' 
          } 
        };
      }
      return { error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred during sign in. Please try again.' 
      } 
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      if (error.message.includes('Invalid email')) {
        return { 
          error: { 
            message: 'Please enter a valid email address.' 
          } 
        };
      }
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred. Please try again.' 
      } 
    };
  }
};
