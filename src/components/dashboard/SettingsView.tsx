import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/toast-provider';
import { Building2, Key, Shield, CreditCard, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [billingEmail, setBillingEmail] = useState('billing@acmecorp.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings saved successfully', undefined, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>Configure workspace settings and primary company identity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Organization Name
              </label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Billing Contact Email
              </label>
              <Input value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" className="gap-1.5 text-xs">
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Subscription Tier</CardTitle>
            <CardDescription>Your plan renews automatically on November 15, 2026</CardDescription>
          </div>
          <Badge variant="default" className="text-xs">Enterprise Plan</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-zinc-500">Monthly Billing:</div>
              <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">$2,400.00 / mo</div>
            </div>
            <div>
              <div className="text-zinc-500">Seats Allocated:</div>
              <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">48 / 50 Active</div>
            </div>
            <div>
              <div className="text-zinc-500">API Throughput:</div>
              <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">10,000 req/s</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
