
-- Update existing subscriptions to set total_paid equal to their price
UPDATE public.subscriptions 
SET total_paid = price * seats
WHERE total_paid = 0 OR total_paid IS NULL;
