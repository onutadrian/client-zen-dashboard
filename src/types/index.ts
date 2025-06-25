
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  client_id: number;
  client_name: string;
  project_id: string;
  user_id?: string;
  estimated_hours?: number;
  worked_hours?: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
  completed_date?: string;
  created_date: string;
  notes?: string;
  assets?: string[];
}

export interface Project {
  id: string;
  name: string;
  client_id: number;
  user_id?: string;
  status: 'active' | 'completed' | 'archived';
  pricing_type: 'fixed' | 'hourly' | 'daily';
  fixed_price?: number;
  hourly_rate?: number;
  daily_rate?: number;
  currency: string;
  estimated_hours?: number;
  start_date: string;
  estimated_end_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
  team?: string[];
  documents?: string[];
  notes?: string;
  invoices?: any[];
}

export interface Client {
  id: number;
  name: string;
  user_id?: string;
  status: 'active' | 'inactive';
  price_type: string;
  price: number;
  currency?: string;
  created_at: string;
  updated_at: string;
  people?: any[];
  documents?: string[];
  invoices?: any[];
  links?: string[];
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  user_id: string;
  status: 'pending' | 'in-progress' | 'completed';
  target_date: string;
  amount?: number;
  currency?: string;
  estimated_hours?: number;
  completion_percentage?: number;
  created_at: string;
  updated_at: string;
}
