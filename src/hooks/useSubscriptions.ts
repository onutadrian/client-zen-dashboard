
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchSubscriptionsFromSupabase } from '@/services/subscriptionService';
import { useSubscriptionsOperations } from '@/hooks/useSubscriptionsOperations';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  seats: number;
  billing_date: string;
  billing_cycle: 'monthly' | 'yearly';
  login_email: string;
  secure_notes: string;
  category: string;
  total_paid: number;
  status: string;
  currency: string;
  invoice_link?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchSubscriptionsFromSupabase(user.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const operations = useSubscriptionsOperations(user, setSubscriptions);

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  return {
    subscriptions,
    loading,
    refreshSubscriptions: fetchSubscriptions,
    ...operations
  };
};
