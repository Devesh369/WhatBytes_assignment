import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Download,
  RotateCw,
  Menu,
  Check,
  X,
  CreditCard,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DateRangePicker, DateRangePreset } from '../ui/date-range-picker';
import { useToast } from '../ui/toast-provider';
import { cn } from '../../lib/utils';
import { DashboardView } from './Sidebar';

interface TopNavbarProps {
  currentView: DashboardView;
  onOpenMobile: () => void;
  selectedDatePreset: DateRangePreset;
  onSelectDatePreset: (preset: DateRangePreset) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onDownloadCSV: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  onOpenMobile,
  selectedDatePreset,
  onSelectDatePreset,
  onRefresh,
  isRefreshing,
  onDownloadCSV,
}) => {
  const { showToast } = useToast();
  const [isDark, setIsDark] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  // Initialize theme from document or localStorage
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      showToast('Theme switched to Dark mode', undefined, 'info');
    } else {
      document.documentElement.classList.remove('dark');
      showToast('Theme switched to Light mode', undefined, 'info');
    }
  };

  const notifications = [
    {
      id: 'n1',
      title: 'New payment received',
      desc: '$1,999.00 from Stripe Enterprise customer',
      time: '4m ago',
      icon: <CreditCard className="w-3.5 h-3.5 text-emerald-600" />,
      unread: true,
    },
    {
      id: 'n2',
      title: 'New team member invited',
      desc: 'sarah@whatbytes.com joined engineering',
      time: '1h ago',
      icon: <UserPlus className="w-3.5 h-3.5 text-indigo-600" />,
      unread: true,
    },
    {
      id: 'n3',
      title: 'Monthly report ready',
      desc: 'October Revenue analytics generated successfully',
      time: '3h ago',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
      unread: true,
    },
  ];

  const viewTitles: Record<DashboardView, string> = {
    overview: 'Executive Dashboard',
    analytics: 'Performance Analytics',
    customers: 'Customer Directory',
    orders: 'Orders & Transactions',
    reports: 'Financial Reports',
    notifications: 'Activity Center',
    settings: 'Organization Settings',
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile hamburger & View title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobile}
            className="md:hidden h-8 w-8 text-zinc-600 dark:text-zinc-300"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {viewTitles[currentView]}
            </h1>
          </div>
        </div>

        {/* Center / Right: Search, Filter, Actions, Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:block w-56">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search metrics, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            selectedPreset={selectedDatePreset}
            onSelectPreset={onSelectDatePreset}
            className="hidden sm:inline-block"
          />

          {/* Download CSV button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadCSV}
            className="h-8 gap-1.5 text-xs border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hidden sm:inline-flex"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </Button>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="Refresh dashboard data"
          >
            <RotateCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-indigo-600')} />
          </Button>

          {/* Notifications Popover */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              className="h-8 w-8 relative border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Notifications
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-start gap-2.5 text-xs">
                      <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 mt-0.5 shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {item.desc}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
