
-- Create contract_templates table
CREATE TABLE public.contract_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for contract templates
CREATE POLICY "Users can view their own templates" 
  ON public.contract_templates 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own templates" 
  ON public.contract_templates 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own templates" 
  ON public.contract_templates 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own templates" 
  ON public.contract_templates 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create generated_documents table to store generated documents
CREATE TABLE public.generated_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.contract_templates(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id),
  client_id INTEGER REFERENCES public.clients(id),
  document_name TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  variables_used JSONB DEFAULT '{}'::jsonb,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on generated_documents
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for generated documents
CREATE POLICY "Users can view their own generated documents" 
  ON public.generated_documents 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own generated documents" 
  ON public.generated_documents 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own generated documents" 
  ON public.generated_documents 
  FOR DELETE 
  USING (user_id = auth.uid());
