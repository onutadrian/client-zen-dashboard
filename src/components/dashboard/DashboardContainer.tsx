
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer = ({ children }: DashboardContainerProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 p-6">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardContainer;
