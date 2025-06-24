
-- Phase 1: Database Schema Updates (Corrected)

-- Add amount and currency fields to milestones table
ALTER TABLE public.milestones 
ADD COLUMN amount NUMERIC,
ADD COLUMN currency TEXT DEFAULT 'USD';

-- Create a separate invoices table to properly link invoices to projects
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  description TEXT,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" 
  ON public.invoices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices" 
  ON public.invoices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
  ON public.invoices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
  ON public.invoices 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add milestone completion percentage and payment status
ALTER TABLE public.milestones 
ADD COLUMN completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
ADD COLUMN payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid'));

-- Create trigger to update milestone payment status based on linked invoices
CREATE OR REPLACE FUNCTION update_milestone_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the milestone payment status based on associated invoices
  UPDATE milestones 
  SET payment_status = CASE 
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE milestone_id = NEW.milestone_id AND status = 'paid') >= amount THEN 'paid'
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE milestone_id = NEW.milestone_id AND status = 'paid') > 0 THEN 'partial'
    ELSE 'unpaid'
  END
  WHERE id = NEW.milestone_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_milestone_payment_status
  AFTER INSERT OR UPDATE ON invoices
  FOR EACH ROW
  WHEN (NEW.milestone_id IS NOT NULL)
  EXECUTE FUNCTION update_milestone_payment_status();

-- Add indexes for better performance (excluding the one that already exists)
CREATE INDEX idx_invoices_project_id ON public.invoices(project_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_milestone_id ON public.invoices(milestone_id);
