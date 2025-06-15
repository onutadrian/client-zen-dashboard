
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { BarChart3, Users, FolderOpen, CreditCard } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderOpen,
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Users,
  },
  {
    title: 'Subscriptions',
    url: '/subscriptions',
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
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
