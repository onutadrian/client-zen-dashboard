
import { useState } from 'react';
import { Subscription } from '@/hooks/useSubscriptions';
import { 
  addSubscriptionToSupabase, 
  updateSubscriptionInSupabase, 
  deleteSubscriptionFromSupabase 
} from '@/services/subscriptionService';

export const useSubscriptionsOperations = (
  user: any,
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>
) => {
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
        billing_cycle: newSubscription.billing_cycle || 'monthly',
        login_email: newSubscription.login_email || '',
        secure_notes: newSubscription.secure_notes || '',
        category: newSubscription.category || 'Software',
        total_paid: newSubscription.total_paid || 0,
        status: newSubscription.status || 'active',
        currency: newSubscription.currency || 'USD'
      };

      const data = await addSubscriptionToSupabase(subscriptionData, user.id);
      setSubscriptions(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (subscriptionId: number, updatedSubscription: Partial<Subscription>) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const data = await updateSubscriptionInSupabase(subscriptionId, updatedSubscription, user.id);
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? data : sub
        )
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const deleteSubscription = async (subscriptionId: number) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      await deleteSubscriptionFromSupabase(subscriptionId, user.id);
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  return {
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
};
