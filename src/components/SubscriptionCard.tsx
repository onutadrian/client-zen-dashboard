
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, EyeOff, Mail, CreditCard, Edit, Users } from 'lucide-react';
import { useState } from 'react';

const SubscriptionCard = ({
  subscription,
  onEdit
}) => {
  const [showSecureNotes, setShowSecureNotes] = useState(false);
  
  const getDaysUntilBilling = () => {
    const billingDate = new Date(subscription.billing_date);
    const today = new Date();
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilBilling = getDaysUntilBilling();
  const isUpcoming = daysUntilBilling <= 7 && daysUntilBilling >= 0;
  const isOverdue = daysUntilBilling < 0;
  
  const getBillingStatus = () => {
    if (isOverdue) return {
      text: 'Overdue',
      color: 'bg-red-100 text-red-800 hover:bg-red-100'
    };
    if (isUpcoming) return {
      text: `${daysUntilBilling} days`,
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    };
    return {
      text: `${daysUntilBilling} days`,
      color: 'bg-green-100 text-green-800 hover:bg-green-100'
    };
  };
  
  const getStatusBadge = () => {
    const status = subscription.status || 'active';
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'canceled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const billingStatus = getBillingStatus();
  const totalPaid = subscription.total_paid || 0;
  const seats = subscription.seats || 1;
  const totalPrice = subscription.price * seats;
  const currency = subscription.currency || 'USD';
  const loginEmail = subscription.login_email || '';
  const billingDate = subscription.billing_date;
  const secureNotes = subscription.secure_notes || '';
  
  const formatCurrency = (amount) => {
    const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
    const symbol = symbols[currency] || '$';
    return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <Card className={`transition-all duration-200 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-slate-800">{subscription.name}</h4>
                <Button variant="ghost" size="sm" onClick={() => onEdit(subscription)} className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-slate-600">{subscription.category}</p>
                <Badge className={getStatusBadge()}>
                  {(subscription.status || 'active').charAt(0).toUpperCase() + (subscription.status || 'active').slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-slate-800">{formatCurrency(totalPrice)}</div>
              <div className="text-xs text-slate-500">per month</div>
              {seats > 1 && (
                <div className="text-xs text-slate-600 flex items-center justify-end mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {seats} seats
                </div>
              )}
            </div>
          </div>

          {/* Total Paid */}
          <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Total paid to date:</span>
            </div>
            <div className="text-sm font-semibold text-blue-800">
              {formatCurrency(totalPaid)}
            </div>
          </div>

          {/* Billing Info */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
            <div className="flex items-center text-sm text-slate-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(billingDate).toLocaleDateString()}</span>
            </div>
            <Badge className={billingStatus.color}>
              {billingStatus.text}
            </Badge>
          </div>

          {/* Login Credentials */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-600">
              <Mail className="w-4 h-4 mr-2" />
              <span className="font-mono text-xs">{loginEmail}</span>
            </div>
            {secureNotes && (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span className="font-mono text-xs">
                    {showSecureNotes ? secureNotes : '••••••••'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSecureNotes(!showSecureNotes)} className="h-6 w-6 p-0">
                  {showSecureNotes ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
