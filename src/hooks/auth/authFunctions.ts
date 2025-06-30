
import { supabase } from '@/integrations/supabase/client';

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
