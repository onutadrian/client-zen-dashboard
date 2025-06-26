
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HourEntry } from '@/types/hourEntry';
import { hourEntryService } from '@/services/hourEntryService';

export const useHourEntriesOperations = () => {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadHourEntries = async () => {
    try {
      setLoading(true);
      const entries = await hourEntryService.loadAll();
      setHourEntries(entries);
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
      const transformedEntry = await hourEntryService.create(newEntry);
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
      await hourEntryService.update(entryId, updatedEntry);

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
      await hourEntryService.delete(entryId);
      
      console.log('Supabase delete successful, updating local state');
      
      // Update local state immediately
      setHourEntries(prev => {
        const filtered = prev.filter(entry => entry.id !== entryId);
        console.log('Local state updated, entries before:', prev.length, 'after:', filtered.length);
        return filtered;
      });
      
      // Force a refresh from the database to ensure consistency
      console.log('Refreshing data from database to ensure consistency');
      await loadHourEntries();
      
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
      throw error; // Re-throw to allow calling code to handle it
    }
  };

  return {
    hourEntries,
    loading,
    loadHourEntries,
    addHourEntry,
    updateHourEntry,
    deleteHourEntry,
    setHourEntries
  };
};
