
import React from 'react';
import { Home, Briefcase, UserCheck, Users, CreditCard, FileText, Eye, EyeOff } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import LogoutButton from '@/components/LogoutButton';

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ['admin', 'standard']
  },
  {
    title: "Client Dashboard",
    url: "/client",
    icon: Home,
    roles: ['client']
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Briefcase,
    roles: ['admin'] // Only admin can see projects (financial data)
  },
  {
    title: "My Projects",
    url: "/client/projects",
    icon: Briefcase,
    roles: ['client']
  },
  {
    title: "Clients",
    url: "/clients",
    icon: UserCheck,
    roles: ['admin']
  },
  {
    title: "Contract Templates",
    url: "/contracts",
    icon: FileText,
    roles: ['admin']
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: CreditCard,
    roles: ['admin']
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: ['admin']
  }
];

export default function AppSidebar() {
  const { profile, user } = useAuth();
  const { displayCurrency, updateCurrency, demoMode, toggleDemoMode } = useCurrency();
  const location = useLocation();
  const userRole =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined) ??
    'standard';

  const filteredItems = items.filter(item => item.roles.includes(userRole));

  return (
    <Sidebar
      variant="floating"
      collapsible="none"
      className="rounded-lg border border-sidebar-border shadow-sm"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 space-y-3">
          {userRole === 'admin' && (
            <div className="space-y-2">
              <label className="text-xs text-sidebar-foreground/70">Demo Mode</label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="demo-mode"
                  checked={demoMode}
                  onCheckedChange={toggleDemoMode}
                />
                <div className="flex items-center space-x-1">
                  {demoMode ? (
                    <EyeOff className="h-3 w-3 text-sidebar-foreground/70" />
                  ) : (
                    <Eye className="h-3 w-3 text-sidebar-foreground/70" />
                  )}
                  <span className="text-xs text-sidebar-foreground/70">
                    {demoMode ? 'Hide Financials' : 'Show Financials'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs text-sidebar-foreground/70">Currency</label>
            <Select value={displayCurrency} onValueChange={updateCurrency}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="RON">RON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-sidebar-foreground/70">
            Signed in as: {profile?.email || 'Loading...'}
          </div>
          <div className="text-xs text-sidebar-foreground/50">
            Role: {userRole || 'Loading...'}
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
