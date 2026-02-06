-- Fix critical security vulnerability in user_invites RLS policies
-- Remove overly permissive policies and implement proper access controls

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Authenticated users can view invites" ON public.user_invites;
DROP POLICY IF EXISTS "Authenticated users can update invites" ON public.user_invites;
DROP POLICY IF EXISTS "Users can view their own created invites" ON public.user_invites;
DROP POLICY IF EXISTS "Users can update their own created invites" ON public.user_invites;
DROP POLICY IF EXISTS "System can update invite usage" ON public.user_invites;

-- Create secure policies that restrict access appropriately
-- 1. Users can only view invites they created
CREATE POLICY "Users can view their own created invites" 
ON public.user_invites 
FOR SELECT 
TO authenticated
USING (invited_by = auth.uid());

-- 2. Users can only update invites they created (for marking as sent, etc.)
CREATE POLICY "Users can update their own created invites" 
ON public.user_invites 
FOR UPDATE 
TO authenticated
USING (invited_by = auth.uid());

-- 3. Allow system/edge functions to update invites for token validation
CREATE POLICY "System can update invite usage" 
ON public.user_invites 
FOR UPDATE 
TO service_role
USING (true);

-- Note: Admin access is already covered by the existing "Admins can manage invites" policy
-- Note: Insert access is already properly restricted by "Authenticated users can create invites" policy
