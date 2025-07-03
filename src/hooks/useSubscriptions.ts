
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  seats: number;
  billing_date: string;
  login_email: string;
  secure_notes: string;
  category: string;
  total_paid: number;
  status: string;
  currency: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch subscriptions from database
  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id) // Only fetch user's own subscriptions
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
  const addSubscription = async (newSubscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const subscriptionData = {
        name: newSubscription.name,
        price: newSubscription.price,
        seats: newSubscription.seats || 1,
        billing_date: newSubscription.billing_date,
        login_email: newSubscription.login_email || '',
        secure_notes: newSubscription.secure_notes || '',
        category: newSubscription.category || 'Software',
        total_paid: newSubscription.total_paid || 0,
        status: newSubscription.status || 'active',
        currency: newSubscription.currency || 'USD',
        user_id: user.id // Ensure user_id is always set
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
        .single();

      if (error) {
        console.error('Error adding subscription:', error);
        throw error;
      }

      if (data) {
        setSubscriptions(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  };

  // Update existing subscription
  const updateSubscription = async (subscriptionId: number, updatedSubscription: Partial<Subscription>) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const updateData = {
        name: updatedSubscription.name,
        price: updatedSubscription.price,
        seats: updatedSubscription.seats,
        billing_date: updatedSubscription.billing_date,
        login_email: updatedSubscription.login_email,
        secure_notes: updatedSubscription.secure_notes,
        category: updatedSubscription.category,
        total_paid: updatedSubscription.total_paid,
        status: updatedSubscription.status,
        currency: updatedSubscription.currency,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data, error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId)
        .eq('user_id', user.id) // Ensure user can only update their own subscriptions
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
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
      throw error;
    }
  };

  // Delete subscription
  const deleteSubscription = async (subscriptionId: number) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscriptionId)
        .eq('user_id', user.id); // Ensure user can only delete their own subscriptions

      if (error) {
        console.error('Error deleting subscription:', error);
        throw error;
      }

      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refreshSubscriptions: fetchSubscriptions
  };
};
