/*
  # Fix Authentication and User Management

  1. User Roles
    - Ensure user_role enum exists
    - Add role column to profiles table if missing
  
  2. Invite Codes System
    - Create invite_codes table with proper structure
    - Set up RLS policies for secure access
    - Create indexes for performance
  
  3. User Creation Flow
    - Create or update handle_new_user function
    - Set up trigger for automatic profile creation
*/

-- Create user_role enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'standard');
  END IF;
END $$;

-- Add role column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN role public.user_role NOT NULL DEFAULT 'standard';
  END IF;
END $$;

-- Create invite_codes table if it doesn't exist
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

-- Create RLS policies for invite_codes if they don't exist
DO $$
BEGIN
  -- Check if "Admins can create invite codes" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invite_codes' 
    AND policyname = 'Admins can create invite codes'
  ) THEN
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
  END IF;

  -- Check if "Admins can view all invite codes" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invite_codes' 
    AND policyname = 'Admins can view all invite codes'
  ) THEN
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
  END IF;

  -- Check if "Admins can delete invite codes" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invite_codes' 
    AND policyname = 'Admins can delete invite codes'
  ) THEN
    CREATE POLICY "Admins can delete invite codes" 
      ON public.invite_codes 
      FOR DELETE 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );
  END IF;

  -- Check if "Public can check specific invite code" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invite_codes' 
    AND policyname = 'Public can check specific invite code'
  ) THEN
    CREATE POLICY "Public can check specific invite code" 
      ON public.invite_codes 
      FOR SELECT 
      TO public 
      USING (
        code = current_setting('request.jwt.claim.invite_code', true)::text
      );
  END IF;
END $$;

-- Create or replace handle_new_user function
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

-- Safely create the trigger
DO $$
BEGIN
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Create the trigger
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END $$;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_used ON public.invite_codes(is_used);