
import React from 'react';
import { Calendar, Users, BarChart3, Clock, FileText, CreditCard, Settings, Home, Briefcase, UserCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';

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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
