
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
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const [documentName, setDocumentName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [savedVariables, setSavedVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (template) {
      // Initialize variables
      const initialVariables: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialVariables[variable] = '';
      });
      setVariables(initialVariables);
      setSavedVariables(initialVariables);
      setDocumentName(`${template.name} - ${new Date().toLocaleDateString()}`);
      setHasUnsavedChanges(false);
    }
  }, [template]);

  // Check for unsaved changes when variables change
  useEffect(() => {
    const hasChanges = Object.keys(variables).some(key => 
      variables[key] !== savedVariables[key]
    );
    setHasUnsavedChanges(hasChanges);
  }, [variables, savedVariables]);

  const populateVariablesFromData = async () => {
    if (!selectedProjectId || !selectedClientId) {
      toast({
        title: "Selection Required",
        description: "Please select both a project and client first",
        variant: "destructive"
      });
      return;
    }

    setIsPopulating(true);
    
    try {
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
        
        toast({
          title: "Data Populated",
          description: "Template variables have been filled with project and client data. Click 'Save & Update Preview' to apply changes.",
        });
      }
    } catch (error) {
      console.error('Error populating variables:', error);
      toast({
        title: "Error",
        description: "Failed to populate variables from project data",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const saveAndUpdatePreview = () => {
    // Save the current variables
    setSavedVariables({ ...variables });
    
    // Generate preview with saved variables
    let preview = template.template_content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });
    setGeneratedContent(preview);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Preview Updated",
      description: "Template variables saved and preview updated successfully"
    });
  };

  const handleVariableChange = (variableName: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  // Initial preview generation with saved variables only
  useEffect(() => {
    if (template && Object.keys(savedVariables).length > 0) {
      let preview = template.template_content;
      Object.entries(savedVariables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        preview = preview.replace(regex, value);
      });
      setGeneratedContent(preview);
    }
  }, [template, savedVariables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName.trim()) return;

    if (hasUnsavedChanges) {
      toast({
        title: "Unsaved Changes",
        description: "Please save your variables before generating the document",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await generateDocument(
        template.id,
        savedVariables, // Use saved variables instead of current variables
        documentName.trim(),
        selectedProjectId || undefined,
        selectedClientId ? parseInt(selectedClientId) : undefined
      );
      
      // Reset form
      setDocumentName('');
      setSelectedProjectId('');
      setSelectedClientId('');
      setVariables({});
      setSavedVariables({});
      setHasUnsavedChanges(false);
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
            <TabsTrigger value="setup">
              Setup
              {hasUnsavedChanges && <Badge variant="destructive" className="ml-2 text-xs">Unsaved</Badge>}
            </TabsTrigger>
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

                <div className="flex items-end space-x-2">
                  {selectedProjectId && selectedClientId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={populateVariablesFromData}
                      disabled={isPopulating}
                      className="flex-1"
                    >
                      {isPopulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Populating...
                        </>
                      ) : (
                        'Auto-populate Data'
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {template.variables.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Template Variables</CardTitle>
                      <Button
                        type="button"
                        onClick={saveAndUpdatePreview}
                        variant={hasUnsavedChanges ? "default" : "outline"}
                        size="sm"
                        className={hasUnsavedChanges ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save & Update Preview
                      </Button>
                    </div>
                    {hasUnsavedChanges && (
                      <p className="text-sm text-amber-600">
                        You have unsaved changes. Click "Save & Update Preview" to apply them.
                      </p>
                    )}
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentModal;
