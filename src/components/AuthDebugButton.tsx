import React from 'react';
import { Button } from '@/components/ui/button';
import { cleanupAuthState, performSignOut } from '@/hooks/auth/authUtils';
import { useToast } from '@/hooks/use-toast';

const AuthDebugButton = () => {
  const { toast } = useToast();

  const handleAuthCleanup = async () => {
    try {
      console.log('Manual auth cleanup initiated');
      await performSignOut();
      toast({
        title: "Auth Cleanup",
        description: "Authentication state has been cleaned up and you've been signed out.",
      });
    } catch (error) {
      console.error('Manual cleanup error:', error);
      toast({
        title: "Cleanup Error",
        description: "There was an error during cleanup, but auth state has been cleared.",
        variant: "destructive",
      });
    }
  };

  const handleForceCleanup = () => {
    cleanupAuthState();
    window.location.href = '/';
  };

  // Only show in development or if there are auth issues
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button 
        onClick={handleAuthCleanup}
        variant="danger"
        size="sm"
      >
        Clean Auth State
      </Button>
      <Button 
        onClick={handleForceCleanup}
        variant="danger"
        size="sm"
      >
        Force Cleanup
      </Button>
    </div>
  );
};

export default AuthDebugButton;
