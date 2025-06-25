
import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCurrency } from '@/hooks/useCurrency';
import { useAnalytics } from '@/hooks/useAnalytics';
import MainContentGrid from '@/components/MainContentGrid';
import DashboardHeader from '@/components/DashboardHeader';
import AnalyticsSection from '@/components/AnalyticsSection';
import AdminSetupNotice from '@/components/AdminSetupNotice';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isMobile } = useSidebar();
  const { loading: authLoading, profile } = useAuth();
  const { isCheckingAdmin, needsAdminSetup, isAdmin } = useAdminCheck();
  const { displayCurrency } = useCurrency();
  const analytics = useAnalytics();

  const handleRefresh = () => {
    window.location.reload();
  };

  if (authLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsAdminSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <AdminSetupNotice onRefresh={handleRefresh} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          </div>
        </div>

        <DashboardHeader />
        
        <AnalyticsSection 
          totalClients={analytics.totalClients}
          activeClients={analytics.activeClients}
          totalHours={analytics.totalHours}
          totalRevenue={analytics.totalRevenue}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
          totalPaidToDate={analytics.totalPaidToDate}
          clients={analytics.clients}
          displayCurrency={analytics.displayCurrency}
          formatCurrency={analytics.formatCurrency}
          timeBreakdown={analytics.timeBreakdown}
          revenueBreakdown={analytics.revenueBreakdown}
        />
        
        <MainContentGrid 
          clients={analytics.clients}
          subscriptions={[]}
          analytics={analytics}
          displayCurrency={analytics.displayCurrency}
          formatCurrency={analytics.formatCurrency}
          totalClients={analytics.totalClients}
          activeClients={analytics.activeClients}
          totalHours={analytics.totalHours}
          totalRevenue={analytics.totalRevenue}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
          totalPaidToDate={analytics.totalPaidToDate}
        />
      </div>
    </div>
  );
};

export default Index;
