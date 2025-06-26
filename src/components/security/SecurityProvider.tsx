
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useAuth } from '@/hooks/useAuth';

interface SecurityContextType {
  logSecurityAction: (action: string, resourceType: string, resourceId?: string, details?: Record<string, any>) => Promise<void>;
  validateInput: (input: string, context: string) => boolean;
  trackValidationError: (field: string, error: string, data: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const { logSecurityAction, validateInput, trackValidationError } = useSecurityAudit();
  const { user, isAdmin } = useAuth();

  // Log significant security events
  useEffect(() => {
    if (user) {
      logSecurityAction('user_session_start', 'authentication', user.id, {
        email: user.email,
        isAdmin
      });
    }

    // Cleanup function to log session end
    return () => {
      if (user) {
        logSecurityAction('user_session_end', 'authentication', user.id);
      }
    };
  }, [user?.id, isAdmin]);

  // Monitor for tab/window focus changes (potential security concern)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && user && isAdmin) {
        logSecurityAction('admin_tab_hidden', 'session_management', user.id, {
          timestamp: new Date().toISOString()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, isAdmin]);

  const value: SecurityContextType = {
    logSecurityAction,
    validateInput,
    trackValidationError
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
