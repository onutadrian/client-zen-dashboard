import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { format } from 'date-fns';
import { Shield, AlertTriangle, User, Database } from 'lucide-react';

export const SecurityAuditDashboard = () => {
  const { isAdmin } = useAuth();
  const { auditLogs, loading, fetchAuditLogs } = useSecurityAudit();

  useEffect(() => {
    if (isAdmin) {
      fetchAuditLogs();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Access denied. Admin privileges required.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActionIcon = (action: string) => {
    if (action.includes('role')) return <User className="h-4 w-4" />;
    if (action.includes('attempt') || action.includes('failed')) return <AlertTriangle className="h-4 w-4" />;
    return <Database className="h-4 w-4" />;
  };

  const getActionBadge = (action: string) => {
    if (action.includes('failed') || action.includes('attempt')) {
      return <Badge variant="destructive">Security Alert</Badge>;
    }
    if (action.includes('role') || action.includes('admin')) {
      return <Badge variant="secondary">Admin Action</Badge>;
    }
    return <Badge variant="outline">System Event</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Security Audit Dashboard</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Monitor system security events and administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No security events recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.action}</span>
                      {getActionBadge(log.action)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Resource: {log.resource_type}
                      {log.resource_id && ` (ID: ${log.resource_id})`}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-xs bg-muted p-2 rounded">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'PPpp')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};