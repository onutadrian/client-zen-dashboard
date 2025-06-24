
-- Fix Function Search Path and Security Issues

-- 1. Fix update_hour_entries_updated_at function
DROP FUNCTION IF EXISTS public.update_hour_entries_updated_at();
CREATE OR REPLACE FUNCTION public.update_hour_entries_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 2. Fix handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- 3. Fix update_milestone_payment_status function
DROP FUNCTION IF EXISTS public.update_milestone_payment_status();
CREATE OR REPLACE FUNCTION public.update_milestone_payment_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Update the milestone payment status based on associated invoices
  UPDATE public.milestones 
  SET payment_status = CASE 
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.invoices WHERE milestone_id = NEW.milestone_id AND status = 'paid') >= amount THEN 'paid'
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM public.invoices WHERE milestone_id = NEW.milestone_id AND status = 'paid') > 0 THEN 'partial'
    ELSE 'unpaid'
  END
  WHERE id = NEW.milestone_id;
  
  RETURN NEW;
END;
$function$;

-- 4. Fix validate_project_pricing function
DROP FUNCTION IF EXISTS public.validate_project_pricing();
CREATE OR REPLACE FUNCTION public.validate_project_pricing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.pricing_type = 'fixed' AND NEW.fixed_price IS NULL THEN
    RAISE EXCEPTION 'Fixed price projects must have a fixed_price value';
  END IF;
  
  IF NEW.pricing_type = 'hourly' AND NEW.hourly_rate IS NULL THEN
    RAISE EXCEPTION 'Hourly projects must have an hourly_rate value';
  END IF;
  
  IF NEW.pricing_type = 'daily' AND NEW.daily_rate IS NULL THEN
    RAISE EXCEPTION 'Daily projects must have a daily_rate value';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate the trigger for milestone payment status updates
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status ON public.invoices;
CREATE TRIGGER trigger_update_milestone_payment_status
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  WHEN (NEW.milestone_id IS NOT NULL)
  EXECUTE FUNCTION public.update_milestone_payment_status();

-- Recreate the trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate the trigger for updating hour entries timestamp
DROP TRIGGER IF EXISTS update_hour_entries_updated_at_trigger ON public.hour_entries;
CREATE TRIGGER update_hour_entries_updated_at_trigger
  BEFORE UPDATE ON public.hour_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_hour_entries_updated_at();

-- Create validation trigger for projects
DROP TRIGGER IF EXISTS validate_project_pricing_trigger ON public.projects;
CREATE TRIGGER validate_project_pricing_trigger
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.validate_project_pricing();
