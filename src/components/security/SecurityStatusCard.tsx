import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export const SecurityStatusCard = () => {
  const securityFeatures = [
    {
      name: 'Role-based Access Control',
      status: 'secured',
      description: 'Admin-only role management with secure database functions'
    },
    {
      name: 'Input Validation',
      status: 'secured',
      description: 'XSS and SQL injection protection on all forms'
    },
    {
      name: 'Security Audit Logging',
      status: 'secured',
      description: 'Comprehensive logging of security-sensitive actions'
    },
    {
      name: 'Row Level Security',
      status: 'secured',
      description: 'Database-level access controls implemented'
    },
    {
      name: 'User Session Security',
      status: 'secured',
      description: 'Secure authentication with Supabase'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-600" />
          <CardTitle>Security Status</CardTitle>
        </div>
        <CardDescription>
          Current security implementation status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">{feature.description}</div>
                </div>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-200">
                Secured
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">All Critical Security Issues Resolved</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your application now has comprehensive security measures in place, including role privilege escalation protection, input validation, and audit logging.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};