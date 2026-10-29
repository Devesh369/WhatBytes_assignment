import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/toast-provider';
import {
  ArrowUpDown,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
} from 'lucide-react';

export interface OrderRecord {
  id: string;
  customer: string;
  email: string;
  status: 'paid' | 'pending' | 'refunded' | 'failed';
  date: string;
  amount: number;
  method: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  { id: 'ORD-7821', customer: 'Liam Johnson', email: 'liam@example.com', status: 'paid', date: '2026-10-28', amount: 250.0, method: 'Visa •••• 4242' },
  { id: 'ORD-7820', customer: 'Emma Garcia', email: 'emma.g@corp.io', status: 'pending', date: '2026-10-28', amount: 120.5, method: 'Mastercard •••• 5555' },
  { id: 'ORD-7819', customer: 'Noah Smith', email: 'noah@smith.dev', status: 'paid', date: '2026-10-27', amount: 450.0, method: 'Stripe Pay' },
  { id: 'ORD-7818', customer: 'Sophia Brown', email: 'sophia@acme.com', status: 'refunded', date: '2026-10-26', amount: 99.0, method: 'Apple Pay' },
  { id: 'ORD-7817', customer: 'James Wilson', email: 'j.wilson@tech.co', status: 'paid', date: '2026-10-26', amount: 890.0, method: 'Amex •••• 3005' },
  { id: 'ORD-7816', customer: 'Mia Martinez', email: 'mia@design.studio', status: 'failed', date: '2026-10-25', amount: 75.0, method: 'Visa •••• 1234' },
  { id: 'ORD-7815', customer: 'Lucas Taylor', email: 'lucas@ventures.com', status: 'paid', date: '2026-10-25', amount: 1250.0, method: 'Wire Transfer' },
  { id: 'ORD-7814', customer: 'Ava Anderson', email: 'ava@anderson.org', status: 'paid', date: '2026-10-24', amount: 320.0, method: 'Visa •••• 9876' },
  { id: 'ORD-7813', customer: 'Ethan Thomas', email: 'ethan@fintech.net', status: 'pending', date: '2026-10-24', amount: 540.0, method: 'Mastercard •••• 4444' },
  { id: 'ORD-7812', customer: 'Harper White', email: 'harper@cloud.ai', status: 'paid', date: '2026-10-23', amount: 2100.0, method: 'Stripe Pay' },
];

export const DataTableSection: React.FC = () => {
  const { showToast } = useToast();
  const [orders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'refunded' | 'failed'>('all');
  const [sortField, setSortField] = useState<keyof OrderRecord>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSort = (field: keyof OrderRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredOrders, sortField, sortAsc]);

  // Pagination slice
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOrders.slice(start, start + pageSize);
  }, [sortedOrders, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const rows = sortedOrders.filter((o) => selectedIds.includes(o.id));
    if (rows.length === 0) {
      showToast('No rows selected', 'Select at least one order to export', 'error');
      return;
    }
    const csvContent =
      'Order ID,Customer,Email,Status,Date,Amount,Payment Method\n' +
      rows
        .map((r) => `${r.id},"${r.customer}",${r.email},${r.status},${r.date},${r.amount},"${r.method}"`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${rows.length} orders to CSV`, undefined, 'success');
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success" className="gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="gap-1 font-medium">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="secondary" className="gap-1 font-medium">
            <RotateCcw className="w-3 h-3 text-zinc-500" /> Refunded
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1 font-medium">
            <XCircle className="w-3 h-3 text-rose-600" /> Failed
          </Badge>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Manage and view recent orders, billing statuses, and customer charges.
          </CardDescription>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-44 sm:w-56">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Filter customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          {/* Export Selected Button */}
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelected}
              className="h-8 gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export ({selectedIds.length})</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-zinc-50/60 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="w-12 text-center">
                <input
                  type="checkbox"
                  checked={
                    paginatedOrders.length > 0 &&
                    paginatedOrders.every((o) => selectedIds.includes(o.id))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('customer')}>
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </TableHead>
              <TableHead className="w-12 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-zinc-500">
                  No orders match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <TableRow key={order.id} data-state={isSelected ? 'selected' : undefined}>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(order.id)}
                        className="rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-zinc-900 dark:text-zinc-100 font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {order.customer}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {order.email}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-mono text-zinc-500 dark:text-zinc-400">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Order details for ${order.id}`, `Customer: ${order.customer} · Amount: $${order.amount.toFixed(2)}`, 'info')
                        }
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="View Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            Showing{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {sortedOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {Math.min(currentPage * pageSize, sortedOrders.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {sortedOrders.length}
            </span>{' '}
            orders
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2 border-zinc-200 dark:border-zinc-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-7 w-7 rounded-md font-mono text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                      : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 px-2 border-zinc-200 dark:border-zinc-800"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
