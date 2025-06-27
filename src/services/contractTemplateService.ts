
import { supabase } from '@/integrations/supabase/client';

export interface ContractTemplate {
  id: string;
  name: string;
  template_content: string;
  variables: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedDocument {
  id: string;
  template_id: string;
  project_id?: string;
  client_id?: number;
  document_name: string;
  generated_content: string;
  variables_used: Record<string, any>;
  user_id: string;
  created_at: string;
}

export const loadContractTemplatesFromSupabase = async (): Promise<ContractTemplate[]> => {
  const { data, error } = await supabase
    .from('contract_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading contract templates:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    variables: Array.isArray(item.variables) ? item.variables.filter((v): v is string => typeof v === 'string') : []
  }));
};

export const addContractTemplateToSupabase = async (template: Omit<ContractTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ContractTemplate> => {
  const { data, error } = await supabase
    .from('contract_templates')
    .insert({
      name: template.name,
      template_content: template.template_content,
      variables: template.variables
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding contract template:', error);
    throw error;
  }

  return {
    ...data,
    variables: Array.isArray(data.variables) ? data.variables.filter((v): v is string => typeof v === 'string') : []
  };
};

export const updateContractTemplateInSupabase = async (id: string, template: Partial<ContractTemplate>): Promise<void> => {
  const { error } = await supabase
    .from('contract_templates')
    .update({
      name: template.name,
      template_content: template.template_content,
      variables: template.variables,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating contract template:', error);
    throw error;
  }
};

export const deleteContractTemplateFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contract_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contract template:', error);
    throw error;
  }
};

export const saveGeneratedDocumentToSupabase = async (document: Omit<GeneratedDocument, 'id' | 'user_id' | 'created_at'>): Promise<GeneratedDocument> => {
  const { data, error } = await supabase
    .from('generated_documents')
    .insert(document)
    .select()
    .single();

  if (error) {
    console.error('Error saving generated document:', error);
    throw error;
  }

  return {
    ...data,
    variables_used: typeof data.variables_used === 'object' && data.variables_used !== null ? data.variables_used as Record<string, any> : {}
  };
};

export const loadGeneratedDocumentsFromSupabase = async (): Promise<GeneratedDocument[]> => {
  const { data, error } = await supabase
    .from('generated_documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading generated documents:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    variables_used: typeof item.variables_used === 'object' && item.variables_used !== null ? item.variables_used as Record<string, any> : {}
  }));
};
