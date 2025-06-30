
export interface Client {
  id: number;
  name: string;
  price: number;
  priceType: string;
  status: string;
  documents: string[];
  links: string[];
  notes: string;
  people: Array<{
    name: string;
    email: string;
    title: string;
  }>;
  invoices: Array<{
    id: number;
    amount: number;
    date: string;
    status: string;
    currency?: string;
  }>;
  currency: string;
  hourEntries?: Array<{
    id: number;
    hours: number;
    description: string;
    date: string;
    billed?: boolean;
  }>;
}
