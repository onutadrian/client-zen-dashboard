
-- Add billing_cycle column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN billing_cycle TEXT NOT NULL DEFAULT 'monthly';

-- Add check constraint to ensure valid billing cycles
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_billing_cycle_check 
CHECK (billing_cycle IN ('monthly', 'yearly'));
