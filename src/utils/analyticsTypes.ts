
export interface Invoice {
  id: number;
  amount: number;
  date: string;
  status: string;
  currency?: string;
}

export interface AnalyticsData {
  totalClients: number;
  activeClients: number;
  totalHours: number;
  totalRevenue: number;
  monthlySubscriptionCost: number;
  totalPaidToDate: number;
  clients: any[];
  timeBreakdown: any[];
  revenueBreakdown: any[];
}

export interface AnalyticsParams {
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
