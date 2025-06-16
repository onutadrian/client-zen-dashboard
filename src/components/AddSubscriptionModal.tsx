
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddSubscriptionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingDate: '',
    loginEmail: '',
    password: '',
    category: 'Software',
    status: 'active',
    currency: 'USD',
    seats: '1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subscriptionData = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      billingDate: formData.billingDate,
      loginEmail: formData.loginEmail,
      password: formData.password,
      category: formData.category,
      status: formData.status,
      currency: formData.currency,
      seats: parseInt(formData.seats) || 1,
      totalPaid: 0
    };
    
    onAdd(subscriptionData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      billingDate: '',
      loginEmail: '',
      password: '',
      category: 'Software',
      status: 'active',
      currency: 'USD',
      seats: '1'
    });
  };

  const categories = [
    'Software',
    'Design',
    'Development',
    'Marketing',
    'Analytics',
    'Communication',
    'Storage',
    'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sub-name">Service Name *</Label>
            <Input
              id="sub-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Adobe Creative Suite"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sub-price">Monthly Price *</Label>
              <Input
                id="sub-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="sub-seats">Seats</Label>
              <Input
                id="sub-seats"
                type="number"
                min="1"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sub-currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
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
            <div>
              <Label htmlFor="sub-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="sub-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
            <Label htmlFor="sub-billing-date">Next Billing Date *</Label>
            <Input
              id="sub-billing-date"
              type="date"
              value={formData.billingDate}
              onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="sub-email">Login Email</Label>
            <Input
              id="sub-email"
              type="email"
              value={formData.loginEmail}
              onChange={(e) => setFormData({ ...formData, loginEmail: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="sub-password">Password</Label>
            <Input
              id="sub-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password (stored securely)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
