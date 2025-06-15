import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
interface DashboardHeaderProps {
  displayCurrency: string;
  onCurrencyChange: (currency: string) => void;
  onAddClient: () => void;
  onAddSubscription: () => void;
}
const DashboardHeader = ({
  displayCurrency,
  onCurrencyChange,
  onAddClient,
  onAddSubscription
}: DashboardHeaderProps) => {
  return <div className="flex items-center justify-between">
      <div>
        <h1 className="text-slate-900 mb-2 font-extrabold text-7xl">OCDASH</h1>
        <p className="text-slate-600 text-base font-medium">Clients, documents &amp; tasks, and revenue.</p>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Currency:</span>
          <Select value={displayCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="RON">Romanian Lei (RON)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddClient} className="text-base bg-zinc-900 hover:bg-zinc-800 rounded-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
        <Button onClick={onAddSubscription} variant="outline" className="rounded-sm bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>;
};
export default DashboardHeader;