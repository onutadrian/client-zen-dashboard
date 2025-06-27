
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentPreviewProps {
  generatedContent: string;
  hasUnsavedChanges: boolean;
}

const DocumentPreview = ({ generatedContent, hasUnsavedChanges }: DocumentPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          This preview shows the document with your saved variables. 
          {hasUnsavedChanges && " Save your changes in the Setup tab to update this preview."}
        </p>
      </CardHeader>
      <CardContent>
        <Textarea
          value={generatedContent}
          readOnly
          className="min-h-[500px] font-mono text-sm"
          placeholder="Save your template variables to see the preview here..."
        />
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
