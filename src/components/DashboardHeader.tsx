import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface DashboardHeaderProps {
  displayCurrency: string;
  onCurrencyChange: (currency: string) => void;
}
const DashboardHeader = ({
  displayCurrency,
  onCurrencyChange
}: DashboardHeaderProps) => {
  return <div className="flex items-center justify-between">
      <div>
        <h1 className="text-slate-900 mb-2 font-extrabold text-7xl">OCDASH</h1>
        <p className="text-slate-600 text-base font-medium">Clients, documents & tasks, and revenue.</p>
      </div>
      
    </div>;
};
export default DashboardHeader;