
-- Update the user_invites table to add email tracking
ALTER TABLE public.user_invites 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create or replace the function to handle invite signup
CREATE OR REPLACE FUNCTION public.handle_invite_signup() 
RETURNS TRIGGER AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Check if user signed up with an invite token in metadata
  IF NEW.raw_user_meta_data->>'invite_token' IS NOT NULL THEN
    -- Look up the invite
    SELECT * INTO invite_record 
    FROM public.user_invites 
    WHERE token = NEW.raw_user_meta_data->>'invite_token'
    AND NOT used
    AND expires_at > now();
    
    -- If valid invite found, update profile with role from invite
    IF FOUND THEN
      -- Update the profile with the role from the invite
      UPDATE public.profiles 
      SET role = invite_record.role 
      WHERE id = NEW.id;
      
      -- Mark invite as used
      UPDATE public.user_invites
      SET used = true, 
          used_at = now(), 
          used_by = NEW.id
      WHERE id = invite_record.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for invite signup handling
DROP TRIGGER IF EXISTS on_invite_signup ON auth.users;
CREATE TRIGGER on_invite_signup
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_invite_signup();

-- Enable RLS on user_invites
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_invites
CREATE POLICY "Admins can manage invites" ON public.user_invites
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow public access to validate invite tokens (for signup page)
CREATE POLICY "Public can validate invite tokens" ON public.user_invites
  FOR SELECT TO anon
  USING (true);
