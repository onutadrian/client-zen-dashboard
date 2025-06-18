
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  projectId?: string;
  clientId?: number;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description?: string;
  milestoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const transformedInvoices: Invoice[] = data.map(invoice => ({
        id: invoice.id,
        projectId: invoice.project_id || undefined,
        clientId: invoice.client_id || undefined,
        amount: invoice.amount,
        currency: invoice.currency,
        date: invoice.date,
        status: invoice.status as 'paid' | 'pending' | 'overdue',
        description: invoice.description || undefined,
        milestoneId: invoice.milestone_id || undefined,
        createdAt: invoice.created_at,
        updatedAt: invoice.updated_at
      }));

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    }
  };

  const addInvoice = async (newInvoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          project_id: newInvoice.projectId,
          client_id: newInvoice.clientId,
          amount: newInvoice.amount,
          currency: newInvoice.currency,
          date: newInvoice.date,
          status: newInvoice.status,
          description: newInvoice.description,
          milestone_id: newInvoice.milestoneId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedInvoice: Invoice = {
        id: data.id,
        projectId: data.project_id || undefined,
        clientId: data.client_id || undefined,
        amount: data.amount,
        currency: data.currency,
        date: data.date,
        status: data.status as 'paid' | 'pending' | 'overdue',
        description: data.description || undefined,
        milestoneId: data.milestone_id || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setInvoices(prev => [...prev, transformedInvoice]);
      
      toast({
        title: "Success",
        description: "Invoice added successfully"
      });
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast({
        title: "Error",
        description: "Failed to add invoice",
        variant: "destructive"
      });
    }
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          project_id: updates.projectId,
          client_id: updates.clientId,
          amount: updates.amount,
          currency: updates.currency,
          date: updates.date,
          status: updates.status,
          description: updates.description,
          milestone_id: updates.milestoneId
        })
        .eq('id', invoiceId);

      if (error) throw error;

      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, ...updates } : invoice
      ));

      toast({
        title: "Success",
        description: "Invoice updated successfully"
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive"
      });
    }
  };

  return {
    invoices,
    addInvoice,
    updateInvoice
  };
};
