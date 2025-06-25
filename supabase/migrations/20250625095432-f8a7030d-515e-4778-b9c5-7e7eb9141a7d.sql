
-- Phase 1: Complete removal of existing user roles and invite management system
-- Fixed version to handle enum type dependencies correctly

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can create invite codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Admins can view all invite codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Admins can delete invite codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Public can check specific invite code" ON public.invite_codes;

-- Drop the invite_codes table
DROP TABLE IF EXISTS public.invite_codes;

-- Remove role column from profiles table FIRST (before dropping enum)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Now we can safely drop the user_role enum type
DROP TYPE IF EXISTS public.user_role;

-- Drop and recreate the handle_new_user function without role logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile with basic info only
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create new user_invites table for invite link system
CREATE TABLE public.user_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'standard')),
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '15 minutes'),
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on user_invites table
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_invites
CREATE POLICY "Authenticated users can view invites" 
  ON public.user_invites 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create invites" 
  ON public.user_invites 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Authenticated users can update invites" 
  ON public.user_invites 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Add role column back to profiles table with simple text type
ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'standard' CHECK (role IN ('admin', 'standard'));

-- Create index for better performance
CREATE INDEX idx_user_invites_token ON public.user_invites(token);
CREATE INDEX idx_user_invites_email ON public.user_invites(email);
CREATE INDEX idx_user_invites_expires_at ON public.user_invites(expires_at);
