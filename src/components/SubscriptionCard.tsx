
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
  const [showPassword, setShowPassword] = useState(false);
  
  const getDaysUntilBilling = () => {
    const billingDate = new Date(subscription.billingDate);
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
      color: 'bg-destructive text-destructive-foreground'
    };
    if (isUpcoming) return {
      text: `${daysUntilBilling} days`,
      color: 'bg-secondary text-secondary-foreground'
    };
    return {
      text: `${daysUntilBilling} days`,
      color: 'bg-primary text-primary-foreground'
    };
  };
  
  const getStatusBadge = () => {
    const status = subscription.status || 'active';
    switch (status) {
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'paused':
        return 'bg-secondary text-secondary-foreground';
      case 'canceled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const billingStatus = getBillingStatus();
  const totalPaid = subscription.totalPaid || 0;
  const seats = subscription.seats || 1;
  const totalPrice = subscription.price * seats;
  const currency = subscription.currency || 'USD';
  
  const formatCurrency = (amount) => {
    const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
    const symbol = symbols[currency] || '$';
    return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${isOverdue ? 'border-destructive bg-destructive/10' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground">{subscription.name}</h4>
                <Button variant="ghost" size="sm" onClick={() => onEdit(subscription)} className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">{subscription.category}</p>
                <Badge className={getStatusBadge()}>
                  {(subscription.status || 'active').charAt(0).toUpperCase() + (subscription.status || 'active').slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-foreground">{formatCurrency(totalPrice)}</div>
              <div className="text-xs text-muted-foreground">per month</div>
              {seats > 1 && (
                <div className="text-xs text-muted-foreground flex items-center justify-end mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {seats} seats
                </div>
              )}
            </div>
          </div>

          {/* Total Paid */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Total paid to date:</span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {formatCurrency(totalPaid)}
            </div>
          </div>

          {/* Billing Info */}
          <div className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(subscription.billingDate).toLocaleDateString()}</span>
            </div>
            <Badge className={billingStatus.color}>
              {billingStatus.text}
            </Badge>
          </div>

          {/* Login Credentials */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              <span className="font-mono text-xs">{subscription.loginEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="font-mono text-xs">
                  {showPassword ? subscription.password : '••••••••'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="h-6 w-6 p-0">
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
