/*
  # Add User Roles and Invite System
  
  1. New Features
     - Add role column to profiles table
     - Create invite_codes table for invitation system
     - Update handle_new_user function to support roles
  
  2. Security
     - Enable RLS on invite_codes table
     - Add appropriate policies for invite code management
*/

-- Create user_role enum type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'standard');
  END IF;
END $$;

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.user_role NOT NULL DEFAULT 'standard';

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id),
  is_used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on invite_codes table
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invite_codes
-- Only admins can create invite codes
CREATE POLICY "Admins can create invite codes" 
  ON public.invite_codes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Only admins can view all invite codes
CREATE POLICY "Admins can view all invite codes" 
  ON public.invite_codes 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Anyone can check if a specific invite code is valid (for sign-up)
CREATE POLICY "Public can check specific invite code" 
  ON public.invite_codes 
  FOR SELECT 
  TO public 
  USING (
    code = current_setting('request.jwt.claim.invite_code', true)::text
  );

-- Update handle_new_user function to support roles from invite codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_code_record RECORD;
  user_role public.user_role := 'standard'; -- Default role
BEGIN
  -- Check if user signed up with an invite code
  IF NEW.raw_user_meta_data->>'invite_code' IS NOT NULL THEN
    -- Look up the invite code
    SELECT * INTO invite_code_record 
    FROM public.invite_codes 
    WHERE code = NEW.raw_user_meta_data->>'invite_code'
    AND NOT is_used
    AND (expires_at IS NULL OR expires_at > now());
    
    -- If valid invite code found, use its role
    IF FOUND THEN
      user_role := invite_code_record.role;
      
      -- Mark invite code as used
      UPDATE public.invite_codes
      SET is_used = true, used_by = NEW.id
      WHERE id = invite_code_record.id;
    END IF;
  END IF;

  -- Create user profile with appropriate role
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is set up correctly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_used ON public.invite_codes(is_used);