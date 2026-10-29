import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Building2,
  Lock,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';

export type DashboardView =
  | 'overview'
  | 'analytics'
  | 'customers'
  | 'orders'
  | 'reports'
  | 'notifications'
  | 'settings';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders & Sales', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: '3' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: DashboardView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const handleAuthPortalClick = () => {
    router.push('/dashboard');
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3">
      {/* Top Header / Brand */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden text-left">
                <span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  Acme Analytics
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  Enterprise v2.4
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
              Dashboard
            </div>
          )}

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.2 rounded-md',
                      isActive
                        ? 'bg-zinc-700 dark:bg-zinc-300 text-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Auth Suite Link */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={handleAuthPortalClick}
            className={cn(
              'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors',
              collapsed && 'justify-center px-2'
            )}
            title="Switch to WhatBytes Custom Auth Hooks Suite"
          >
            <Lock className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="flex-1 text-left truncate">Auth Hooks Suite</span>}
          </button>
        </div>
      </div>

      {/* Bottom Profile Info */}
      <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3">
        <div
          className={cn(
            'flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors',
            collapsed && 'justify-center p-1'
          )}
        >
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivers'}
              alt={user?.name || 'User'}
            />
            <AvatarFallback>{(user?.name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 overflow-hidden text-left">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name || 'Alex Rivers'}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {user?.email || 'alex@whatbytes.com'}
              </div>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              onClick={() => logout()}
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed inset-y-0 left-0 z-30 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer / Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
