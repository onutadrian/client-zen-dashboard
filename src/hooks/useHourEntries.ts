
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
}

export const useHourEntries = () => {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const { toast } = useToast();

  // Load hour entries from Supabase on mount
  useEffect(() => {
    loadHourEntries();
  }, []);

  const loadHourEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('hour_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

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
        userId: entry.user_id || undefined
      }));

      setHourEntries(transformedEntries);
    } catch (error) {
      console.error('Error loading hour entries:', error);
      toast({
        title: "Error",
        description: "Failed to load hour entries",
        variant: "destructive"
      });
    }
  };

  const addHourEntry = async (newEntry: Omit<HourEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform to Supabase format
      const supabaseEntry = {
        project_id: newEntry.projectId,
        client_id: newEntry.clientId,
        hours: newEntry.hours,
        description: newEntry.description || null,
        date: newEntry.date,
        billed: newEntry.billed,
        user_id: newEntry.userId || null
      };

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
        userId: data.user_id || undefined
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
    addHourEntry,
    updateHourEntry,
    deleteHourEntry,
    refreshHourEntries: loadHourEntries
  };
};
