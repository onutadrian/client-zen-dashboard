import React, { useEffect } from 'react';
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
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, FolderOpen, CreditCard, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/LogoutButton';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { displayCurrency, updateCurrency } = useCurrency();
  const { isAdmin } = useAuth();

  // Auto-close sidebar on navigation for mobile
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        url: '/',
        icon: BarChart3,
        showFor: ['admin', 'standard'],
      },
      {
        title: 'Projects',
        url: '/projects',
        icon: FolderOpen,
        showFor: ['admin', 'standard'],
      },
      {
        title: 'Clients',
        url: '/clients',
        icon: Users,
        showFor: ['admin'],
      },
      {
        title: 'Subscriptions',
        url: '/subscriptions',
        icon: CreditCard,
        showFor: ['admin'],
      },
      {
        title: 'Invite Manager',
        url: '/invite-manager',
        icon: UserPlus,
        showFor: ['admin'],
      },
    ];

    return baseItems.filter(item => 
      item.showFor.includes(isAdmin ? 'admin' : 'standard')
    );
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 group-data-[collapsible=icon]:hidden">Dashboard</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-6 w-6 group-data-[collapsible=icon]:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
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
      <SidebarFooter className="p-4 space-y-4">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-600 font-medium">Currency</span>
            <Select value={displayCurrency} onValueChange={updateCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="RON">Romanian Lei (RON)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}