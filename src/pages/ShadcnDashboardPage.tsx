import React, { useState } from 'react';
import { Sidebar, DashboardView } from '../components/dashboard/Sidebar';
import { TopNavbar } from '../components/dashboard/TopNavbar';
import { MetricCards } from '../components/dashboard/MetricCards';
import { OverviewCharts } from '../components/dashboard/OverviewCharts';
import { DataTableSection } from '../components/dashboard/DataTableSection';
import { AnalyticsView } from '../components/dashboard/AnalyticsView';
import { CustomersView } from '../components/dashboard/CustomersView';
import { ReportsView } from '../components/dashboard/ReportsView';
import { NotificationsView } from '../components/dashboard/NotificationsView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { DateRangePreset } from '../components/ui/date-range-picker';
import { useToast } from '../components/ui/toast-provider';
import { cn } from '../lib/utils';

export const ShadcnDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tab value matches view or allows tab-switching within overview
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Dashboard metrics refreshed', 'Latest telemetry synced with server state', 'success');
    }, 800);
  };

  const handleDownloadCSV = () => {
    // Generate sample CSV of top metrics
    const csvContent =
      'Metric,Current Value,Growth Rate,Benchmark Period\n' +
      'Total Revenue,$45231.89,+20.1%,Last Month\n' +
      'Subscriptions,2350,+180.1%,Last Month\n' +
      'Sales Volume,12234,+19.0%,Last Month\n' +
      'Active Sessions,573,+201,Last Hour\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dashboard_metrics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Dashboard metrics downloaded', 'CSV report saved to your computer', 'success');
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-950 dark:text-zinc-50 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          if (['overview', 'analytics', 'reports', 'notifications'].includes(v)) {
            setActiveTab(v);
          }
        }}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area - scrolls independently with fixed sidebar */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          collapsed ? 'md:ml-16' : 'md:ml-60'
        )}
      >
        <TopNavbar
          currentView={currentView}
          onOpenMobile={() => setMobileOpen(true)}
          selectedDatePreset={datePreset}
          onSelectDatePreset={(preset) => {
            setDatePreset(preset);
            showToast(`Time period updated to ${preset.toUpperCase()}`, undefined, 'info');
          }}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onDownloadCSV={handleDownloadCSV}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Tabs Switcher */}
          {currentView === 'overview' && (
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  if (val !== 'overview') {
                    setCurrentView(val as any);
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="integrations" disabled title="Coming in next release">
                    Integrations (Soon)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Render based on current view */}
          {currentView === 'overview' && (
            <div className="space-y-6">
              {/* Metric Summary Cards (4 Cards) */}
              <MetricCards />

              {/* Charts Visualizations (Bar, Line, Pie, Recent Sales) */}
              <OverviewCharts />

              {/* Data Table Section with Sorting, Pagination, and Filter */}
              <DataTableSection />
            </div>
          )}

          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'customers' && <CustomersView />}
          {currentView === 'orders' && <DataTableSection />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'notifications' && <NotificationsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
