
-- Fix the milestone payment status trigger to handle exact amount matches correctly
CREATE OR REPLACE FUNCTION public.update_milestone_payment_status()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update the milestone payment status based on associated invoices
  UPDATE milestones 
  SET payment_status = CASE 
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE milestone_id = COALESCE(NEW.milestone_id, OLD.milestone_id) AND status = 'paid') >= amount THEN 'paid'
    WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE milestone_id = COALESCE(NEW.milestone_id, OLD.milestone_id) AND status = 'paid') > 0 THEN 'partial'
    ELSE 'unpaid'
  END
  WHERE id = COALESCE(NEW.milestone_id, OLD.milestone_id) AND COALESCE(NEW.milestone_id, OLD.milestone_id) IS NOT NULL;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create triggers for the milestone payment status update on invoices table
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_insert ON invoices;
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_update ON invoices;
DROP TRIGGER IF EXISTS trigger_update_milestone_payment_status_delete ON invoices;

CREATE TRIGGER trigger_update_milestone_payment_status_insert
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_payment_status();

CREATE TRIGGER trigger_update_milestone_payment_status_update
  AFTER UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_payment_status();

CREATE TRIGGER trigger_update_milestone_payment_status_delete
  AFTER DELETE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_payment_status();
