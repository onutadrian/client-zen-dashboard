
import { useState, useEffect } from 'react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { ContractTemplate } from '@/services/contractTemplateService';

export const useDocumentGeneration = (template: ContractTemplate) => {
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

  // Function to generate preview content
  const generatePreviewContent = (templateContent: string, variablesData: Record<string, string>) => {
    let preview = templateContent;
    Object.entries(variablesData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });
    return preview;
  };

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
      
      // Generate initial preview
      const initialPreview = generatePreviewContent(template.template_content, initialVariables);
      setGeneratedContent(initialPreview);
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
    const newSavedVariables = { ...variables };
    setSavedVariables(newSavedVariables);
    
    // Generate preview with saved variables immediately
    const preview = generatePreviewContent(template.template_content, newSavedVariables);
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

  const handleSubmit = async (documentName: string, onClose: () => void) => {
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
        savedVariables,
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
      onClose();
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    documentName,
    setDocumentName,
    selectedProjectId,
    setSelectedProjectId,
    selectedClientId,
    setSelectedClientId,
    variables,
    savedVariables,
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
  };
};
