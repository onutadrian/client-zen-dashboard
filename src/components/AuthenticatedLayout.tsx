
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Mobile trigger - always visible */}
        <header className="fixed top-0 left-0 z-50 lg:hidden">
          <SidebarTrigger className="m-2" />
        </header>
        
        <AppSidebar />
        <main className="flex-1 lg:ml-0 pt-12 lg:pt-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
