import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Monthly Revenue Bar Chart Data
const monthlyData = [
  { name: 'Jan', total: 2400, expenses: 1400 },
  { name: 'Feb', total: 1398, expenses: 980 },
  { name: 'Mar', total: 4800, expenses: 2200 },
  { name: 'Apr', total: 3908, expenses: 1800 },
  { name: 'May', total: 4800, expenses: 2100 },
  { name: 'Jun', total: 5800, expenses: 2600 },
  { name: 'Jul', total: 4300, expenses: 2000 },
  { name: 'Aug', total: 6490, expenses: 2800 },
  { name: 'Sep', total: 5300, expenses: 2400 },
  { name: 'Oct', total: 7200, expenses: 3100 },
  { name: 'Nov', total: 6800, expenses: 2900 },
  { name: 'Dec', total: 8400, expenses: 3400 },
];

// Traffic Trends Area Data
const trafficData = [
  { day: 'Mon', visitors: 1240, signups: 140 },
  { day: 'Tue', visitors: 1980, signups: 210 },
  { day: 'Wed', visitors: 2400, signups: 290 },
  { day: 'Thu', visitors: 2890, signups: 340 },
  { day: 'Fri', visitors: 3200, signups: 410 },
  { day: 'Sat', visitors: 2100, signups: 190 },
  { day: 'Sun', visitors: 2450, signups: 260 },
];

// Category Breakdown Pie Data
const categoryData = [
  { name: 'Enterprise SaaS', value: 45, color: '#18181b' },
  { name: 'Team Workspace', value: 30, color: '#4f46e5' },
  { name: 'Starter Pro', value: 18, color: '#0ea5e9' },
  { name: 'API Addons', value: 7, color: '#10b981' },
];

// Recent Sales Mock Data
const recentSales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
  },
];

export const OverviewCharts: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Primary Split: Bar Chart & Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Bar Chart */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly net revenue vs operational expenses ($)</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-300 dark:bg-zinc-700" />
                Expenses
              </span>
            </div>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fafafa',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`$${value}`, '']}
                  />
                  <Bar dataKey="total" fill="currentColor" className="fill-zinc-900 dark:fill-zinc-100" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="currentColor" className="fill-zinc-300 dark:fill-zinc-700" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={sale.avatar} alt={sale.name} />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-medium leading-none text-zinc-900 dark:text-zinc-100">
                        {sale.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{sale.email}</p>
                    </div>
                  </div>
                  <div className="font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Split: Area Chart (Traffic) & Donut Chart (Categories) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Line / Area Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Acquisition Funnel</CardTitle>
            <CardDescription>Active visitors converted into new subscribers</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pt-2">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fafafa',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGrad)" />
                  <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#signupsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie / Donut Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Share of revenue across product tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[170px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fafafa',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-600 dark:text-zinc-400 truncate">{item.name}</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
