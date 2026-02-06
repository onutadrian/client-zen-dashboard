-- Allow client role in profiles and user_invites

-- Update profiles role check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'standard', 'client'));

-- Update user_invites role check constraint
ALTER TABLE public.user_invites DROP CONSTRAINT IF EXISTS user_invites_role_check;
ALTER TABLE public.user_invites
  ADD CONSTRAINT user_invites_role_check
  CHECK (role IN ('admin', 'standard', 'client'));

