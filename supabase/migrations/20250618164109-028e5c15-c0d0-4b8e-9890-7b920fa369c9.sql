
-- First, let's identify and remove duplicate invoices for the same milestone
-- We'll keep the first invoice created and remove any duplicates
WITH duplicate_invoices AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY milestone_id ORDER BY created_at ASC) as rn
  FROM public.invoices 
  WHERE milestone_id IS NOT NULL
)
DELETE FROM public.invoices 
WHERE id IN (
  SELECT id FROM duplicate_invoices WHERE rn > 1
);

-- Add a unique constraint to prevent multiple invoices per milestone
-- Using a partial unique index instead of constraint for better PostgreSQL compatibility
CREATE UNIQUE INDEX IF NOT EXISTS unique_invoice_per_milestone 
ON public.invoices(milestone_id) 
WHERE milestone_id IS NOT NULL;

-- Create an additional index to improve performance for milestone invoice lookups
CREATE INDEX IF NOT EXISTS idx_invoices_milestone_lookup 
ON public.invoices(milestone_id, status) 
WHERE milestone_id IS NOT NULL;
