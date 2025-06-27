
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

const ClientDetailsPage = () => {
  const { id } = useParams();

  return (
    <DashboardContainer>
      <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-slate-800">Client Details</h1>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-600">Client details page for ID: {id}</p>
            <p className="text-sm text-slate-500 mt-2">This page is under construction.</p>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ClientDetailsPage;
