
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Users } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';

interface ClientAccessTabProps {
  clients: Client[];
  projects: Project[];
  selectedClients: number[];
  loading: boolean;
}

const ClientAccessTab = ({ clients, projects, selectedClients, loading }: ClientAccessTabProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-medium">Client Access</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-3">
            {clients.map((client) => {
              const hasAccess = selectedClients.includes(client.id);
              const relatedProjects = projects.filter(p => p.clientId === client.id);
              
              return (
                <div key={client.id} className={`p-3 rounded border ${hasAccess ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-slate-500">
                        {relatedProjects.length} project{relatedProjects.length !== 1 ? 's' : ''} available
                      </div>
                      {hasAccess && (
                        <div className="text-xs text-blue-600 mt-1">
                          Access granted via project assignments
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={hasAccess}
                        disabled={true}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Client access is automatically granted when you assign projects to the user. 
          Select projects in the "Project Access" tab to grant access to their associated clients.
        </p>
      </div>
    </div>
  );
};

export default ClientAccessTab;
