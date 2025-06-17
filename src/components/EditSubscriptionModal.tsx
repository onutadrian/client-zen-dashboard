
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditSubscriptionModal = ({ subscription, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    seats: 1,
    billing_date: '',
    login_email: '',
    secure_notes: '',
    category: '',
    total_paid: 0,
    status: 'active',
    currency: 'USD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || '',
        price: subscription.price || 0,
        seats: subscription.seats || 1,
        billing_date: subscription.billing_date || '',
        login_email: subscription.login_email || '',
        secure_notes: subscription.secure_notes || '',
        category: subscription.category || '',
        total_paid: subscription.total_paid || 0,
        status: subscription.status || 'active',
        currency: subscription.currency || 'USD'
      });
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting updated subscription:', formData);
      
      await onUpdate(subscription.id, {
        name: formData.name,
        price: formData.price,
        seats: formData.seats,
        billing_date: formData.billing_date,
        login_email: formData.login_email,
        secure_notes: formData.secure_notes,
        category: formData.category,
        total_paid: formData.total_paid,
        status: formData.status,
        currency: formData.currency
      });
      
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="RON">Romanian Lei (RON)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Seat</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                value={formData.seats}
                onChange={(e) => handleChange('seats', parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="total_paid">Total Paid to Date</Label>
            <Input
              id="total_paid"
              type="number"
              step="0.01"
              value={formData.total_paid}
              onChange={(e) => handleChange('total_paid', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="billing_date">Next Billing Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="billing_date"
                type="date"
                value={formData.billing_date}
                onChange={(e) => handleChange('billing_date', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="login_email">Login Email</Label>
            <Input
              id="login_email"
              type="email"
              value={formData.login_email}
              onChange={(e) => handleChange('login_email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="secure_notes">Secure Notes</Label>
            <Textarea
              id="secure_notes"
              value={formData.secure_notes}
              onChange={(e) => handleChange('secure_notes', e.target.value)}
              placeholder="Store passwords, API keys, or other sensitive information here..."
              className="min-h-[80px]"
            />
            <p className="text-xs text-slate-500 mt-1">
              This field is encrypted and secure. Use it to store passwords, API keys, or other sensitive information.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriptionModal;
