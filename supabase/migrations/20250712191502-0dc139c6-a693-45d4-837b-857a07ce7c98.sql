-- Add invoice_link column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN invoice_link TEXT;