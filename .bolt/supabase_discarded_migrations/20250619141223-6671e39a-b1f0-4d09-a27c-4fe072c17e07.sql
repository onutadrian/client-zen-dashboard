
-- Let's check what the current check constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'clients_price_type_check';

-- Also check if there are any other constraints on the price_type column
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'clients' AND tc.table_schema = 'public'
AND (tc.constraint_name LIKE '%price_type%' OR cc.check_clause LIKE '%price_type%');
