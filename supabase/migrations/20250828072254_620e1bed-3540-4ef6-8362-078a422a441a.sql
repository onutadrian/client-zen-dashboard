-- Remove the overly permissive public policy that exposes email addresses
DROP POLICY IF EXISTS "Public can validate invite tokens" ON public.user_invites;
DROP POLICY IF EXISTS "Secure token validation" ON public.user_invites;

-- Create a more secure policy that only allows token validation without exposing sensitive data
-- This policy will be used by a secure edge function instead
CREATE POLICY "Secure token validation" 
ON public.user_invites 
FOR SELECT 
USING (false); -- Temporarily disable direct access

-- Create a secure function for token validation that doesn't expose email addresses
CREATE OR REPLACE FUNCTION public.validate_invite_token_secure(token_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_record RECORD;
  result jsonb;
BEGIN
  -- Look up the invite without exposing sensitive data
  SELECT id, role, expires_at, used, created_at
  INTO invite_record
  FROM public.user_invites 
  WHERE token = token_input
  AND NOT used
  AND expires_at > now();
  
  -- Return only necessary data for validation
  IF FOUND THEN
    result := jsonb_build_object(
      'valid', true,
      'role', invite_record.role,
      'expires_at', invite_record.expires_at
    );
  ELSE
    result := jsonb_build_object('valid', false);
  END IF;
  
  RETURN result;
END;
$$;
