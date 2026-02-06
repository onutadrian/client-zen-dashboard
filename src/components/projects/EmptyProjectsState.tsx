
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface EmptyProjectsStateProps {
  onAddProject: () => void;
}

const EmptyProjectsState = ({ onAddProject }: EmptyProjectsStateProps) => {
  return (
    <div className="text-center py-8">
      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-600 mb-2">No projects yet</h3>
      <p className="text-slate-500 mb-4">Create your first project to get started</p>
      <Button variant="primary" 
        onClick={onAddProject}
       
      >
        Add Project
      </Button>
    </div>
  );
};

export default EmptyProjectsState;
