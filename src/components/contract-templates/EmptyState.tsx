
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'templates' | 'documents';
  onAddTemplate?: () => void;
}

const EmptyState = ({ type, onAddTemplate }: EmptyStateProps) => {
  if (type === 'templates') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first contract template to get started with document generation.
          </p>
          <Button onClick={onAddTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No generated documents</h3>
        <p className="text-muted-foreground text-center">
          Generate your first document from a template to see it here.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
