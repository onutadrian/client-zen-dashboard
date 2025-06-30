
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/auth';
import { useCurrency } from '@/hooks/useCurrency';

interface UserInfoSectionProps {
  user: UserProfile;
}

const UserInfoSection = ({ user }: UserInfoSectionProps) => {
  const { demoMode } = useCurrency();

  return (
    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
      <div>
        <h3 className="font-medium">{user.full_name || 'No name'}</h3>
        <p className="text-sm text-slate-600">{demoMode ? '—' : user.email}</p>
        <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
          {user.role}
        </Badge>
      </div>
    </div>
  );
};

export default UserInfoSection;
