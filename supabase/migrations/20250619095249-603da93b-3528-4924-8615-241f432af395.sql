
-- Add user_id column to hour_entries table if it doesn't exist and make it NOT NULL
ALTER TABLE public.hour_entries ADD COLUMN IF NOT EXISTS milestone_id UUID;

-- Update existing hour_entries to set user_id for any existing records (this is safe as we're in development)
UPDATE public.hour_entries SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Make user_id NOT NULL after updating existing records
ALTER TABLE public.hour_entries ALTER COLUMN user_id SET NOT NULL;

-- Enable RLS on hour_entries table
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can insert their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can update their own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can delete their own hour entries" ON public.hour_entries;

-- Create RLS policies for hour_entries table
CREATE POLICY "Users can view their own hour entries" ON public.hour_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hour entries" ON public.hour_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hour entries" ON public.hour_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hour entries" ON public.hour_entries
  FOR DELETE USING (auth.uid() = user_id);
