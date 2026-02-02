
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full justify-center p-4 md:p-6">
        <header className="fixed top-0 left-0 z-50 md:hidden">
          <SidebarTrigger className="m-4" />
        </header>
        <div className="flex w-full max-w-[calc(1200px+16rem+1.5rem)] gap-0 md:gap-6 mx-auto">
          <AppSidebar />
          <main className="flex-1 min-w-0 w-full max-w-full xl:max-w-[1200px] xl:min-w-[1200px] pt-12 md:pt-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
