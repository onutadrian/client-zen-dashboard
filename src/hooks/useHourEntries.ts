import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HourEntry {
  id: number;
  projectId: string;
  clientId: number;
  hours: number;
  description?: string;
  date: string;
  billed: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  milestoneId?: string;
}

export const useHourEntries = () => {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Monitor authentication state
  useEffect(() => {
    console.log('useHourEntries: Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useHourEntries: Auth state changed:', event, 'User ID:', session?.user?.id);
        
        const nowAuthenticated = !!session?.user;
        setIsAuthenticated(nowAuthenticated);
        
        if (nowAuthenticated) {
          console.log('useHourEntries: User authenticated, loading hour entries...');
          loadHourEntries();
        } else {
          // Clear data when user signs out
          console.log('useHourEntries: User signed out, clearing entries');
          setHourEntries([]);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authenticated = !!session?.user;
      console.log('useHourEntries: Initial session check, authenticated:', authenticated);
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        console.log('useHourEntries: Initial session found, loading entries...');
        loadHourEntries();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadHourEntries = async () => {
    try {
      setLoading(true);
      console.log('useHourEntries: Loading hour entries from Supabase...');
      
      // Verify authentication before querying
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('useHourEntries: Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.log('useHourEntries: No authenticated user found');
        setHourEntries([]);
        return;
      }

      console.log('useHourEntries: Authenticated user confirmed, querying for user:', user.id);

      const { data, error } = await supabase
        .from('hour_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('useHourEntries: Database error:', error);
        throw error;
      }

      console.log('useHourEntries: Raw data from Supabase:', data);

      // Transform Supabase data to match our HourEntry interface
      const transformedEntries: HourEntry[] = data.map(entry => ({
        id: entry.id,
        projectId: entry.project_id,
        clientId: entry.client_id,
        hours: Number(entry.hours),
        description: entry.description || undefined,
        date: entry.date,
        billed: entry.billed,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
        userId: entry.user_id || undefined,
        milestoneId: entry.milestone_id || undefined
      }));

      console.log('useHourEntries: Transformed entries:', transformedEntries);
      setHourEntries(transformedEntries);
    } catch (error) {
      console.error('Error loading hour entries:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('row-level security')) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to view your hour entries",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load hour entries",
          variant: "destructive"
        });
      }
      
      setHourEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const addHourEntry = async (newEntry: Omit<HourEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('useHourEntries: Adding hour entry for user:', user.id);

      // Transform to Supabase format
      const supabaseEntry = {
        project_id: newEntry.projectId,
        client_id: newEntry.clientId,
        hours: newEntry.hours,
        description: newEntry.description || null,
        date: newEntry.date,
        billed: newEntry.billed,
        user_id: user.id, // Set the authenticated user's ID
        milestone_id: newEntry.milestoneId || null
      };

      console.log('useHourEntries: Inserting entry:', supabaseEntry);

      const { data, error } = await supabase
        .from('hour_entries')
        .insert([supabaseEntry])
        .select()
        .single();

      if (error) throw error;

      // Transform back to our format and add to state
      const transformedEntry: HourEntry = {
        id: data.id,
        projectId: data.project_id,
        clientId: data.client_id,
        hours: Number(data.hours),
        description: data.description || undefined,
        date: data.date,
        billed: data.billed,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id || undefined,
        milestoneId: data.milestone_id || undefined
      };

      setHourEntries(prev => [transformedEntry, ...prev]);
      
      toast({
        title: "Success",
        description: "Hour entry added successfully"
      });
    } catch (error) {
      console.error('Error adding hour entry:', error);
      toast({
        title: "Error",
        description: "Failed to add hour entry",
        variant: "destructive"
      });
      throw error; // Re-throw to allow calling code to handle it
    }
  };

  const updateHourEntry = async (entryId: number, updatedEntry: Partial<HourEntry>) => {
    try {
      // Transform to Supabase format
      const supabaseUpdate: any = {};
      if (updatedEntry.projectId) supabaseUpdate.project_id = updatedEntry.projectId;
      if (updatedEntry.clientId) supabaseUpdate.client_id = updatedEntry.clientId;
      if (updatedEntry.hours) supabaseUpdate.hours = updatedEntry.hours;
      if (updatedEntry.description !== undefined) supabaseUpdate.description = updatedEntry.description || null;
      if (updatedEntry.date) supabaseUpdate.date = updatedEntry.date;
      if (updatedEntry.billed !== undefined) supabaseUpdate.billed = updatedEntry.billed;
      if (updatedEntry.userId !== undefined) supabaseUpdate.user_id = updatedEntry.userId || null;
      if (updatedEntry.milestoneId !== undefined) supabaseUpdate.milestone_id = updatedEntry.milestoneId || null;

      const { error } = await supabase
        .from('hour_entries')
        .update(supabaseUpdate)
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      setHourEntries(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, ...updatedEntry } : entry
      ));

      toast({
        title: "Success",
        description: "Hour entry updated successfully"
      });
    } catch (error) {
      console.error('Error updating hour entry:', error);
      toast({
        title: "Error",
        description: "Failed to update hour entry",
        variant: "destructive"
      });
    }
  };

  const deleteHourEntry = async (entryId: number) => {
    try {
      const { error } = await supabase
        .from('hour_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setHourEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Success",
        description: "Hour entry deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting hour entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete hour entry",
        variant: "destructive"
      });
    }
  };

  return {
    hourEntries,
    loading,
    addHourEntry,
    updateHourEntry,
    deleteHourEntry,
    refreshHourEntries: loadHourEntries
  };
};
