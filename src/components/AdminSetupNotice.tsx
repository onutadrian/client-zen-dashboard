
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

interface AdminSetupNoticeProps {
  onRefresh: () => void;
}

const AdminSetupNotice = ({ onRefresh }: AdminSetupNoticeProps) => {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Admin Setup Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Your account has been configured with admin privileges. Please refresh the page to access all admin features.
        </p>
        <Button onClick={onRefresh} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSetupNotice;
