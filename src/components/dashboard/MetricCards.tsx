import React from 'react';
import { DollarSign, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: React.ReactNode;
}

interface MetricCardsProps {
  data?: MetricCardData[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ data }) => {
  const defaultMetrics: MetricCardData[] = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      isPositive: true,
      subtext: 'from last month',
      icon: <DollarSign className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />,
    },
    {
      title: 'Subscriptions',
      value: '+2,350',
      change: '+180.1%',
      isPositive: true,
      subtext: 'from last month',
      icon: <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />,
    },
    {
      title: 'Sales Volume',
      value: '+12,234',
      change: '+19.0%',
      isPositive: true,
      subtext: 'from last month',
      icon: <CreditCard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />,
    },
    {
      title: 'Active Now',
      value: '+573',
      change: '+201',
      isPositive: true,
      subtext: 'since last hour',
      icon: <Activity className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />,
    },
  ];

  const metrics = data || defaultMetrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {metric.title}
            </CardTitle>
            <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono tabular-nums">
              {metric.value}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span
                className={cn(
                  'inline-flex items-center font-medium font-mono text-[11px]',
                  metric.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {metric.change}
              </span>
              <span>{metric.subtext}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
