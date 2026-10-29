import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/toast-provider';
import { FileText, Download, CheckCircle2, Clock } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();

  const reports = [
    { id: 'REP-2026-Q3', title: 'Q3 Financial & Revenue Statement', date: 'Oct 01, 2026', size: '2.4 MB', type: 'PDF' },
    { id: 'REP-2026-SEP', title: 'September Churn & Customer Acquisition Audit', date: 'Sep 30, 2026', size: '1.8 MB', type: 'CSV' },
    { id: 'REP-2026-TAX', title: 'Fiscal Year 2026 Preliminary Tax Ledger', date: 'Sep 15, 2026', size: '4.2 MB', type: 'PDF' },
    { id: 'REP-2026-SEC', title: 'SOC-2 Compliance & Access Governance Log', date: 'Aug 28, 2026', size: '920 KB', type: 'PDF' },
  ];

  const handleDownload = (title: string) => {
    showToast(`Downloading ${title}`, 'The report export will download shortly.', 'success');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generated Financial &amp; Governance Reports</CardTitle>
          <CardDescription>Export board-ready financial summaries and operational audit records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{r.title}</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {r.id} · Generated on {r.date} · {r.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{r.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(r.title)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
