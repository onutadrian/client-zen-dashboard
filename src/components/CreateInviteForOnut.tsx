
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserInvites } from '@/hooks/useUserInvites';
import { useToast } from '@/hooks/use-toast';

const CreateInviteForOnut = () => {
  const { createInvite } = useUserInvites();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const handleCreateInvite = async () => {
    setCreating(true);
    try {
      const invite = await createInvite('onut@furtuna.ro', 'standard');
      if (invite) {
        const inviteUrl = `${window.location.origin}/auth?token=${invite.token}`;
        
        // Copy to clipboard for easy sharing
        await navigator.clipboard.writeText(inviteUrl);
        
        toast({
          title: "Invite Created Successfully!",
          description: `Invite URL copied to clipboard. Share this with Onut: ${inviteUrl}`,
        });
        
        console.log('Invite URL for Onut:', inviteUrl);
      }
    } catch (error) {
      console.error('Error creating invite:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold mb-2">Create Test User Invite</h3>
      <p className="text-sm text-gray-600 mb-4">
        Create an invite for onut@furtuna.ro (standard role) to test role separation
      </p>
      <Button 
        onClick={handleCreateInvite} 
        disabled={creating}
        className="w-full"
      >
        {creating ? 'Creating Invite...' : 'Create Invite for Onut'}
      </Button>
    </div>
  );
};

export default CreateInviteForOnut;
