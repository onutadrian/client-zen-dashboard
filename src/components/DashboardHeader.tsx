
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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Dashboard</h1>
        <p className="text-slate-600">Manage your clients, track work, and monitor revenue</p>
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
        <Button onClick={onAddClient} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
        <Button onClick={onAddSubscription} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
