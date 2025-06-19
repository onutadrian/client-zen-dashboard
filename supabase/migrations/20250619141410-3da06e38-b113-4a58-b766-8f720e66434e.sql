
-- Check all constraints on the clients table
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'clients'::regclass;

-- Let's also check what values currently exist in the price_type column
SELECT DISTINCT price_type FROM clients;

-- Get table column information
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'clients' AND table_schema = 'public'
ORDER BY ordinal_position;
