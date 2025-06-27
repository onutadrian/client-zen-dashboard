
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { Client } from '@/types/client';

interface DocumentSetupFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (projectId: string) => void;
  selectedClientId: string;
  setSelectedClientId: (clientId: string) => void;
  projects: Project[];
  clients: Client[];
  onPopulateData: () => void;
  isPopulating: boolean;
}

const DocumentSetupForm = ({
  documentName,
  setDocumentName,
  selectedProjectId,
  setSelectedProjectId,
  selectedClientId,
  setSelectedClientId,
  projects,
  clients,
  onPopulateData,
  isPopulating
}: DocumentSetupFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="documentName">Document Name</Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">Project (Optional)</Label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client">Client (Optional)</Label>
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end space-x-2">
        {selectedClientId && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPopulateData}
            disabled={isPopulating}
            className="flex-1"
          >
            {isPopulating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Populating...
              </>
            ) : (
              'Auto-populate Data'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentSetupForm;
