
import { useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { useHourEntriesOperations } from './useHourEntriesOperations';

export { HourEntry } from '@/types/hourEntry';

export const useHourEntries = () => {
  const { isAuthenticated } = useAuthState();
  const {
    hourEntries,
    loading,
    loadHourEntries,
    addHourEntry,
    updateHourEntry,
    deleteHourEntry,
    setHourEntries
  } = useHourEntriesOperations();

  // Load entries when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('useHourEntries: User authenticated, loading hour entries...');
      loadHourEntries();
    } else {
      // Clear data when user signs out
      console.log('useHourEntries: User signed out, clearing entries');
      setHourEntries([]);
    }
  }, [isAuthenticated]);

  return {
    hourEntries,
    loading,
    addHourEntry,
    updateHourEntry,
    deleteHourEntry,
    refreshHourEntries: loadHourEntries
  };
};
