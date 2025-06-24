
-- Add pricing columns to the projects table
ALTER TABLE public.projects 
ADD COLUMN pricing_type text NOT NULL DEFAULT 'fixed',
ADD COLUMN fixed_price numeric DEFAULT NULL,
ADD COLUMN hourly_rate numeric DEFAULT NULL,
ADD COLUMN estimated_hours integer DEFAULT NULL;

-- Add a check constraint to ensure pricing_type is valid
ALTER TABLE public.projects 
ADD CONSTRAINT projects_pricing_type_check 
CHECK (pricing_type IN ('fixed', 'hourly'));

-- Add a check to ensure fixed price projects have a fixed_price value
-- and hourly projects have an hourly_rate value (using a trigger instead of CHECK constraint)
CREATE OR REPLACE FUNCTION validate_project_pricing()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pricing_type = 'fixed' AND NEW.fixed_price IS NULL THEN
    RAISE EXCEPTION 'Fixed price projects must have a fixed_price value';
  END IF;
  
  IF NEW.pricing_type = 'hourly' AND NEW.hourly_rate IS NULL THEN
    RAISE EXCEPTION 'Hourly projects must have an hourly_rate value';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_project_pricing_trigger
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_pricing();
