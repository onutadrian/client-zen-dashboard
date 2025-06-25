
import React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const TimeTrackingPage = () => {
  const { isMobile } = useSidebar();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          {isMobile && <SidebarTrigger />}
          <h1 className="text-3xl font-bold text-slate-800">Time Tracking</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-600">Time tracking features coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingPage;
