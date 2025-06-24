
-- Add daily_rate column to projects table
ALTER TABLE public.projects 
ADD COLUMN daily_rate numeric;

-- Update the pricing type validation function to include 'daily'
CREATE OR REPLACE FUNCTION public.validate_project_pricing()
RETURNS trigger
LANGUAGE plpgsql
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
