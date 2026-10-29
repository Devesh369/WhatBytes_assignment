import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useToast } from '../ui/toast-provider';
import { Search, UserPlus, Mail, ShieldCheck, MoreHorizontal } from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  plan: 'Enterprise' | 'Team Pro' | 'Starter';
  spent: number;
  joined: string;
}

const CUSTOMERS: CustomerItem[] = [
  { id: 'CUST-01', name: 'Alex Rivers', email: 'alex@whatbytes.com', role: 'Owner', plan: 'Enterprise', spent: 12450.0, joined: 'Jan 15, 2026' },
  { id: 'CUST-02', name: 'Sarah Jenkins', email: 'sarah@whatbytes.com', role: 'Admin', plan: 'Enterprise', spent: 8900.0, joined: 'Mar 10, 2026' },
  { id: 'CUST-03', name: 'Marcus Vance', email: 'marcus@acmecorp.com', role: 'Member', plan: 'Team Pro', spent: 3400.0, joined: 'Apr 22, 2026' },
  { id: 'CUST-04', name: 'Elena Rostova', email: 'elena@vanguard.io', role: 'Admin', plan: 'Enterprise', spent: 15600.0, joined: 'Feb 05, 2026' },
  { id: 'CUST-05', name: 'Derrick Chen', email: 'derrick@fintech.net', role: 'Member', plan: 'Team Pro', spent: 2800.0, joined: 'Jun 18, 2026' },
  { id: 'CUST-06', name: 'Aaliyah Patel', email: 'aaliyah@biotech.org', role: 'Viewer', plan: 'Starter', spent: 650.0, joined: 'Aug 09, 2026' },
];

export const CustomersView: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>View all customer accounts, subscribed tiers, and lifetime value</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
            </div>
            <Button
              size="sm"
              onClick={() => showToast('Invite modal triggered', 'Customer invitation sent to team queue', 'info')}
              className="h-8 gap-1.5 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/60 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Workspace Role</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
                <TableHead className="w-12 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} />
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{c.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.role === 'Owner' ? 'default' : 'secondary'}>
                      {c.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.plan}</span>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500">{c.joined}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    ${c.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => showToast(`Customer Details: ${c.name}`, `Lifetime LTV: $${c.spent.toFixed(2)}`, 'info')}
                      className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
