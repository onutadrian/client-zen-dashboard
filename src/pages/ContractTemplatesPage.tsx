
import React, { useState } from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import AddTemplateModal from '@/components/AddTemplateModal';
import EditTemplateModal from '@/components/EditTemplateModal';
import GenerateDocumentModal from '@/components/GenerateDocumentModal';
import PageHeader from '@/components/contract-templates/PageHeader';
import SearchBar from '@/components/contract-templates/SearchBar';
import TemplatesGrid from '@/components/contract-templates/TemplatesGrid';
import DocumentsGrid from '@/components/contract-templates/DocumentsGrid';
import { ContractTemplate } from '@/services/contractTemplateService';
import { useAuth } from '@/hooks/useAuth';

const ContractTemplatesPage = () => {
  const { profile, user } = useAuth();
  const role =
    profile?.role ??
    (user?.user_metadata?.role as string | undefined);
  const { templates, generatedDocuments, loading, deleteTemplate, deleteGeneratedDocument } = useContractTemplates();
  const { downloadDocument } = useDocumentDownload();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.template_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = generatedDocuments.filter(doc =>
    doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setShowEditModal(true);
  };

  const handleGenerateDocument = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    await deleteTemplate(templateId);
  };

  const handleDeleteGeneratedDocument = async (documentId: string) => {
    await deleteGeneratedDocument(documentId);
  };

  if (role === 'client') {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Clients cannot access this page.</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading contract templates...</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader onAddTemplate={() => setShowAddModal(true)} />
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="documents">Generated Documents ({generatedDocuments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <TemplatesGrid
              templates={filteredTemplates}
              onEdit={handleEditTemplate}
              onGenerate={handleGenerateDocument}
              onDelete={handleDeleteTemplate}
              onAddTemplate={() => setShowAddModal(true)}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsGrid
              documents={filteredDocuments}
              onDownload={downloadDocument}
              onDelete={handleDeleteGeneratedDocument}
            />
          </TabsContent>
        </Tabs>

        <AddTemplateModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
        />

        {selectedTemplate && (
          <>
            <EditTemplateModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              template={selectedTemplate}
            />
            <GenerateDocumentModal
              open={showGenerateModal}
              onOpenChange={setShowGenerateModal}
              template={selectedTemplate}
            />
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default ContractTemplatesPage;
