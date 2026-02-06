import React from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import ClientProjectsGrid from '@/components/client/ClientProjectsGrid';
import CardListSkeleton from '@/components/skeletons/CardListSkeleton';
import { useClientData } from '@/hooks/client/useClientData';
import { useAuth } from '@/hooks/useAuth';

const ClientProjectsPage = () => {
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const { client, projects, loading } = useClientData();

  if (role !== 'client') {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
            <p className="text-slate-600">This area is for clients only.</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">Your Projects</h1>
          </div>

          {loading ? (
            <CardListSkeleton count={3} lines={4} />
          ) : projects.length === 0 ? (
            <div className="text-slate-600">No projects assigned yet.</div>
          ) : (
            <ClientProjectsGrid projects={projects} clientName={client?.name} />
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ClientProjectsPage;
