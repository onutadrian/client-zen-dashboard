import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface SecurityAuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
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
      // Enhanced logging for critical actions using the secure function
      const criticalActions = [
        'user_role_changed',
        'admin_access',
        'bulk_delete',
        'data_export',
        'login_attempt',
        'failed_login',
        'password_reset'
      ];

      if (criticalActions.includes(action)) {
        // Use the secure logging function
        const { error } = await supabase.rpc('log_security_action', {
          p_action: action,
          p_resource_type: resourceType,
          p_resource_id: resourceId,
          p_details: details || {}
        });

        if (error) {
          console.error('Failed to log security action:', error);
        }

        // Show toast for high-priority security events
        if (['user_role_changed', 'failed_login'].includes(action)) {
          toast({
            title: "Security Action Logged",
            description: `Action: ${action}`,
            variant: action.includes('failed') ? "destructive" : "default",
          });
        }
      }
    } catch (error) {
      console.error('Security logging error:', error);
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
          input: input.substring(0, 100), // Log first 100 chars only
          pattern: pattern.toString()
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
          input: input.substring(0, 100),
          pattern: pattern.toString()
        });
        return false;
      }
    }

    // Check for suspicious file paths
    const pathTraversalPatterns = [
      /\.\.[\/\\]/gi,
      /[\/\\]etc[\/\\]/gi,
      /[\/\\]proc[\/\\]/gi,
      /[\/\\]sys[\/\\]/gi
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

  // Track validation errors for security monitoring
  const trackValidationError = (field: string, error: string, data: any) => {
    const errorKey = `validation_error_${field}`;
    const errorCount = parseInt(sessionStorage.getItem(errorKey) || '0') + 1;
    sessionStorage.setItem(errorKey, errorCount.toString());

    // Log repeated validation errors as potential attacks
    if (errorCount > 5) {
      logSecurityAction('repeated_validation_errors', field, undefined, {
        error: error.substring(0, 200), // Truncate error message
        count: errorCount,
        context: 'form_validation'
      });
    }

    // Clear the counter after 1 hour
    setTimeout(() => {
      sessionStorage.removeItem(errorKey);
    }, 3600000);
  };

  // Fetch audit logs for admins
  const fetchAuditLogs = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs((data || []).map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        resource_type: log.resource_type,
        resource_id: log.resource_id,
        details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details || {},
        ip_address: log.ip_address as string | null,
        user_agent: log.user_agent as string | null,
        created_at: log.created_at
      })));
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
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
    checkAccessPatterns,
    fetchAuditLogs
  };
};
