
-- Update Adrian's role from 'standard' to 'admin' in the profiles table
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'adrian@furtuna.ro';
