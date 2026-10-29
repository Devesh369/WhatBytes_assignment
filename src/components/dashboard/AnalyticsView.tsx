import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Globe, TrendingUp, Zap, Users, ArrowUpRight } from 'lucide-react';

const retentionData = [
  { week: 'W1', CohortA: 100, CohortB: 100, CohortC: 100 },
  { week: 'W2', CohortA: 82, CohortB: 78, CohortC: 85 },
  { week: 'W3', CohortA: 68, CohortB: 64, CohortC: 74 },
  { week: 'W4', CohortA: 59, CohortB: 54, CohortC: 68 },
  { week: 'W5', CohortA: 54, CohortB: 49, CohortC: 62 },
  { week: 'W6', CohortA: 51, CohortB: 46, CohortC: 59 },
];

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 3 Metric Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-zinc-500">Average Session Duration</CardTitle>
            <ClockIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">4m 32s</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <ArrowUpRight className="w-3 h-3" /> +12.4% vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-zinc-500">Bounce Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">28.4%</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <ArrowUpRight className="w-3 h-3" /> -3.2% (improved)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-zinc-500">Net Promoter Score (NPS)</CardTitle>
            <Zap className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">+72</div>
            <p className="text-xs text-zinc-500 mt-1">Based on 1,420 user ratings</p>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Retention Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
          <CardDescription>Percentage of weekly active subscribers returning over 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="week" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fafafa',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val}%`, 'Retention']}
                />
                <Line type="monotone" dataKey="CohortC" stroke="#10b981" strokeWidth={2.5} name="Oct Cohort" />
                <Line type="monotone" dataKey="CohortA" stroke="#4f46e5" strokeWidth={2} name="Sep Cohort" />
                <Line type="monotone" dataKey="CohortB" stroke="#94a3b8" strokeWidth={1.5} name="Aug Cohort" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Top Traffic Regions
            </CardTitle>
            <CardDescription>Visitors classified by primary geography</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span>United States</span>
              <span className="font-mono font-semibold">44.8% (12,400)</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[45%]" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span>European Union</span>
              <span className="font-mono font-semibold">28.2% (7,800)</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[28%]" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span>Asia-Pacific</span>
              <span className="font-mono font-semibold">18.5% (5,120)</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full w-[19%]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Device &amp; Browser Share
            </CardTitle>
            <CardDescription>Platform sessions across desktop and mobile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span>Chrome / Chromium Desktop</span>
              <span className="font-mono font-semibold">58.4%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[58%]" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span>Safari (iOS / macOS)</span>
              <span className="font-mono font-semibold">27.1%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[27%]" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span>Firefox &amp; Other</span>
              <span className="font-mono font-semibold">14.5%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[15%]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
