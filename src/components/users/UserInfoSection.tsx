
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/auth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Check, X } from 'lucide-react';

interface UserInfoSectionProps {
  user: UserProfile;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}

const UserInfoSection = ({ user, onUserUpdate }: UserInfoSectionProps) => {
  const { demoMode } = useCurrency();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editedName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, full_name: editedName.trim() };
      onUserUpdate?.(updatedUser);
      
      toast({
        title: "Success",
        description: "Display name updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating display name:', error);
      toast({
        title: "Error",
        description: "Failed to update display name",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user.full_name || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter display name"
                className="flex-1"
                disabled={isUpdating}
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{user.full_name || 'No name'}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600">{demoMode ? '—' : user.email}</p>
        <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
          {user.role}
        </Badge>
      </div>
    </div>
  );
};

export default UserInfoSection;
