
-- Drop all triggers that depend on the function first
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status ON public.invoices;
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_insert ON public.invoices;
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_update ON public.invoices;
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_delete ON public.invoices;

-- Now drop the function
DROP FUNCTION IF EXISTS public.update_milestone_payment_status();

-- Remove invoice-related columns from milestones table
ALTER TABLE public.milestones 
DROP COLUMN IF EXISTS payment_status;

-- Add worked_hours column to tasks table to track actual time spent
ALTER TABLE public.tasks 
ADD COLUMN worked_hours NUMERIC DEFAULT 0;
