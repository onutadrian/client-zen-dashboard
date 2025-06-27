
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const Greeting = () => {
  const { profile, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  return (
    <div className="mb-6">
      <h1 className="text-slate-900 text-3xl font-bold">
        Hello, {getDisplayName()}
      </h1>
      <p className="text-slate-600 text-base font-medium mt-1">
        Welcome to your dashboard
      </p>
    </div>
  );
};

export default Greeting;
