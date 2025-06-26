
-- Enable RLS on hour_entries table
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own hour entries
CREATE POLICY "Users can view own hour entries" ON public.hour_entries
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own hour entries
CREATE POLICY "Users can insert own hour entries" ON public.hour_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own hour entries
CREATE POLICY "Users can update own hour entries" ON public.hour_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own hour entries
CREATE POLICY "Users can delete own hour entries" ON public.hour_entries
    FOR DELETE USING (auth.uid() = user_id);
