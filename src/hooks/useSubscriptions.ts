
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  seats: number;
  billing_date: string;
  login_email: string;
  password: string;
  category: string;
  total_paid: number;
  status: string;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subscriptions from database
  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
      }

      if (data) {
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new subscription
  const addSubscription = async (newSubscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const subscriptionData = {
        name: newSubscription.name,
        price: newSubscription.price,
        seats: newSubscription.seats || 1,
        billing_date: newSubscription.billing_date,
        login_email: newSubscription.login_email || '',
        password: newSubscription.password || '',
        category: newSubscription.category || 'Software',
        total_paid: newSubscription.total_paid || 0,
        status: newSubscription.status || 'active',
        currency: newSubscription.currency || 'USD'
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
        .single();

      if (error) {
        console.error('Error adding subscription:', error);
        return;
      }

      if (data) {
        setSubscriptions(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  // Update existing subscription
  const updateSubscription = async (subscriptionId: number, updatedSubscription: Partial<Subscription>) => {
    try {
      const updateData = {
        name: updatedSubscription.name,
        price: updatedSubscription.price,
        seats: updatedSubscription.seats,
        billing_date: updatedSubscription.billing_date,
        login_email: updatedSubscription.login_email,
        password: updatedSubscription.password,
        category: updatedSubscription.category,
        total_paid: updatedSubscription.total_paid,
        status: updatedSubscription.status,
        currency: updatedSubscription.currency,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        return;
      }

      if (data) {
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === subscriptionId ? data : sub
          )
        );
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    refreshSubscriptions: fetchSubscriptions
  };
};
