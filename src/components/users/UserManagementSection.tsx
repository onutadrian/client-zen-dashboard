
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/auth';
import { useSecurity } from '@/components/security/SecurityProvider';
import { useAuth } from '@/hooks/useAuth';

interface UserManagementSectionProps {
  users: UserProfile[];
  onUpdateUserRole: (userId: string, role: 'admin' | 'standard') => Promise<void>;
  onDeleteUser?: (userId: string) => Promise<void>;
}

export const UserManagementSection = ({ 
  users, 
  onUpdateUserRole,
  onDeleteUser 
}: UserManagementSectionProps) => {
  const { logSecurityAction } = useSecurity();
  const { user: currentUser } = useAuth();

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'standard') => {
    const targetUser = users.find(u => u.id === userId);
    const oldRole = targetUser?.role;

    try {
      // Log the security-sensitive action before attempting the change
      await logSecurityAction('user_role_change_attempt', 'user_management', userId, {
        oldRole,
        newRole,
        changedBy: currentUser?.id,
        targetUserEmail: targetUser?.email
      });

      await onUpdateUserRole(userId, newRole);

      // Log successful change
      await logSecurityAction('user_role_changed', 'user_management', userId, {
        oldRole,
        newRole,
        changedBy: currentUser?.id,
        targetUserEmail: targetUser?.email,
        success: true
      });
    } catch (error) {
      // Log failed attempt
      await logSecurityAction('user_role_change_failed', 'user_management', userId, {
        oldRole,
        newRole,
        changedBy: currentUser?.id,
        targetUserEmail: targetUser?.email,
        error: error.message,
        success: false
      });
      throw error;
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!onDeleteUser) return;
    
    const targetUser = users.find(u => u.id === userId);
    
    // Log the security-sensitive action
    await logSecurityAction('user_deleted', 'user_management', userId, {
      deletedBy: currentUser?.id,
      targetUserEmail: targetUser?.email,
      targetUserRole: targetUser?.role
    });

    await onDeleteUser(userId);
  };

  // Log when admin accesses user management
  useEffect(() => {
    if (currentUser) {
      logSecurityAction('admin_access', 'user_management', undefined, {
        accessedBy: currentUser.id,
        userCount: users.length
      });
    }
  }, [currentUser?.id, users.length]);

  return (
    <div className="space-y-4">
      {/* User management UI would go here */}
      <div className="text-sm text-gray-500">
        Security monitoring active for user management operations
      </div>
    </div>
  );
};
