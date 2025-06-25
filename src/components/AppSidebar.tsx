
import React from 'react';
import { Calendar, Users, BarChart3, Clock, FileText, CreditCard, Settings, Home, Briefcase, UserCheck } from "lucide-react";
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
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from '@/components/LogoutButton';

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ['admin', 'standard']
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Briefcase,
    roles: ['admin'] // Only admin can see projects (financial data)
  },
  {
    title: "Clients",
    url: "/clients",
    icon: UserCheck,
    roles: ['admin']
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: ['admin']
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: "Time Tracking",
    url: "/time-tracking",
    icon: Clock,
    roles: ['admin']
  },
  {
    title: "Invoices",
    url: "/invoices",
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
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ['admin', 'standard']
  },
];

export default function AppSidebar() {
  const { profile } = useAuth();
  const location = useLocation();
  const userRole = profile?.role || 'standard';

  const filteredItems = items.filter(item => item.roles.includes(userRole));

  return (
    <Sidebar>
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
          <div className="text-sm text-sidebar-foreground/70">
            Signed in as: {profile?.email || 'Loading...'}
          </div>
          <div className="text-xs text-sidebar-foreground/50">
            Role: {profile?.role || 'Loading...'}
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
