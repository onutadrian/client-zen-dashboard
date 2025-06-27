
import { supabase } from '@/integrations/supabase/client';
import { HourEntry } from '@/types/hourEntry';

export const hourEntryService = {
  async loadAll(): Promise<HourEntry[]> {
    console.log('hourEntryService: Loading hour entries from Supabase...');
    
    // Verify authentication before querying
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('hourEntryService: Auth error:', authError);
      throw authError;
    }
    
    if (!user) {
      console.log('hourEntryService: No authenticated user found');
      return [];
    }

    console.log('hourEntryService: Authenticated user confirmed, querying for user:', user.id);

    const { data, error } = await supabase
      .from('hour_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('hourEntryService: Database error:', error);
      throw error;
    }

    console.log('hourEntryService: Raw data from Supabase:', data);

    // Transform Supabase data to match our HourEntry interface
    const transformedEntries: HourEntry[] = data.map(entry => {
      // Handle malformed milestone_id values
      let milestoneId: string | undefined = undefined;
      
      if (entry.milestone_id !== null && entry.milestone_id !== undefined) {
        // Check if it's a malformed object
        if (typeof entry.milestone_id === 'object' && entry.milestone_id._type === 'undefined') {
          milestoneId = undefined;
        } else if (typeof entry.milestone_id === 'string') {
          milestoneId = entry.milestone_id;
        }
      }

      return {
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
        milestoneId: milestoneId
      };
    });

    console.log('hourEntryService: Transformed entries:', transformedEntries);
    return transformedEntries;
  },

  async create(newEntry: Omit<HourEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<HourEntry> {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('hourEntryService: Adding hour entry for user:', user.id);

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

    console.log('hourEntryService: Inserting entry:', supabaseEntry);

    const { data, error } = await supabase
      .from('hour_entries')
      .insert([supabaseEntry])
      .select()
      .single();

    if (error) throw error;

    // Transform back to our format
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

    return transformedEntry;
  },

  async update(entryId: number, updatedEntry: Partial<HourEntry>): Promise<void> {
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
  },

  async delete(entryId: number): Promise<void> {
    console.log('Starting delete operation for entry ID:', entryId);
    
    // Verify authentication before deleting
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error during delete:', authError);
      throw authError;
    }
    
    if (!user) {
      console.error('No authenticated user found during delete');
      throw new Error('User not authenticated');
    }

    console.log('Authenticated user confirmed, proceeding with delete for user:', user.id);

    // For admin users, don't restrict by user_id - let RLS policies handle the authorization
    const { error } = await supabase
      .from('hour_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    console.log('Supabase delete successful');
  }
};
