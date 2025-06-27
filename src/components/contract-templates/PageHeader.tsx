
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onAddTemplate: () => void;
}

const PageHeader = ({ onAddTemplate }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Contract Templates</h1>
        <p className="text-muted-foreground">Manage your document templates and generate contracts</p>
      </div>
      <Button onClick={onAddTemplate}>
        <Plus className="w-4 h-4 mr-2" />
        Add Template
      </Button>
    </div>
  );
};

export default PageHeader;
