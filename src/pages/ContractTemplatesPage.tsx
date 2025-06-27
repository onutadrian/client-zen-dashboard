import React, { useState } from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileText, Edit, Trash2, Download, Search } from 'lucide-react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import AddTemplateModal from '@/components/AddTemplateModal';
import EditTemplateModal from '@/components/EditTemplateModal';
import GenerateDocumentModal from '@/components/GenerateDocumentModal';
import { ContractTemplate, GeneratedDocument } from '@/services/contractTemplateService';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const ContractTemplatesPage = () => {
  const { templates, generatedDocuments, loading, deleteTemplate } = useContractTemplates();
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

  const downloadDocument = async (document: GeneratedDocument) => {
    try {
      // Split content into paragraphs
      const paragraphs = document.generated_content.split('\n').map(line => 
        new Paragraph({
          children: [new TextRun(line || ' ')], // Empty lines need a space
        })
      );

      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      // Generate blob
      const blob = await Packer.toBlob(doc);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.document_name}.docx`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contract Templates</h1>
            <p className="text-muted-foreground">Manage your document templates and generate contracts</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates and documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="documents">Generated Documents ({generatedDocuments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first contract template to get started with document generation.
                  </p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{template.name}</span>
                        <Badge variant="secondary">{template.variables.length} vars</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {template.template_content.substring(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.variables.slice(0, 3).map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument(template)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Template</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{template.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No generated documents</h3>
                  <p className="text-muted-foreground text-center">
                    Generate your first document from a template to see it here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="truncate">{document.document_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generated on {new Date(document.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(document)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download Word
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
