
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer = ({ children }: DashboardContainerProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Mobile trigger - always visible on small screens */}
        <header className="fixed top-0 left-0 z-50 md:hidden">
          <SidebarTrigger className="m-2" />
        </header>
        <AppSidebar />
        <SidebarInset className="flex-1 pt-12 md:pt-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardContainer;
