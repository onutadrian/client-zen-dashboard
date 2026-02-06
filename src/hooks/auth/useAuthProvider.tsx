
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, AuthContextType } from '@/types/auth';
import { fetchUserProfile, cleanupAuthState, performSignOut } from './authUtils';

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
  const profileChannelUserId = useRef<string | null>(null);

  useEffect(() => {
    let profileChannel: ReturnType<typeof supabase.channel> | null = null;

    const setupProfileChannel = async (userId: string, accessToken?: string | null) => {
      if (profileChannelUserId.current === userId && profileChannel) {
        return;
      }
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
        profileChannel = null;
      }
      if (!accessToken) {
        return;
      }
      if (import.meta.env.VITE_DISABLE_REALTIME === 'true') {
        return;
      }
      profileChannelUserId.current = userId;
      try {
        await supabase.realtime.setAuth(accessToken);
      } catch (error) {
        console.warn('Realtime setAuth error:', error);
      }
      profileChannel = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          (payload) => {
            if (payload.new) {
              setProfile(payload.new as UserProfile);
            }
          }
        )
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.warn('Realtime channel status:', status);
          }
        });
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Handle token refresh failures and session errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('Token refresh failed - cleaning up auth state');
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching to avoid recursion
        if (session?.user) {
          setupProfileChannel(session.user.id, session.access_token);
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(session.user.id);
              setProfile(userProfile);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              // If profile fetch fails due to auth issues, sign out
              if (error?.message?.includes('auth') || error?.message?.includes('JWT')) {
                console.log('Auth error detected - performing cleanup sign out');
                await performSignOut();
                return;
              }
            }
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
          profileChannelUserId.current = null;
        }

        // Handle authentication events with proper error handling
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setProfile(null);
          profileChannelUserId.current = null;
          // Clean up any remaining auth state
          cleanupAuthState();
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

    // THEN check for existing session with error handling
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('Initial session check:', session?.user?.id);
      
      if (error) {
        console.error('Session check error:', error);
        cleanupAuthState();
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setupProfileChannel(session.user.id, session.access_token);
        try {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching initial profile:', error);
          // If profile fetch fails due to auth issues, clean up
          if (error?.message?.includes('auth') || error?.message?.includes('JWT')) {
            cleanupAuthState();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Session initialization error:', error);
      cleanupAuthState();
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
      profileChannelUserId.current = null;
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Use the enhanced sign out function that handles cleanup
      await performSignOut();
      
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign out.",
        variant: "destructive",
      });
      // Force cleanup anyway
      cleanupAuthState();
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const isAdmin =
    profile?.role === 'admin' ||
    (session?.user?.user_metadata?.role as string | undefined) === 'admin';

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
