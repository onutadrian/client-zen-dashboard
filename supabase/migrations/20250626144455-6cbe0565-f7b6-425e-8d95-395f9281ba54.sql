

-- Enable RLS on hour_entries table
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can insert own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can update own hour entries" ON public.hour_entries;
DROP POLICY IF EXISTS "Users can delete own hour entries" ON public.hour_entries;

-- Policy to allow users to view their own hour entries, admins can view all
CREATE POLICY "Users can view hour entries" ON public.hour_entries
    FOR SELECT USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy to allow users to insert their own hour entries
CREATE POLICY "Users can insert hour entries" ON public.hour_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own hour entries, admins can update all
CREATE POLICY "Users can update hour entries" ON public.hour_entries
    FOR UPDATE USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy to allow users to delete their own hour entries, admins can delete all
CREATE POLICY "Users can delete hour entries" ON public.hour_entries
    FOR DELETE USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

