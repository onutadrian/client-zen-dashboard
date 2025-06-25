
import React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

const SettingsPage = () => {
  const { isMobile } = useSidebar();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          {isMobile && <SidebarTrigger />}
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-600">Settings page coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
