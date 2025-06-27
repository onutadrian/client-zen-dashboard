
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContractTemplate, GeneratedDocument } from '@/services/contractTemplateService';
import {
  loadContractTemplatesFromSupabase,
  addContractTemplateToSupabase,
  updateContractTemplateInSupabase,
  deleteContractTemplateFromSupabase,
  saveGeneratedDocumentToSupabase,
  loadGeneratedDocumentsFromSupabase
} from '@/services/contractTemplateService';

export const useContractTemplates = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templatesData = await loadContractTemplatesFromSupabase();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load contract templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGeneratedDocuments = async () => {
    try {
      const documentsData = await loadGeneratedDocumentsFromSupabase();
      setGeneratedDocuments(documentsData);
    } catch (error) {
      console.error('Error loading generated documents:', error);
      toast({
        title: "Error",
        description: "Failed to load generated documents",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadTemplates();
    loadGeneratedDocuments();
  }, []);

  const addTemplate = async (newTemplate: Omit<ContractTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const template = await addContractTemplateToSupabase(newTemplate);
      setTemplates(prev => [template, ...prev]);
      
      toast({
        title: "Success",
        description: "Contract template added successfully"
      });
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Error",
        description: "Failed to add contract template",
        variant: "destructive"
      });
    }
  };

  const updateTemplate = async (id: string, updatedTemplate: Partial<ContractTemplate>) => {
    try {
      await updateContractTemplateInSupabase(id, updatedTemplate);
      
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updatedTemplate } : template
      ));

      toast({
        title: "Success",
        description: "Contract template updated successfully"
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update contract template",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await deleteContractTemplateFromSupabase(id);
      setTemplates(prev => prev.filter(template => template.id !== id));
      
      toast({
        title: "Success",
        description: "Contract template deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete contract template",
        variant: "destructive"
      });
    }
  };

  const generateDocument = async (templateId: string, variables: Record<string, any>, documentName: string, projectId?: string, clientId?: number) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Process the template content with variables
      let generatedContent = template.template_content;
      
      // Replace all variables in the template
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        generatedContent = generatedContent.replace(regex, String(value));
      });

      const document = await saveGeneratedDocumentToSupabase({
        template_id: templateId,
        project_id: projectId,
        client_id: clientId,
        document_name: documentName,
        generated_content: generatedContent,
        variables_used: variables
      });

      setGeneratedDocuments(prev => [document, ...prev]);

      toast({
        title: "Success",
        description: "Document generated successfully"
      });

      return document;
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    templates,
    generatedDocuments,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    generateDocument,
    refreshTemplates: loadTemplates,
    refreshGeneratedDocuments: loadGeneratedDocuments
  };
};
