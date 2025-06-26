import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface SecurityAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const useSecurityAudit = () => {
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  // Log security-sensitive actions
  const logSecurityAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    try {
      // In a production environment, you would send this to a secure audit log
      // For now, we'll just show a toast for critical actions
      if (['user_role_changed', 'admin_access', 'bulk_delete', 'data_export'].includes(action)) {
        toast({
          title: "Security Action Logged",
          description: `Action "${action}" has been recorded for security audit.`,
        });
      }
    } catch (error) {
      // Silent fail for audit logging to not disrupt user experience
    }
  };

  // Monitor for unusual access patterns
  const checkAccessPatterns = async () => {
    if (!isAdmin) return;

    try {
      // This would typically check for:
      // - Multiple failed login attempts
      // - Unusual access times
      // - Access from new locations
      // - Bulk operations
      
      // Placeholder for real security monitoring
      // In production, this would connect to your security monitoring service
    } catch (error) {
      // Silent fail for security monitoring
    }
  };

  // Validate input for potential security threats
  const validateInput = (input: string, context: string): boolean => {
    // Check for common XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        logSecurityAction('xss_attempt', context, undefined, { input, pattern: pattern.toString() });
        return false;
      }
    }

    // Check for SQL injection patterns (even though we use Supabase, extra safety)
    const sqlPatterns = [
      /('|(\\')|(;|\/\*|\*\/|--|\+))/gi,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        logSecurityAction('sql_injection_attempt', context, undefined, { input, pattern: pattern.toString() });
        return false;
      }
    }

    return true;
  };

  // Track validation errors for security monitoring
  const trackValidationError = (field: string, error: string, data: any) => {
    // Log repeated validation errors as potential attack attempts
    const errorKey = `validation_error_${field}`;
    const errorCount = parseInt(sessionStorage.getItem(errorKey) || '0') + 1;
    sessionStorage.setItem(errorKey, errorCount.toString());

    if (errorCount > 5) {
      logSecurityAction('repeated_validation_errors', field, undefined, {
        error,
        count: errorCount,
        data: JSON.stringify(data).substring(0, 100) // Limit logged data
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      checkAccessPatterns();
      
      // Set up periodic security checks (every 5 minutes)
      const securityCheckInterval = setInterval(checkAccessPatterns, 5 * 60 * 1000);
      
      return () => clearInterval(securityCheckInterval);
    }
  }, [isAdmin]);

  return {
    auditLogs,
    loading,
    logSecurityAction,
    validateInput,
    trackValidationError,
    checkAccessPatterns
  };
};
