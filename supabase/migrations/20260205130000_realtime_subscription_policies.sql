-- Allow realtime channel subscriptions (realtime.subscription)

DO $$
BEGIN
  ALTER TABLE realtime.subscription ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "allow realtime subscription select" ON realtime.subscription;
  DROP POLICY IF EXISTS "allow realtime subscription insert" ON realtime.subscription;
  DROP POLICY IF EXISTS "allow realtime subscription delete" ON realtime.subscription;

  CREATE POLICY "allow realtime subscription select"
  ON realtime.subscription
  FOR SELECT
  USING (true);

  CREATE POLICY "allow realtime subscription insert"
  ON realtime.subscription
  FOR INSERT
  WITH CHECK (true);

  CREATE POLICY "allow realtime subscription delete"
  ON realtime.subscription
  FOR DELETE
  USING (true);
EXCEPTION
  WHEN insufficient_privilege THEN
    -- Realtime schema is owned by supabase_admin; ignore if not allowed in this environment.
    NULL;
END $$;
