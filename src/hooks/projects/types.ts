
export interface Project {
  id: string;
  name: string;
  clientId: number;
  startDate: string;
  estimatedEndDate: string;
  endDate?: string;
  status: string;
  notes: string;
  documents: string[];
  team: string[];
  archived: boolean;
  pricingType: 'fixed' | 'hourly' | 'daily';
  fixedPrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  estimatedHours?: number;
  currency: string;
  invoices: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
    description?: string;
  }>;
}
