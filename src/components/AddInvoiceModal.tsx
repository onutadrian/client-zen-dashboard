
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvoices } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { Project } from '@/hooks/useProjects';
import { Milestone } from '@/hooks/useMilestones';
import { Client } from '@/hooks/useClients';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  client: Client;
  milestone?: Milestone;
}

const AddInvoiceModal = ({ isOpen, onClose, project, client, milestone }: AddInvoiceModalProps) => {
  const { addInvoice } = useInvoices();
  const { updateClient } = useClients();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: milestone?.amount || 0,
    currency: client.currency || 'USD',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    description: milestone ? `Invoice for milestone: ${milestone.title}` : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create invoice in invoices table
      const newInvoiceData = {
        projectId: project.id,
        clientId: client.id,
        amount: formData.amount,
        currency: formData.currency,
        date: formData.date,
        status: formData.status,
        description: formData.description,
        milestoneId: milestone?.id
      };

      await addInvoice(newInvoiceData);

      // Also update client's invoices array for compatibility
      const clientInvoice = {
        id: Date.now(), // Temporary ID for client's invoice array
        amount: formData.amount,
        date: formData.date,
        status: formData.status
      };

      const updatedClient = {
        ...client,
        invoices: [...(client.invoices || []), clientInvoice]
      };

      await updateClient(client.id, updatedClient);
      
      onClose();
      
      // Reset form
      setFormData({
        amount: milestone?.amount || 0,
        currency: client.currency || 'USD',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: milestone ? `Invoice for milestone: ${milestone.title}` : ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create Invoice {milestone ? `for ${milestone.title}` : ''}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'paid' | 'pending' | 'overdue') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Invoice description..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
