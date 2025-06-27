import React from 'react';
import { Home, Briefcase, UserCheck, Users, CreditCard, FileText } from "lucide-react";
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
  const { profile } = useAuth();
  const { displayCurrency, updateCurrency } = useCurrency();
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
            Role: {profile?.role || 'Loading...'}
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
