
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/hooks/useSubscriptions';

export const fetchSubscriptionsFromSupabase = async (userId: string): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }

  // Map the data to ensure billing_cycle is included with proper type
  return (data || []).map(item => ({
    ...item,
    billing_cycle: item.billing_cycle as 'monthly' | 'yearly' || 'monthly'
  }));
};

export const addSubscriptionToSupabase = async (
  subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<Subscription> => {
  const dataToInsert = {
    ...subscriptionData,
    user_id: userId
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }

  return {
    ...data,
    billing_cycle: data.billing_cycle as 'monthly' | 'yearly' || 'monthly'
  };
};

export const updateSubscriptionInSupabase = async (
  subscriptionId: number,
  updatedSubscription: Partial<Subscription>,
  userId: string
): Promise<Subscription> => {
  const updateData = {
    name: updatedSubscription.name,
    price: updatedSubscription.price,
    seats: updatedSubscription.seats,
    billing_date: updatedSubscription.billing_date,
    billing_cycle: updatedSubscription.billing_cycle,
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
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return {
    ...data,
    billing_cycle: data.billing_cycle as 'monthly' | 'yearly' || 'monthly'
  };
};

export const deleteSubscriptionFromSupabase = async (
  subscriptionId: number,
  userId: string
) => {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', subscriptionId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};
