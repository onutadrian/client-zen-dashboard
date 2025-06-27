
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractTemplate } from '@/services/contractTemplateService';
import { useDocumentGeneration } from '@/hooks/useDocumentGeneration';
import DocumentSetupForm from './document-generation/DocumentSetupForm';
import VariableManager from './document-generation/VariableManager';
import DocumentPreview from './document-generation/DocumentPreview';

interface GenerateDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: ContractTemplate;
}

const GenerateDocumentModal = ({ open, onOpenChange, template }: GenerateDocumentModalProps) => {
  const {
    documentName,
    setDocumentName,
    selectedProjectId,
    setSelectedProjectId,
    selectedClientId,
    setSelectedClientId,
    variables,
    generatedContent,
    isSubmitting,
    isPopulating,
    hasUnsavedChanges,
    projects,
    clients,
    populateVariablesFromData,
    saveAndUpdatePreview,
    handleVariableChange,
    handleSubmit
  } = useDocumentGeneration(template);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(documentName, () => onOpenChange(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Document from {template.name}</DialogTitle>
          <DialogDescription>
            Fill in the template variables and generate a document based on your template.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="setup" className="space-y-4">
          <TabsList>
            <TabsTrigger value="setup">
              Setup
              {hasUnsavedChanges && <Badge variant="destructive" className="ml-2 text-xs">Unsaved</Badge>}
            </TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <DocumentSetupForm
                documentName={documentName}
                setDocumentName={setDocumentName}
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                selectedClientId={selectedClientId}
                setSelectedClientId={setSelectedClientId}
                projects={projects}
                clients={clients}
                onPopulateData={populateVariablesFromData}
                isPopulating={isPopulating}
              />

              <VariableManager
                variables={template.variables}
                variableValues={variables}
                onVariableChange={handleVariableChange}
                onSaveAndUpdatePreview={saveAndUpdatePreview}
                hasUnsavedChanges={hasUnsavedChanges}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || hasUnsavedChanges}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Document'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <DocumentPreview
              generatedContent={generatedContent}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentModal;
