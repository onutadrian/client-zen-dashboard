
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
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
  const { user, isAdmin } = useAuth();

  const logSecurityAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    // In production, this would send to a secure audit service
    if (['user_role_changed', 'admin_access', 'bulk_delete', 'data_export'].includes(action)) {
      console.warn(`Security Action: ${action} on ${resourceType}`, { resourceId, details });
    }
  };

  const validateInput = (input: string, context: string): boolean => {
    // Enhanced XSS validation patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /vbscript:/gi,
      /data:text\/html/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        logSecurityAction('xss_attempt', context, undefined, { 
          input: input.substring(0, 100) // Only log first 100 chars for security
        });
        return false;
      }
    }

    // Enhanced SQL injection patterns
    const sqlPatterns = [
      /('|(\\')|(;|\/\*|\*\/|--|\+))/gi,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi,
      /(or|and)\s+\d+\s*=\s*\d+/gi,
      /'\s*(or|and)\s*'[^']*'/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        logSecurityAction('sql_injection_attempt', context, undefined, { 
          input: input.substring(0, 100)
        });
        return false;
      }
    }

    // Check for path traversal attempts
    const pathTraversalPatterns = [
      /\.\.[\/\\]/gi,
      /[\/\\]etc[\/\\]/gi,
      /[\/\\]proc[\/\\]/gi
    ];

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(input)) {
        logSecurityAction('path_traversal_attempt', context, undefined, { 
          input: input.substring(0, 100)
        });
        return false;
      }
    }

    return true;
  };

  const trackValidationError = (field: string, error: string, data: any) => {
    const errorKey = `validation_error_${field}`;
    const errorCount = parseInt(sessionStorage.getItem(errorKey) || '0') + 1;
    sessionStorage.setItem(errorKey, errorCount.toString());

    if (errorCount > 5) {
      logSecurityAction('repeated_validation_errors', field, undefined, {
        error,
        count: errorCount
      });
    }
  };

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
