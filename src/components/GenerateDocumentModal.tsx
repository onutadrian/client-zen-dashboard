
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { ContractTemplate } from '@/services/contractTemplateService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GenerateDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: ContractTemplate;
}

const GenerateDocumentModal = ({ open, onOpenChange, template }: GenerateDocumentModalProps) => {
  const { generateDocument } = useContractTemplates();
  const { projects } = useProjects();
  const { clients } = useClients();
  const { tasks } = useTasks();
  
  const [documentName, setDocumentName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      // Initialize variables
      const initialVariables: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialVariables[variable] = '';
      });
      setVariables(initialVariables);
      setDocumentName(`${template.name} - ${new Date().toLocaleDateString()}`);

      // Auto-populate some common variables
      if (selectedProjectId && selectedClientId) {
        populateVariablesFromData();
      }
    }
  }, [template, selectedProjectId, selectedClientId]);

  const populateVariablesFromData = () => {
    const project = projects.find(p => p.id === selectedProjectId);
    const client = clients.find(c => c.id.toString() === selectedClientId);
    
    if (project && client) {
      const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);
      const completedTasks = projectTasks.filter(t => t.status === 'completed');
      
      // Calculate totals
      const totalHours = completedTasks.reduce((sum, task) => sum + (task.workedHours || 0), 0);
      const hourlyRate = project.hourlyRate || client.price;
      const totalAmount = totalHours * hourlyRate;
      
      // Build task list for the document
      const taskList = completedTasks.map(task => 
        `${task.title} - ${task.workedHours || 0} hours`
      ).join('\n');

      const updatedVariables = {
        ...variables,
        client_name: client.name,
        project_name: project.name,
        project_start_date: project.startDate,
        project_end_date: project.endDate || 'Ongoing',
        total_hours: totalHours.toString(),
        hourly_rate: hourlyRate?.toString() || '0',
        total_amount: totalAmount.toString(),
        currency: client.currency || 'EUR',
        task_list: taskList,
        current_date: new Date().toLocaleDateString('ro-RO'),
        current_month: new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
      };

      setVariables(updatedVariables);
    }
  };

  const handleVariableChange = (variableName: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  const previewDocument = () => {
    let preview = template.template_content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });
    setGeneratedContent(preview);
  };

  useEffect(() => {
    previewDocument();
  }, [variables, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName.trim()) return;

    setIsSubmitting(true);
    try {
      await generateDocument(
        template.id,
        variables,
        documentName.trim(),
        selectedProjectId || undefined,
        selectedClientId ? parseInt(selectedClientId) : undefined
      );
      
      // Reset form
      setDocumentName('');
      setSelectedProjectId('');
      setSelectedClientId('');
      setVariables({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Document from {template.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="setup" className="space-y-4">
          <TabsList>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter document name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client (Optional)</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProjectId && selectedClientId && (
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={populateVariablesFromData}
                      className="w-full"
                    >
                      Auto-populate Data
                    </Button>
                  </div>
                )}
              </div>

              {template.variables.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Template Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {template.variables.map((variable) => (
                        <div key={variable} className="space-y-2">
                          <Label htmlFor={variable}>
                            <Badge variant="outline" className="mr-2">{variable}</Badge>
                          </Label>
                          <Input
                            id={variable}
                            value={variables[variable] || ''}
                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                            placeholder={`Enter ${variable.replace('_', ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Generating...' : 'Generate Document'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedContent}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentModal;
